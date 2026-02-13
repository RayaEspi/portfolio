"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from 'react-chartjs-2';
import {ensureAuthCollections, ensureGameCollections, getDb, UserDoc} from "@/lib/db";

export function DealerStats() {
    const router = useRouter();
    const [busy, setBusy] = useState(false);

    ChartJS.register(ArcElement, Tooltip, Legend);
}

async function loadData(displayName: string) {
    await ensureAuthCollections();
    await ensureGameCollections();

    const db = await getDb();
    const users = db.collection<UserDoc>("users");
    const games = db.collection("games");
    const aliases = db.collection("aliases");
    const hosts = db.collection("stats_host");
    const blacklist = db.collection("blacklist");
}