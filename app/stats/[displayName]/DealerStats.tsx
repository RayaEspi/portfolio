"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import type { ChartOptions } from "chart.js";

type DealerRow = { total: number; count: number };
type DailyRow = { day: string; profit: number };

export function DealerStats({ uploaderId }: { uploaderId: string }) {
    const router = useRouter();
    const [busy, setBusy] = useState(false);
    const [rows, setRows] = useState<DealerRow[]>([]);
    const [daily, setDaily] = useState<DailyRow[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        ChartJS.register(
            ArcElement,
            Tooltip,
            Legend,
            CategoryScale,
            LinearScale,
            BarElement
        );
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
            setDaily(Array.isArray(json.daily) ? json.daily : []);
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
        setDaily([]);
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

    const pieOptions = useMemo<ChartOptions<"pie">>(() => {
        return {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: (ctx) => {
                            const label = String(ctx.label ?? "");
                            const value = Number(ctx.parsed) || 0;

                            const dataArr = (ctx.dataset?.data ?? []) as Array<number | string>;
                            const total = dataArr.reduce<number>((acc, v) => acc + (Number(v) || 0), 0);

                            const pct = total > 0 ? (value / total) * 100 : 0;

                            return `${label}: ${value} (${pct.toFixed(1)}%)`;
                        },
                    },
                },
                legend: {
                    display: true,
                },
            },
        };
    }, []);

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

    const dailyLabels = useMemo(() => daily.map((d) => d.day), [daily]);

    const dailyBarColors = useMemo(
        () => daily.map((d) => (Number(d.profit) >= 0 ? "#16a34a" : "#dc2626")),
        [daily]
    );

    const dailyBarData = useMemo(() => {
        return {
            labels: dailyLabels,
            datasets: [
                {
                    label: "Dealer profit",
                    data: daily.map((d) => Number(d.profit) || 0),
                    backgroundColor: dailyBarColors,
                    borderColor: dailyBarColors,
                    borderWidth: 1,
                },
            ],
        };
    }, [daily, dailyLabels, dailyBarColors]);

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

            {(rows.length > 0 || daily.length > 0) && (
                <div className="d-stats flex flex-col md:flex-row md:items-start gap-6">
                    {rows.length > 0 && (
                        <div className="p-3 w-full md:w-1/2">
                            <Pie data={pieData} options={pieOptions} />
                        </div>
                    )}

                    {daily.length > 0 && (
                        <div className="d-stats p-3 w-full md:w-1/2">
                            <div className="text-lg font-semibold text-zinc-900 mb-1">
                                Daily dealer profit (last 20 dealing days)
                            </div>
                            <div className="text-sm opacity-70 text-zinc-900 mb-3">
                                Green = profit, red = loss
                            </div>
                            <Bar
                                data={dailyBarData}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: { display: false },
                                        tooltip: { enabled: true },
                                    },
                                    scales: {
                                        x: { ticks: { maxRotation: 0, autoSkip: true } },
                                        y: { beginAtZero: false },
                                    },
                                }}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );

}
