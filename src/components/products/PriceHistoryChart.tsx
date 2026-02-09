"use client";

import { useState, useEffect } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { RETAILER_INFO, Retailer } from "@/types";

interface PriceHistoryChartProps {
    productId: string;
    days?: number;
}

interface PricePoint {
    date: string;
    price: number;
    in_stock: boolean;
}

export function PriceHistoryChart({ productId, days = 30 }: PriceHistoryChartProps) {
    const [data, setData] = useState<Record<string, PricePoint[]>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchPriceHistory();
    }, [productId, days]);

    const fetchPriceHistory = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/price-history/${productId}?days=${days}`);
            const result = await response.json();

            if (result.historyByRetailer) {
                setData(result.historyByRetailer);
            } else if (result.history) {
                setData(result.history);
            }
        } catch (err) {
            setError("Failed to load price history");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Transform data for recharts
    const chartData = (() => {
        const retailers = Object.keys(data);
        if (retailers.length === 0) return [];

        // Get all unique dates
        const allDates = new Set<string>();
        retailers.forEach(retailer => {
            data[retailer]?.forEach(point => {
                allDates.add(new Date(point.date).toLocaleDateString());
            });
        });

        // Create combined data points
        const combined: any[] = [];
        const sortedDates = Array.from(allDates).sort((a, b) =>
            new Date(a).getTime() - new Date(b).getTime()
        );

        sortedDates.forEach(dateStr => {
            const point: any = { date: dateStr };
            retailers.forEach(retailer => {
                const pricePoint = data[retailer]?.find(p =>
                    new Date(p.date).toLocaleDateString() === dateStr
                );
                if (pricePoint) {
                    point[retailer] = pricePoint.price;
                }
            });
            combined.push(point);
        });

        return combined;
    })();

    const retailers = Object.keys(data);

    if (loading) {
        return (
            <div className="glass-chrome rounded-2xl p-6 h-80 flex items-center justify-center">
                <div className="text-white/40">Loading price history...</div>
            </div>
        );
    }

    if (error || retailers.length === 0) {
        return (
            <div className="glass-chrome rounded-2xl p-6 h-80 flex items-center justify-center">
                <div className="text-white/40">No price history available</div>
            </div>
        );
    }

    return (
        <div className="glass-chrome rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Price History (Last {days} Days)</h3>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis
                            dataKey="date"
                            stroke="rgba(255,255,255,0.5)"
                            tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                            tickLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                        />
                        <YAxis
                            stroke="rgba(255,255,255,0.5)"
                            tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                            tickLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                            tickFormatter={(value) => `${value.toLocaleString()}`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(0,0,0,0.9)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '12px',
                                color: 'white'
                            }}
                            formatter={(value: number, name: string) => [
                                `SAR ${value.toLocaleString()}`,
                                RETAILER_INFO[name as Retailer]?.name || name
                            ]}
                        />
                        <Legend
                            formatter={(value) => RETAILER_INFO[value as Retailer]?.name || value}
                            wrapperStyle={{ color: 'rgba(255,255,255,0.7)' }}
                        />
                        {retailers.map((retailer) => (
                            <Line
                                key={retailer}
                                type="monotone"
                                dataKey={retailer}
                                stroke={RETAILER_INFO[retailer as Retailer]?.color || "#888"}
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 6, strokeWidth: 2 }}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
