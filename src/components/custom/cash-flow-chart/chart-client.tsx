"use client";

import dynamic from "next/dynamic";
import * as React from "react";

/**
 * ChartClient - A wrapper component that dynamically imports the CashFlowChart
 * with SSR disabled. This is necessary to prevent dimension calculation errors 
 * and to allow its use within Server Components.
 */
export const CashFlowChart = dynamic(
  () => import("./cash-flow-chart").then((mod) => mod.CashFlowChart),
  { 
    ssr: false,
    loading: () => <div className="w-full h-full bg-zinc-50/50 dark:bg-zinc-900/50 animate-pulse rounded-none" />
  }
);
