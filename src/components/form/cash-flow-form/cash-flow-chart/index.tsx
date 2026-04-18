"use client";

import dynamic from "next/dynamic";

export const CashFlowChart = dynamic(
  () => import("./cash-flow-chart").then((mod) => mod.CashFlowChart),
  { 
    ssr: false,
    loading: () => <div className="w-full h-full bg-zinc-50/50 dark:bg-zinc-900/50 animate-pulse rounded-none" />
  }
);
