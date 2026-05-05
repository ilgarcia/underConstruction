"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useWalletInit, useReceivableList, useExpensesList, useCreditCardInit } from "@/hooks";
import type { ReceivableRecord, ExpensesRecord, CreditCardRecord } from "@/hooks";
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
import { ChartDataPoint } from "./types";
import {
  formatDateShort,
  toYMD,
  getEffectiveDatesSet
} from "@/helpers/date";
import { Spinner } from "@/components/ui/spinner";

/**
 * Generates 30 days of mock cash flow data starting from `startDate`.
 */
function generateMockData(
  startDate: Date,
  initialBalance: number,
  receivables: ReceivableRecord[] = [],
  expenses: ExpensesRecord[] = [],
  creditCards: CreditCardRecord[] = [],
  creditCardBalances: any[] = []
): ChartDataPoint[] {
  const data: ChartDataPoint[] = [];
  let balance = initialBalance;

  // Initialize credit card states with the current open balance
  const ccStates = creditCards.map((cc) => {
    const effectiveClosingDates = getEffectiveDatesSet(startDate, cc.dt_day_closing, "closing");
    const effectivePaymentDates = getEffectiveDatesSet(startDate, cc.vl_day, "payment");

    return {
      id: cc.id_credit_card,
      openInvoice: Number(cc.vl_balance) || 0,
      closedInvoice: 0,
      effectiveClosingDates,
      effectivePaymentDates,
    };
  });

  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);

    const currentDay = date.getDate();
    const currentYMD = toYMD(date);

    // Sum receivables for this day
    const dayReceivables = receivables
      .filter((r) => r.vl_day === currentDay)
      .reduce((sum, r) => sum + Number(r.vl_amount), 0);

    // Sum expenses for this day
    const dayExpenses = expenses
      .filter((e) => e.vl_day === currentDay)
      .reduce((sum, e) => sum + Number(e.vl_amount), 0);

    balance += dayReceivables;
    balance -= dayExpenses;

    // Process Credit Cards
    for (const cc of ccStates) {
      // Add purchases for this day to the open invoice
      const dayCCPurchases = creditCardBalances
        .filter((b) => b.id_credit_card === cc.id && b.vl_day === currentDay)
        .reduce((sum, b) => sum + Number(b.vl_amount), 0);

      cc.openInvoice += dayCCPurchases;

      // Close invoice if today is effective closing day
      if (cc.effectiveClosingDates.has(currentYMD)) {
        cc.closedInvoice += cc.openInvoice;
        cc.openInvoice = 0;
      }

      // Pay invoice if today is effective payment day
      if (cc.effectivePaymentDates.has(currentYMD)) {
        balance -= cc.closedInvoice;
        cc.closedInvoice = 0;
      }
    }

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

  const { wallet, isLoading: isWalletLoading } = useWalletInit();
  const initialBalance = wallet?.vl_balance ? Number(wallet.vl_balance) : 0;

  const { receivables, isLoading: isReceivablesLoading } = useReceivableList(wallet?.id_user_wallet);
  const { expenses, isLoading: isExpensesLoading } = useExpensesList(wallet?.id_user_wallet);
  const { creditCards, isLoading: isCCLoading } = useCreditCardInit(wallet?.id_user_wallet);

  const [creditCardBalances, setCreditCardBalances] = useState<any[]>([]);

  useEffect(() => {
    async function fetchAllBalances() {
      if (!creditCards || creditCards.length === 0) return;
      try {
        const promises = creditCards.map((cc) =>
          fetch(`/api/cash-flow/credit-card-balance?wallet_id=${cc.id_credit_card}`).then((res) =>
            res.json()
          )
        );
        const results = await Promise.all(promises);
        // Prevent flat errors if an API call returned an error object instead of an array
        const validResults = results.filter(Array.isArray);
        setCreditCardBalances(validResults.flat());
      } catch (err) {
        console.error("Failed to fetch CC balances", err);
      }
    }
    fetchAllBalances();
  }, [creditCards]);

  const data = useMemo(() => {
    return generateMockData(
      startDate,
      initialBalance,
      receivables,
      expenses,
      creditCards,
      creditCardBalances
    );
  }, [startDate, initialBalance, receivables, expenses, creditCards, creditCardBalances]);

  const minValue = useMemo(() => {
    if (!data.length) return 0;
    return Math.min(...data.map((d) => d.value));
  }, [data]);

  const enhancedData = useMemo(() => {
    return data.map((d) => ({ ...d, minValue }));
  }, [data, minValue]);

  const chartColor = minValue >= 0 ? "#34d399" : "#ef4444"; // Subtle green (emerald-400) or Red

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
          <ComposedChart
            width={dimensions.width}
            height={dimensions.height}
            data={enhancedData}
            margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient 
                id="minAreaColor" 
                x1="0" 
                y1={minValue >= 0 ? "0" : "1"} 
                x2="0" 
                y2={minValue >= 0 ? "1" : "0"}
              >
                <stop offset="5%" stopColor={chartColor} stopOpacity={0.15} />
                <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
              </linearGradient>
            </defs>
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
            <ReferenceLine 
              y={0} 
              stroke="currentColor" 
              strokeOpacity={0.4} 
              strokeWidth={1.5} 
              strokeDasharray="4 4" 
            />
            <Area
              type="monotone"
              dataKey="minValue"
              stroke={chartColor}
              strokeWidth={1}
              strokeOpacity={0.6}
              fillOpacity={1}
              fill="url(#minAreaColor)"
              activeDot={false}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="var(--primary)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          </ComposedChart>

        ) : (
          <Spinner className="size-6 text-muted-foreground" />
        )}
      </div>
    </div>
  );
}
