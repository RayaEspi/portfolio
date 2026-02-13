import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ensureAuthCollections, ensureGameCollections, getDb, type UserDoc } from "@/lib/db";
import { playerTagToParts } from "@/lib/gameIngest";
import { DealerStats } from "./DealerStats";
import {LogoutButton} from "@/app/admin/LogoutButton";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

let uID;
function escapeRegex(input: string) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function norm(input: unknown) {
  const s = typeof input === "string" ? input : input == null ? "" : String(input);
  return s.normalize("NFKC").trim().toLowerCase();
}

function emailLocalPart(email: unknown) {
  const e = typeof email === "string" ? email : email == null ? "" : String(email);
  const at = e.indexOf("@");
  return at === -1 ? e : e.slice(0, at);
}

function normalizePlayerTag(input: string) {
  return playerTagToParts(input ?? "").playerTag;
}

function resolveCanonical(tag: string, aliasToPrimary: Map<string, string>) {
  let cur = normalizePlayerTag(tag);
  const seen = new Set<string>();
  while (aliasToPrimary.has(cur) && !seen.has(cur)) {
    seen.add(cur);
    cur = normalizePlayerTag(aliasToPrimary.get(cur) ?? cur);
  }
  return cur;
}

function fmtInt(n: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n);
}

function fmtMoney(n: number) {
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "+";
  return `${sign}${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(abs)}`;
}

type PlayerAggRow = {
  playerTag: string;
  name: string;
  world: string;
  games: number;
  betTotal: number;
  payoutTotal: number;
  net: number;
};

export type LoadStatsPlayerRow = {
  playerTag: string;
  name: string;
  world: string;
  games: number;
  betTotal: number;
  payoutTotal: number;
  net: number;
};

export type LoadStatsDebug = {
  db: string;
  lookedFor: string;
  normalized: string;
  sampleNames: string[];
};

export type LoadStatsResult =
    | { ok: false }
    | { ok: false; debug: LoadStatsDebug }
    | {
  ok: true;
  displayName: string;
  newestHostTag: string; // your code returns "" when missing
  roundsHosted: number;
  totalNet: number;
  dealerNet: number;
  totalBet: number;
  totalPayout: number;
  playerNet: number;
  topWinners: LoadStatsPlayerRow[];
  topLosers: LoadStatsPlayerRow[];
  topActive: LoadStatsPlayerRow[];
  totalPlayers: number;
};

async function loadStats(displayName: string): Promise<LoadStatsResult> {
  await ensureAuthCollections();
  await ensureGameCollections();

  const db = await getDb();
  const users = db.collection<UserDoc>("users");
  const games = db.collection("games");
  const aliases = db.collection("aliases");
  const hosts = db.collection("stats_host");
  const blacklist = db.collection("blacklist");

  let dn = (displayName ?? "").trim();
  try {
    dn = decodeURIComponent(dn);
  } catch {
    dn = dn;
  }
  if (!dn) return { ok: false as const };

  const dnNorm = norm(dn);

  let user =
    (await users.findOne(
      { name: dn },
      { collation: { locale: "en", strength: 2 } }
    )) ??
    (await users.findOne({
      $expr: {
        $eq: [
          { $toLower: { $trim: { input: { $ifNull: ["$name", ""] } } } },
          dnNorm,
        ],
      },
    })) ??
    (await users.findOne({ email: dnNorm })) ??
    (await users.findOne({
      $expr: {
        $eq: [
          {
            $toLower: {
              $trim: {
                input: {
                  $ifNull: [
                    { $arrayElemAt: [{ $split: ["$email", "@"] }, 0] },
                    "",
                  ],
                },
              },
            },
          },
          dnNorm,
        ],
      },
    })) ??
    (await users.findOne({ name: { $regex: `^\\s*${escapeRegex(dn)}\\s*$`, $options: "i" } }));

  if (!user?._id) {
    const fallback = await users
      .find({}, { projection: { _id: 1, name: 1, email: 1 } })
      .limit(2000)
      .toArray();
    user =
      (fallback as any[]).find((u) => norm(u?.name) === dnNorm) ??
      (fallback as any[]).find((u) => norm(u?.email) === dnNorm) ??
      (fallback as any[]).find((u) => norm(emailLocalPart(u?.email)) === dnNorm) ??
      null;
  }

  if (!user?._id) {
    if (process.env.NODE_ENV !== "production") {
      const samples = await users
        .find({}, { projection: { name: 1 } })
        .limit(25)
        .toArray();
      return {
        ok: false as const,
        debug: {
          db: db.databaseName,
          lookedFor: dn,
          normalized: dnNorm,
          sampleNames: samples.map((s: any) => s?.name).filter(Boolean),
        },
      };
    }
    return { ok: false as const };
  }

  const uploaderId = user._id.toHexString();
  uID = uploaderId;

  const newestGame = await games.findOne(
    { uploaderId },
    {
      sort: { createdAt: -1 },
      projection: { createdAt: 1, players: 1 },
    }
  );

  const newestHostTag = (() => {
    const ps: any[] = Array.isArray((newestGame as any)?.players) ? (newestGame as any).players : [];
    const d = ps.find((p) => p && p.dealer);
    return typeof d?.playerTag === "string" && d.playerTag.trim() ? d.playerTag.trim() : "";
  })();

  const roundsHosted = await games.countDocuments({ uploaderId });

  const aliasRows = await aliases
    .find({}, { projection: { primaryTag: 1, aliasTag: 1 } })
    .sort({ createdAt: -1 })
    .toArray();

  const aliasToPrimary = new Map<string, string>();
  for (const r of aliasRows as any[]) {
    const a = typeof r?.aliasTag === "string" ? normalizePlayerTag(r.aliasTag) : "";
    const p = typeof r?.primaryTag === "string" ? normalizePlayerTag(r.primaryTag) : "";
    if (a && p && a !== p) aliasToPrimary.set(a, p);
  }

  const playerRows = (await games
    .aggregate<PlayerAggRow>([
      { $match: { uploaderId } },
      { $project: { players: 1 } },
      { $unwind: "$players" },
      { $match: { "players.dealer": { $ne: true } } },
      {
        $group: {
          _id: { playerTag: "$players.playerTag", gameId: "$_id" },
          name: { $first: "$players.name" },
          world: { $first: "$players.world" },
          betTotal: { $sum: { $ifNull: ["$players.bet", 0] } },
          payoutTotal: { $sum: { $ifNull: ["$players.payout", 0] } },
        },
      },
      {
        $project: {
          _id: 0,
          playerTag: "$_id.playerTag",
          name: 1,
          world: 1,
          games: 1,
          betTotal: 1,
          payoutTotal: 1,
          net: { $subtract: ["$payoutTotal", "$betTotal"] },
        },
      },
      {
        $group: {
          _id: "$playerTag",
          name: { $first: "$name" },
          world: { $first: "$world" },
          games: { $sum: 1 },
          betTotal: { $sum: "$betTotal" },
          payoutTotal: { $sum: "$payoutTotal" },
          net: { $sum: "$net" },
        },
      },
      {
        $project: {
          _id: 0,
          playerTag: "$_id",
          name: 1,
          world: 1,
          games: 1,
          betTotal: 1,
          payoutTotal: 1,
          net: 1,
        },
      },
    ])
    .toArray()) as PlayerAggRow[];

  const byCanonical = new Map<
    string,
    {
      playerTag: string;
      name: string;
      world: string;
      games: number;
      betTotal: number;
      payoutTotal: number;
      net: number;
    }
  >();

  for (const r of playerRows) {
    const rawTag = typeof r?.playerTag === "string" ? normalizePlayerTag(r.playerTag) : "";
    if (!rawTag) continue;
    const canon = resolveCanonical(rawTag, aliasToPrimary);
    const prev = byCanonical.get(canon);

    const parts = playerTagToParts(canon);
    const baseName = parts.name || prev?.name || r.name || canon;
    const baseWorld = parts.world || prev?.world || r.world || "unknown";

    if (!prev) {
      byCanonical.set(canon, {
        playerTag: canon,
        name: baseName,
        world: baseWorld,
        games: Number(r.games) || 0,
        betTotal: Number(r.betTotal) || 0,
        payoutTotal: Number(r.payoutTotal) || 0,
        net: Number(r.net) || 0,
      });
    } else {
      prev.name = baseName;
      prev.world = baseWorld;
      prev.games += Number(r.games) || 0;
      prev.betTotal += Number(r.betTotal) || 0;
      prev.payoutTotal += Number(r.payoutTotal) || 0;
      prev.net = prev.payoutTotal - prev.betTotal;
    }
  }

  const row = await games
      .aggregate<{
        totalProfit: number;
        totalBet: number;
        totalPayout: number;
      }>([
        { $match: { uploaderId } },
        {
          $group: {
            _id: null,
            totalProfit: { $sum: { $ifNull: ["$profit", 0] } },
            totalBet: { $sum: { $ifNull: ["$collected", 0] } },
            totalPayout: { $sum: { $ifNull: ["$paidOut", 0] } },
          },
        },
        { $project: { _id: 0, totalProfit: 1, totalBet: 1, totalPayout: 1 } },
      ])
      .next();

  const totals = row ?? { totalProfit: 0, totalBet: 0, totalPayout: 0 };
  console.log("[stats] totals:", totals);

  const mergedPlayers = Array.from(byCanonical.values());
  const totalBet = totals.totalBet;
  const totalPayout = totals.totalPayout;
  const playerNet = totalPayout - totalBet;
  const dealerNet = totals.totalProfit;

  type BlacklistDoc = { playerTag: string; createdBy: string };

  const blacklistDocs = await blacklist
      .find<BlacklistDoc>({ createdBy: uploaderId })
      .project({ playerTag: 1 })
      .toArray();

  const blacklistedTagsForUploader = new Set(blacklistDocs.map((b) => norm(b.playerTag)));

  const topWinners = mergedPlayers
      .filter((p) => p.net > 0 && !blacklistedTagsForUploader.has(norm(p.playerTag ?? "")))
      .sort((a, b) => b.net - a.net)
      .slice(0, 10);

  const topLosers = mergedPlayers
      .filter((p) => p.net < 0 && !blacklistedTagsForUploader.has(norm(p.playerTag ?? "")))
    .sort((a, b) => a.net - b.net)
    .slice(0, 10);

  const topActive = mergedPlayers
    .filter(p => !blacklistedTagsForUploader.has(norm(p.playerTag ?? "")))
    .slice()
    .sort((a, b) => b.games - a.games || b.betTotal - a.betTotal)
    .slice(0, 10);

  const totalNet = mergedPlayers.reduce(
      (sum, p) => sum + ((Number(p.payoutTotal) || 0) - (Number(p.betTotal) || 0)),
      0,
  );

  console.log("[stats] topWinners:", topWinners);
  console.log("[stats] topLosers:", topLosers);
  console.log("[stats] topActive:", topActive);


  return {
    ok: true as const,
    displayName: user.name ?? displayName,
    newestHostTag,
    roundsHosted,
    totalNet,
    dealerNet,
    totalBet,
    totalPayout,
    playerNet,
    topWinners,
    topLosers,
    topActive,
    totalPlayers: mergedPlayers.length,
  };
}

export async function generateMetadata({
                                         params,
                                       }: {
  params: Promise<{ displayName: string }>;
}): Promise<Metadata> {
  const { displayName } = await params;

  const result = await loadStats(displayName);
  if (!result.ok) return { title: "Stats" };

  const data = result;
  const title = data.newestHostTag ? `${data.newestHostTag} | Stats` : `${data.displayName} | Stats`;
  return { title };
}

// get id with displayName
function getIdFromDisplayName(displayName: string): Promise<string | null> {
  return new Promise(async (resolve) => {
    await ensureAuthCollections();
    const db = await getDb();
    const users = db.collection<UserDoc>("users");

    const user = await users.findOne(
        { name: displayName },
        { collation: { locale: "en", strength: 2 }, projection: { _id: 1 } }
    );

    if (user?._id) {
      resolve(user._id.toHexString());
    } else {
      resolve(null);
    }
  });
}

export default async function DealerStatsPage({
                                                params,
                                              }: {
  params: Promise<{ displayName: string }>;
}) {
  const { displayName } = await params;
  const uploaderID = await getIdFromDisplayName(displayName);

  const result = await loadStats(displayName);
  console.log("[stats] displayName:", displayName);
  console.dir(result, { depth: 6 });

  if (!result.ok) {
    const dbg = (result as any).debug;
    return (
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h1 className="text-xl font-semibold text-zinc-900">Stats lookup failed</h1>
          <p className="mt-2 text-sm text-zinc-700">
            Could not find a user for{" "}
            <span className="font-medium text-zinc-900">{String(displayName)}</span>.
          </p>

          {dbg ? (
              <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-xs text-zinc-800">
                <div><span className="font-semibold">DB:</span> {String(dbg.db)}</div>
                <div className="mt-2"><span className="font-semibold">Sample user names:</span></div>
                <div className="mt-1">{String(dbg.sampleUserNames ?? [])}</div>
              </div>
          ) : (
              <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-xs text-zinc-800">
                No debug payload was provided by <code>loadStats()</code>.
              </div>
          )}
        </div>
    );
  }

  const data = result;
  let title = data.newestHostTag || data.displayName;

  if (title === "Lini White@Alpha") {
    title = "Lini Espi @ Alpha";
  }

  return (
    <div className="mx-auto min-h-screen w-full max-w-5xl px-4 py-10">
      <div className="rounded-3xl border border-[#FF9FC6]/35 bg-gradient-to-b from-white to-[#FF9FC6]/90 p-6 shadow-[0_0_0_1px_rgba(255,159,198,0.18),0_18px_60px_rgba(255,159,198,0.22)]">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-zinc-900">{title}</h1>
          <p className="text-sm text-zinc-700">
            Stats for uploader <span className="font-medium text-zinc-900">{data.displayName}</span>
            {data.totalPlayers ? (
              <>
                {" "}• {fmtInt(data.totalPlayers)} players
              </>
            ) : null}
          </p>
        </div>

        {data.roundsHosted === 0 ? (
          <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-700">
            No rounds uploaded yet.
          </div>
        ) : (
          <>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                <div className="text-xs font-medium text-zinc-500">Rounds hosted</div>
                <div className="mt-2 text-2xl font-semibold text-zinc-900">{fmtInt(data.roundsHosted)}</div>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                <div className="text-xs font-medium text-zinc-500">Profit / loss (dealer)</div>
                <div className="mt-2 text-2xl font-semibold text-zinc-900">{fmtMoney(data.dealerNet)}</div>
                <div className="mt-1 text-xs text-zinc-500">Players net: {fmtMoney(data.playerNet)}</div>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                <div className="text-xs font-medium text-zinc-500">Volume</div>
                <div className="mt-2 text-sm text-zinc-800">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-zinc-600">Total bet</span>
                    <span className="font-medium text-zinc-900">{fmtInt(data.totalBet)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <span className="text-zinc-600">Total payout</span>
                    <span className="font-medium text-zinc-900">{fmtInt(data.totalPayout)}</span>
                  </div>
                </div>
              </div>
            </div>


            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-zinc-900">Top 10 winners</h2>
                  <span className="text-xs text-zinc-500">by net</span>
                </div>
                <ol className="mt-3 space-y-2 text-sm">
                  {data.topWinners.length ? (
                      data.topWinners.map((p, idx) => (
                          <li key={p.name} className="flex items-center justify-between gap-3">
                        <span className="truncate text-zinc-800">
                          <span className="mr-2 text-xs text-zinc-500">#{idx + 1}</span>
                          <span className="font-medium text-zinc-900">{p.playerTag}</span>
                        </span>
                            <span className="shrink-0 font-medium text-zinc-900">{fmtMoney(p.net)}</span>
                          </li>
                      ))
                  ) : (
                      <li className="text-zinc-600">No winners yet.</li>
                  )}
                </ol>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-zinc-900">Top 10 losers</h2>
                  <span className="text-xs text-zinc-500">by net</span>
                </div>
                <ol className="mt-3 space-y-2 text-sm">
                  {data.topLosers.length ? (
                      data.topLosers.map((p, idx) => (
                          <li key={p.name} className="flex items-center justify-between gap-3">
                        <span className="truncate text-zinc-800">
                          <span className="mr-2 text-xs text-zinc-500">#{idx + 1}</span>
                          <span className="font-medium text-zinc-900">{p.playerTag}</span>
                        </span>
                            <span className="shrink-0 font-medium text-zinc-900">{fmtMoney(p.net)}</span>
                          </li>
                      ))
                  ) : (
                      <li className="text-zinc-600">No losers yet.</li>
                  )}
                </ol>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-zinc-900">Top 10 most active</h2>
                  <span className="text-xs text-zinc-500">by games</span>
                </div>
                <ol className="mt-3 space-y-2 text-sm">
                  {data.topActive.length ? (
                      data.topActive.map((p, idx) => (
                          <li key={p.name} className="flex items-center justify-between gap-3">
                        <span className="truncate text-zinc-800">
                          <span className="mr-2 text-xs text-zinc-500">#{idx + 1}</span>
                          <span className="font-medium text-zinc-900">{p.playerTag}</span>
                        </span>
                            <span className="shrink-0 font-medium text-zinc-900">{fmtInt(p.games)}</span>
                          </li>
                      ))
                  ) : (
                      <li className="text-zinc-600">No players yet.</li>
                  )}
                </ol>
              </div>
            </div>

            {uploaderID ? (
                <DealerStats uploaderId={uploaderID}/>
            ) : (
                <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-700">
                  Could not resolve uploader ID for this display name.
                </div>
            )}


            <div className="mt-6 rounded-2xl border border-[#FF9FC6]/35 bg-white/80 p-4 text-xs text-zinc-700 shadow-[0_0_0_1px_rgba(255,159,198,0.10)]">
              Stats are usually updated after each hosting session.
            </div>
          </>
        )}
      </div>
    </div>
  );
}
