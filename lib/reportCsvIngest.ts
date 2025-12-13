import type { Db } from "mongodb";
import { decodeRoundPayload, parseRoundEntries } from "@/lib/gameIngest";

type ReportRow = {
  sourceDateTime: string;
  createdAt: Date;
  detailsBase64: string;
};

function parseReportDateTime(input: string): Date | null {
  const s = (input ?? "").trim();
  // Example: 26/04/2025 22.09.39 +03:00
  const m = s.match(
    // Some rows use a single-digit hour (e.g. "27/04/2025 0.06.56 +03:00"), so accept 1–2 digits.
    /^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{1,2})\.(\d{2})\.(\d{2})(?:\s+([+-]\d{2}:\d{2}|Z))?$/
  );
  if (!m) return null;
  const [, dd, mm, yyyy, HHraw, MM, SS, tz] = m;
  const HH = HHraw.padStart(2, "0");
  const iso = `${yyyy}-${mm}-${dd}T${HH}:${MM}:${SS}${tz ? tz : ""}`;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

function splitCsvLine(line: string, delimiter: string) {
  // This report format is simple (no quoted delimiters in fields). A minimal split is reliable here.
  return line.split(delimiter).map((v) => v.trim());
}

function parseReportCsv(text: string): { rows: ReportRow[]; invalid: number } {
  const raw = (text ?? "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const lines = raw.split("\n").map((l) => l.trimEnd());
  const nonEmpty = lines.filter((l) => l.trim().length > 0);
  if (nonEmpty.length === 0) return { rows: [], invalid: 0 };

  let cursor = 0;
  let delimiter = ";";
  if (/^sep=/i.test(nonEmpty[0])) {
    const m = nonEmpty[0].match(/^sep=(.+)$/i);
    if (m?.[1]) delimiter = m[1].trim();
    cursor = 1;
  }

  const headerLine = nonEmpty[cursor];
  if (!headerLine) return { rows: [], invalid: 0 };

  const headers = splitCsvLine(headerLine, delimiter).map((h) => h.toLowerCase());
  const idxDate = headers.findIndex((h) => h === "date and time" || (h.includes("date") && h.includes("time")));
  const idxDetails = headers.findIndex((h) => h === "details" || h.includes("detail"));
  if (idxDate === -1 || idxDetails === -1) {
    return { rows: [], invalid: nonEmpty.length - (cursor + 1) };
  }

  const rows: ReportRow[] = [];
  let invalid = 0;
  for (let i = cursor + 1; i < nonEmpty.length; i++) {
    const parts = splitCsvLine(nonEmpty[i], delimiter);
    const sourceDateTime = (parts[idxDate] ?? "").trim();
    const detailsBase64 = (parts[idxDetails] ?? "").trim();
    if (!sourceDateTime || !detailsBase64) {
      invalid++;
      continue;
    }
    const createdAt = parseReportDateTime(sourceDateTime);
    if (!createdAt) {
      invalid++;
      continue;
    }
    rows.push({ sourceDateTime, createdAt, detailsBase64 });
  }

  return { rows, invalid };
}

function outcomeBuckets(result: number) {
  // Result encoding from game base64 details:
  // Bust=0, Win=1, Draw=2, Loss=3, Surrender=6
  // For stats: Bust/Loss/Surrender => loss, Draw => draw, Win => win.
  const r = Number(result);
  if (r === 1) return { wins: 1, losses: 0, pushes: 0, other: 0 };
  if (r === 2) return { wins: 0, losses: 0, pushes: 1, other: 0 };
  if (r === 0 || r === 3 || r === 6) return { wins: 0, losses: 1, pushes: 0, other: 0 };
  return { wins: 0, losses: 0, pushes: 0, other: 1 };
}

function chunk<T>(arr: T[], size: number) {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export async function ingestReportCsv(opts: { db: Db; uploaderId: string; csvText: string }) {
  const { rows, invalid } = parseReportCsv(opts.csvText);
  if (rows.length === 0) {
    return { ok: false as const, error: "No rows found in CSV (or missing columns Date and time / Details)", inserted: 0, skipped: 0, invalid };
  }

  const gamesCol = opts.db.collection("games");
  const playersCol = opts.db.collection("players");
  const statsPlayer = opts.db.collection("stats_player");
  const statsCombo = opts.db.collection("stats_combo");
  const statsHost = opts.db.collection("stats_host");

  const gameDocs: any[] = [];
  const validRowIndexes: number[] = [];

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    try {
      const decoded = decodeRoundPayload(r.detailsBase64);
      const players = parseRoundEntries(decoded.entries);
      if (players.length === 0) continue;
      const dealerEntry = players.find((p) => p.dealer);
      if (!dealerEntry) continue;

      gameDocs.push({
        createdAt: r.createdAt,
        sourceDateTime: r.sourceDateTime,
        uploaderId: opts.uploaderId,
        hostId: dealerEntry.playerId,
        gameType: "cards",
        integrity: { version: 1 },
        players,
        payloadBase64: decoded.payloadBase64 ?? r.detailsBase64,
      });
      validRowIndexes.push(i);
    } catch {
      // Skip invalid rows silently; counted via invalid increment below.
    }
  }

  if (gameDocs.length === 0) {
    return { ok: false as const, error: "No valid game payloads found in CSV", inserted: 0, skipped: 0, invalid: invalid + rows.length };
  }

  let inserted = 0;
  let skipped = 0;
  const insertedIndexes = new Set<number>();

  try {
    const res: any = await gamesCol.insertMany(gameDocs, { ordered: false });
    const ids = res?.insertedIds ?? {};
    for (const k of Object.keys(ids)) insertedIndexes.add(Number(k));
    inserted = insertedIndexes.size;
  } catch (e: any) {
    const result = e?.result;
    const ids = result?.insertedIds ?? {};
    for (const k of Object.keys(ids)) insertedIndexes.add(Number(k));
    inserted = insertedIndexes.size;

    const dupIndexes = new Set<number>();
    const collect = (arr: any[]) => {
      for (const we of arr ?? []) {
        if (we?.code !== 11000) continue;
        if (typeof we?.index === "number") dupIndexes.add(we.index);
        else dupIndexes.add(dupIndexes.size + 10_000_000);
      }
    };
    collect(e?.writeErrors);
    collect(result?.result?.writeErrors);
    skipped = dupIndexes.size;
  }

  // Upsert players + stats only for newly inserted docs.
  const insertedDocs = Array.from(insertedIndexes).map((i) => gameDocs[i]);
  if (insertedDocs.length === 0) {
    return { ok: true as const, inserted: 0, skipped, invalid: invalid + (rows.length - validRowIndexes.length) };
  }

  const nowByDoc = (doc: any) => doc.createdAt ?? new Date();

  const playerById = new Map<string, any>();
  for (const doc of insertedDocs) {
    const createdAt = nowByDoc(doc);
    for (const p of doc.players ?? []) {
      if (!p?.playerId) continue;
      const existing = playerById.get(p.playerId);
      if (!existing) {
        playerById.set(p.playerId, {
          _id: p.playerId,
          playerTag: p.playerTag,
          name: p.name,
          world: p.world,
          createdAt,
          updatedAt: createdAt,
        });
        continue;
      }

      // Keep the *first ever* round timestamp as createdAt.
      if (createdAt < existing.createdAt) existing.createdAt = createdAt;
      if (createdAt > existing.updatedAt) existing.updatedAt = createdAt;
      existing.playerTag = p.playerTag;
      existing.name = p.name;
      existing.world = p.world;
    }
  }

  const playerOps = Array.from(playerById.values()).map((p) => ({
    updateOne: {
      filter: { _id: p._id },
      update: {
        $setOnInsert: { _id: p._id },
        $set: { playerTag: p.playerTag, name: p.name, world: p.world, updatedAt: p.updatedAt },
        // Ensure createdAt is the first round the player ever appeared in.
        $min: { createdAt: p.createdAt },
      },
      upsert: true,
    },
  }));

  for (const batch of chunk(playerOps, 1000)) {
    if (batch.length) await playersCol.bulkWrite(batch, { ordered: false });
  }

  // Aggregate stats
  const playerAgg = new Map<string, any>();
  const comboAgg = new Map<string, any>();
  const hostAgg = new Map<string, any>();

  for (const doc of insertedDocs) {
    const createdAt = nowByDoc(doc);
    const hostId = doc.hostId;
    if (!hostAgg.has(hostId)) {
      hostAgg.set(hostId, { gamesHosted: 0, playerWins: 0, playerLosses: 0, playerPushes: 0, playerOtherResults: 0, betTotal: 0, payoutTotal: 0, createdAt, updatedAt: createdAt });
    }
    const ha = hostAgg.get(hostId);
    ha.gamesHosted += 1;
    ha.updatedAt = createdAt;

    const players = Array.isArray(doc.players) ? doc.players : [];
    for (const p of players) {
      if (p.dealer) continue;
      const o = outcomeBuckets(Number(p.result) || 0);
      const bet = Number(p.bet) || 0;
      const payout = Number(p.payout) || 0;
      const net = payout - bet;

      if (!playerAgg.has(p.playerId)) {
        playerAgg.set(p.playerId, {
          playerTag: p.playerTag,
          name: p.name,
          world: p.world,
          games: 0,
          wins: 0,
          losses: 0,
          pushes: 0,
          otherResults: 0,
          betTotal: 0,
          payoutTotal: 0,
          net: 0,
          doubleDowns: 0,
          splits: 0,
          createdAt,
          updatedAt: createdAt,
        });
      }
      const pa = playerAgg.get(p.playerId);
      pa.playerTag = p.playerTag;
      pa.name = p.name;
      pa.world = p.world;
      pa.games += 1;
      pa.wins += o.wins;
      pa.losses += o.losses;
      pa.pushes += o.pushes;
      pa.otherResults += o.other;
      pa.betTotal += bet;
      pa.payoutTotal += payout;
      pa.net += net;
      pa.doubleDowns += p.isDoubleDown ? 1 : 0;
      pa.splits += (Number(p.splitNum) || 0) > 0 ? 1 : 0;
      pa.updatedAt = createdAt;

      if (p.comboKey) {
        if (!comboAgg.has(p.comboKey)) {
          comboAgg.set(p.comboKey, { seen: 0, wins: 0, losses: 0, pushes: 0, otherResults: 0, betTotal: 0, payoutTotal: 0, net: 0, createdAt, updatedAt: createdAt });
        }
        const ca = comboAgg.get(p.comboKey);
        ca.seen += 1;
        ca.wins += o.wins;
        ca.losses += o.losses;
        ca.pushes += o.pushes;
        ca.otherResults += o.other;
        ca.betTotal += bet;
        ca.payoutTotal += payout;
        ca.net += net;
        ca.updatedAt = createdAt;
      }

      ha.playerWins += o.wins;
      ha.playerLosses += o.losses;
      ha.playerPushes += o.pushes;
      ha.playerOtherResults += o.other;
      ha.betTotal += bet;
      ha.payoutTotal += payout;
    }
    ha.net = ha.payoutTotal - ha.betTotal;
  }

  const playerStatOps = Array.from(playerAgg.entries()).map(([playerId, a]) => ({
    updateOne: {
      filter: { _id: playerId },
      update: {
        // Avoid ConflictingUpdateOperators (code 40): the same path cannot be targeted by
        // both $setOnInsert and $set in a single update.
        $setOnInsert: { _id: playerId, createdAt: a.createdAt },
        $set: { playerTag: a.playerTag, name: a.name, world: a.world, updatedAt: a.updatedAt },
        $inc: {
          games: a.games,
          wins: a.wins,
          losses: a.losses,
          pushes: a.pushes,
          otherResults: a.otherResults,
          betTotal: a.betTotal,
          payoutTotal: a.payoutTotal,
          net: a.net,
          doubleDowns: a.doubleDowns,
          splits: a.splits,
        },
      },
      upsert: true,
    },
  }));

  const comboOps = Array.from(comboAgg.entries()).map(([comboKey, a]) => ({
    updateOne: {
      filter: { _id: comboKey },
      update: {
        $setOnInsert: { _id: comboKey, createdAt: a.createdAt },
        $set: { updatedAt: a.updatedAt },
        $inc: {
          seen: a.seen,
          wins: a.wins,
          losses: a.losses,
          pushes: a.pushes,
          otherResults: a.otherResults,
          betTotal: a.betTotal,
          payoutTotal: a.payoutTotal,
          net: a.net,
        },
      },
      upsert: true,
    },
  }));

  const hostOps = Array.from(hostAgg.entries()).map(([hostId, a]) => ({
    updateOne: {
      filter: { _id: hostId },
      update: {
        $setOnInsert: { _id: hostId, createdAt: a.createdAt },
        $set: { updatedAt: a.updatedAt },
        $inc: {
          gamesHosted: a.gamesHosted,
          playerWins: a.playerWins,
          playerLosses: a.playerLosses,
          playerPushes: a.playerPushes,
          playerOtherResults: a.playerOtherResults,
          betTotal: a.betTotal,
          payoutTotal: a.payoutTotal,
          net: a.net,
        },
      },
      upsert: true,
    },
  }));

  for (const batch of chunk(playerStatOps, 1000)) {
    if (batch.length) await statsPlayer.bulkWrite(batch, { ordered: false });
  }
  for (const batch of chunk(comboOps, 1000)) {
    if (batch.length) await statsCombo.bulkWrite(batch, { ordered: false });
  }
  for (const batch of chunk(hostOps, 1000)) {
    if (batch.length) await statsHost.bulkWrite(batch, { ordered: false });
  }

  const invalidPayloads = rows.length - validRowIndexes.length;
  return { ok: true as const, inserted, skipped, invalid: invalid + invalidPayloads };
}
