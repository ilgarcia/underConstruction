"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import {
  useWalletInit,
  useReceivableList,
  useExpensesList,
  useExtraExpenseList,
  useCreditCardInit,
  useCreditCardInvoices,
  useCardCharges,
} from "@/hooks";
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/helpers/currency";
import { formatDateShort } from "@/helpers/date";
import { Spinner } from "@/components/ui/spinner";
import { ChartRange } from "./types";
import {
  simulateCashFlow,
  daysUntilEndOfMonth,
  toDailyPoints,
  toMonthlyPoints,
} from "./simulate";

const RANGES: { id: ChartRange; label: string }[] = [
  { id: "month", label: "Mês vigente" },
  { id: "six-months", label: "Próximos 6 meses" },
];

const tooltipStyle = {
  borderRadius: "0",
  fontSize: "0.8rem",
  border: "1px solid var(--border)",
  background: "var(--card)",
  color: "var(--card-foreground)",
};

/**
 * Measures a container so Recharts can render with explicit dimensions
 * (bypasses Recharts dimension warnings from ResponsiveContainer).
 */
function useContainerSize() {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setSize({ width: rect.width, height: rect.height });

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      setSize({
        width: entry.borderBoxSize?.[0]?.inlineSize ?? entry.contentRect.width,
        height: entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height,
      });
    });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, size, isReady: size.width > 50 && size.height > 50 };
}

function Highlight({ label, value, tone }: { label: string; value: string; tone?: "accent" }) {
  return (
    <div className="flex flex-col gap-1 bg-muted px-4 py-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={cn("font-mono text-lg font-bold", tone === "accent" && "text-primary")}>
        {value}
      </span>
    </div>
  );
}

/**
 * Projected balance chart with two ranges: the current month day by day (step chart)
 * and the next 6 months (end-of-month line plus each month's lowest balance).
 */
export function CashFlowChart() {
  const [range, setRange] = useState<ChartRange>("month");
  const { ref, size, isReady } = useContainerSize();
  const [startDate] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate());
  });

  const { wallet, isLoading: isWalletLoading } = useWalletInit();
  const initialBalance = wallet?.vl_balance ? Number(wallet.vl_balance) : 0;
  const { receivables } = useReceivableList(wallet?.id_user_wallet);
  const { expenses } = useExpensesList(wallet?.id_user_wallet);
  const { extraExpenses } = useExtraExpenseList(wallet?.id_user_wallet);
  const { creditCards } = useCreditCardInit(wallet?.id_user_wallet);
  const { invoices } = useCreditCardInvoices(wallet?.id_user_wallet);
  const creditCardBalances = useCardCharges(wallet?.id_user_wallet);

  const daily = useMemo(
    () =>
      simulateCashFlow({
        startDate,
        days: range === "month" ? 30 : daysUntilEndOfMonth(startDate, 6),
        initialBalance,
        receivables,
        expenses,
        extraExpenses,
        creditCards,
        creditCardBalances,
        invoices,
      }),
    [
      range,
      startDate,
      initialBalance,
      receivables,
      expenses,
      extraExpenses,
      creditCards,
      creditCardBalances,
      invoices,
    ],
  );

  const dailyPoints = useMemo(() => toDailyPoints(daily), [daily]);
  const monthlyPoints = useMemo(() => toMonthlyPoints(daily).slice(1), [daily]);

  const lowest = useMemo(() => {
    if (daily.length === 0) return null;
    return daily.reduce((min, d) => (d.value < min.value ? d : min), daily[0]);
  }, [daily]);

  const tightestMonth = useMemo(() => {
    if (monthlyPoints.length === 0) return null;
    return monthlyPoints.reduce((min, m) => (m.minValue < min.minValue ? m : min));
  }, [monthlyPoints]);

  const last = daily[daily.length - 1];
  const lastMonth = monthlyPoints[monthlyPoints.length - 1];
  const endValue = range === "month" ? last?.value ?? initialBalance : lastMonth?.value ?? 0;
  const delta = endValue - initialBalance;

  return (
    <div className="flex flex-col gap-6 flex-1 min-h-0">
      <div role="tablist" aria-label="Período do gráfico" className="flex self-start border border-input">
        {RANGES.map((r) => (
          <button
            key={r.id}
            role="tab"
            aria-selected={range === r.id}
            onClick={() => setRange(r.id)}
            className={cn(
              "h-10 px-4 text-sm font-bold transition-colors",
              range === r.id ? "bg-foreground text-background" : "text-foreground hover:bg-muted",
            )}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-end justify-between gap-5">
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-muted-foreground">
            {range === "month"
              ? `Saldo projetado em ${last ? formatDateShort(last.date) : "-"}`
              : `Saldo projetado no fim de ${lastMonth?.label ?? "-"}`}
          </h2>
          <span className="font-mono text-4xl font-bold tracking-tight">
            {formatCurrency(endValue)}
          </span>
          <span className={cn("text-sm", delta >= 0 ? "text-success" : "text-destructive")}>
            {delta >= 0 ? "+ " : "− "}
            {formatCurrency(Math.abs(delta))} em relação a hoje
          </span>
        </div>
        {range === "month" && lowest && (
          <Highlight
            label={`Menor saldo · ${formatDateShort(lowest.date)}`}
            value={formatCurrency(lowest.value)}
            tone="accent"
          />
        )}
        {range === "six-months" && tightestMonth && (
          <Highlight
            label={`Mês mais apertado · ${tightestMonth.label}`}
            value={formatCurrency(tightestMonth.minValue)}
            tone="accent"
          />
        )}
      </div>

      <div className="relative w-full min-w-0 h-[320px]">
        <div ref={ref} className="absolute inset-0 flex items-center justify-center overflow-hidden">
          {!isReady || isWalletLoading ? (
            <Spinner className="size-6 text-muted-foreground" />
          ) : range === "month" ? (
            <ComposedChart
              width={size.width}
              height={size.height}
              data={dailyPoints}
              margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
            >
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                tickLine={false}
                axisLine={false}
                interval={6}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `R$ ${(Number(v) / 1_000).toFixed(1)}k`}
                width={68}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value) => [formatCurrency(Number(value)), "Saldo"]}
              />
              <ReferenceLine y={0} stroke="var(--muted-foreground)" strokeDasharray="4 4" />
              {lowest && (
                <ReferenceLine
                  x={formatDateShort(lowest.date)}
                  stroke="var(--muted-foreground)"
                  strokeDasharray="4 4"
                />
              )}
              <Area
                type="stepAfter"
                dataKey="value"
                stroke="var(--primary)"
                strokeWidth={2.5}
                fill="var(--primary)"
                fillOpacity={0.12}
                activeDot={{ r: 4, strokeWidth: 0 }}
                isAnimationActive={false}
              />
            </ComposedChart>
          ) : (
            <ComposedChart
              width={size.width}
              height={size.height}
              data={monthlyPoints}
              margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
            >
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `R$ ${(Number(v) / 1_000).toFixed(1)}k`}
                width={68}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value, name) => [
                  formatCurrency(Number(value)),
                  name === "minValue" ? "Menor saldo do mês" : "Fim do mês",
                ]}
              />
              <ReferenceLine y={0} stroke="var(--muted-foreground)" strokeDasharray="4 4" />
              <Area
                type="linear"
                dataKey="value"
                stroke="var(--primary)"
                strokeWidth={3}
                fill="var(--primary)"
                fillOpacity={0.12}
                dot={{ r: 3, strokeWidth: 0, fill: "var(--primary)" }}
                isAnimationActive={false}
              />
              <Line
                type="linear"
                dataKey="minValue"
                stroke="var(--muted-foreground)"
                strokeWidth={2}
                strokeDasharray="6 5"
                dot={false}
                isAnimationActive={false}
              />
            </ComposedChart>
          )}
        </div>
      </div>

      {range === "six-months" && (
        <div className="flex flex-wrap gap-5 text-xs text-muted-foreground">
          <span className="flex items-center gap-2">
            <span className="h-[3px] w-[18px] bg-primary" />
            Fim do mês
          </span>
          <span className="flex items-center gap-2">
            <span className="w-[18px] border-t-2 border-dashed border-muted-foreground" />
            Menor saldo do mês
          </span>
        </div>
      )}
    </div>
  );
}
