import { NextResponse } from "next/server";
import { ensureAuthCollections, ensureGameCollections, getDb } from "@/lib/db";

type GameDoc = {
    uploaderId: string;
    gameType?: string;
    profit?: number;
    createdAt?: Date;
    sourceDateTime?: string;
    players?: Array<{ dealer?: boolean; cards?: Array<number | string> }>;
};

export async function GET(req: Request) {
    await ensureAuthCollections();
    await ensureGameCollections();

    const url = new URL(req.url);
    const uploaderId = (url.searchParams.get("uploaderId") ?? "").trim();

    if (!uploaderId) {
        return NextResponse.json({ ok: false, message: "Missing uploaderId" }, { status: 400 });
    }

    const db = await getDb();
    const games = db.collection<GameDoc>("games");

    const allowed = [17, 18, 19, 20, 21];
    const faceCards = [10, 11, 12, 13];

    const rowsRaw = await games
        .aggregate([
            { $match: { uploaderId, gameType: "cards" } },
            { $unwind: { path: "$players", preserveNullAndEmptyArrays: false } },
            { $match: { "players.dealer": true } },
            {
                $addFields: {
                    totalRaw: {
                        $sum: {
                            $map: {
                                input: { $ifNull: ["$players.cards", []] },
                                as: "c",
                                in: {
                                    $let: {
                                        vars: { n: { $toInt: "$$c" } },
                                        in: { $cond: [{ $in: ["$$n", faceCards] }, 10, "$$n"] },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    total: {
                        $switch: {
                            branches: [
                                { case: { $in: ["$totalRaw", allowed] }, then: "$totalRaw" },
                                { case: { $gt: ["$totalRaw", 21] }, then: 0 },
                            ],
                            default: null,
                        },
                    },
                },
            },
            { $match: { total: { $ne: null } } },
            { $group: { _id: "$total", count: { $sum: 1 } } },
            { $project: { _id: 0, total: "$_id", count: 1 } },
            { $sort: { total: 1 } },
        ])
        .toArray();

    const wantTotals = [0, ...allowed];
    const byTotal = new Map<number, number>(rowsRaw.map((r) => [Number(r.total), Number(r.count)]));
    const rows = wantTotals.map((t) => ({ total: t, count: byTotal.get(t) ?? 0 }));

    const dailyRaw = await games
        .aggregate([
            { $match: { uploaderId, gameType: "cards" } },
            { $match: { players: { $elemMatch: { dealer: true } } } },

            {
                $addFields: {
                    sourceParsed: {
                        $dateFromString: {
                            dateString: "$sourceDateTime",
                            format: "%d/%m/%Y %H.%M.%S %z",
                            onError: null,
                            onNull: null,
                        },
                    },
                },
            },
            {
                $addFields: {
                    dt: { $ifNull: ["$sourceParsed", "$createdAt"] },
                },
            },

            {
                $project: {
                    day: {
                        $dateToString: {
                            date: "$dt",
                            format: "%Y-%m-%d",
                            timezone: "America/Chicago",
                        },
                    },
                    profit: { $toDouble: { $ifNull: ["$profit", 0] } },
                },
            },

            { $group: { _id: "$day", profit: { $sum: "$profit" } } },
            { $project: { _id: 0, day: "$_id", profit: 1 } },
            { $sort: { day: -1 } },
            { $limit: 20 },
            { $sort: { day: 1 } },
        ])
        .toArray();

    const daily = dailyRaw.map((d) => ({
        day: String(d.day),
        profit: Number(d.profit) || 0,
    }));

    return NextResponse.json({ ok: true, uploaderId, rows, daily });
}
