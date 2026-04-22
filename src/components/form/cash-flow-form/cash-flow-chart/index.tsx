"use client";

import dynamic from "next/dynamic";
import { Spinner } from "@/components/ui/spinner";

export const CashFlowChart = dynamic(
  () => import("./cash-flow-chart").then((mod) => mod.CashFlowChart),
  { 
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-zinc-50/50 dark:bg-zinc-900/50">
        <Spinner className="size-6 text-muted-foreground" />
      </div>
    )
  }
);
