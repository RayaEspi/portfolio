"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

type DealerRow = { total: number; count: number };

export function DealerStats({ uploaderId }: { uploaderId: string }) {
    const router = useRouter();
    const [busy, setBusy] = useState(false);
    const [rows, setRows] = useState<DealerRow[]>([]);
    const [error, setError] = useState<string | null>(null);

    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        ChartJS.register(ArcElement, Tooltip, Legend);
    }, []);

    async function refresh(rebuild: boolean) {
        setBusy(true);
        setError(null);

        try {
            const url =
                `/api/dealer-stats?uploaderId=${encodeURIComponent(uploaderId)}` +
                (rebuild ? `&rebuild=1` : "");

            const res = await fetch(url, { cache: "no-store" });
            const json = await res.json();

            if (!res.ok || !json?.ok) {
                throw new Error(json?.message ?? "Failed to load dealer stats");
            }

            setRows(Array.isArray(json.rows) ? json.rows : []);
        } catch (e: any) {
            setError(e?.message ?? String(e));
        } finally {
            setBusy(false);
            setInitialized(true);
        }
    }

    useEffect(() => {
        setInitialized(false);
        setRows([]);
        setError(null);

        if (uploaderId) refresh(false);
    }, [uploaderId]);

    const totalHands = useMemo(
        () => rows.reduce((acc, r) => acc + (Number(r.count) || 0), 0),
        [rows]
    );

    const lesbianFlagPalette = useMemo(
        () => ["#FF0000", "#D52D00", "#FF9A56", "#FFFFFF", "#D162A4", "#A30262"],
        []
    );

    const pieColors = useMemo(
        () => rows.map((_, i) => lesbianFlagPalette[i % lesbianFlagPalette.length]),
        [rows, lesbianFlagPalette]
    );

    const pieData = useMemo(() => {
        return {
            labels: rows.map((r) => (Number(r.total) === 0 ? "bust" : String(r.total))),
            datasets: [
                {
                    label: "Count",
                    data: rows.map((r) => r.count),
                    backgroundColor: pieColors,
                    borderColor: pieColors,
                    borderWidth: 1,
                },
            ],
        };
    }, [rows, pieColors]);

    if (!initialized) {
        return <div className="p-3 text-sm text-zinc-900">Loading dealer stats…</div>;
    }

    return (
        <div className="list my-12">
            <div className="flex items-center justify-between mb-3">
                <div>
                    <div className="text-lg font-semibold text-zinc-900">Dealer totals</div>
                    <div className="text-sm opacity-70 text-zinc-900">
                        {busy ? "Loading…" : `${totalHands} dealer hands`}
                    </div>
                </div>
            </div>

            {error && <div className="p-3 mb-3">{error}</div>}

            {rows.length > 0 && (
                <div className="mb-4 p-3 w-1/2">
                    <Pie data={pieData} />
                </div>
            )}
        </div>
    );
}
