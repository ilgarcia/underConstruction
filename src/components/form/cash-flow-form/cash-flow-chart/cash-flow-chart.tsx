"use client";

import { useState, useEffect, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { ChartDataPoint } from "./types";
import { formatDateShort } from "@/helpers/date";
import { Spinner } from "@/components/ui/spinner";

/**
 * Generates 30 days of mock cash flow data starting from `startDate`.
 */
function generateMockData(startDate: Date): ChartDataPoint[] {
  const data: ChartDataPoint[] = [];
  let balance = 12_000;

  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);

    // Simulate small random daily variation
    const delta = (Math.random() - 0.45) * 1_200;
    balance = Math.max(0, balance + delta);

    data.push({
      date: formatDateShort(date),
      value: Math.round(balance),
    });
  }

  return data;
}

/**
 * Line chart displaying mock cash flow projection over 30 days.
 * Uses a manual ResizeObserver to bypass Recharts dimension warnings.
 */
export function CashFlowChart() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const startDate = new Date();
  const data = generateMockData(startDate);

  useEffect(() => {
    // Initial measurement
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDimensions({ width: rect.width, height: rect.height });

      const resizeObserver = new ResizeObserver((entries) => {
        if (!entries || entries.length === 0) return;
        const entry = entries[0];
        // Use borderBoxSize for most accurate dimensions relative to the container
        const width = entry.borderBoxSize?.[0]?.inlineSize ?? entry.contentRect.width;
        const height = entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height;

        setDimensions({ width, height });
      });

      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []);

  // Only render LineChart if we have valid, positive dimensions.
  // We use 50px as a safe threshold for "actually visible".
  const isReady = dimensions.width > 50 && dimensions.height > 50;

  return (
    <div className="flex-1 w-full min-w-0 min-h-0 relative bg-zinc-50/50 dark:bg-zinc-900/10">
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full min-h-[300px] flex items-center justify-center overflow-hidden"
      >
        {isReady ? (
          <LineChart
            width={dimensions.width}
            height={dimensions.height}
            data={data}
            margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="currentColor"
              className="opacity-10"
            />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              interval={4}
              className="text-muted-foreground"
            />
            <YAxis
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `R$ ${(Number(v) / 1_000).toFixed(1)}k`}
              className="text-muted-foreground"
              width={68}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "0",
                fontSize: "0.8rem",
                border: "1px solid var(--border)",
                background: "var(--card)",
                color: "var(--card-foreground)",
              }}
              formatter={(value) => [
                `R$ ${Number(value).toLocaleString("pt-BR")}`,
                "Saldo",
              ]}
              labelClassName="font-medium"
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="var(--primary)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          </LineChart>

        ) : (
          <Spinner className="size-6 text-muted-foreground" />
        )}
      </div>
    </div>
  );
}
