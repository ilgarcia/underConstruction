"use client";

import * as React from "react";
import { CashFlowFormProps } from "./types";
import { QuickTransaction } from "./quick-transaction";
import { CashFlowChart } from "./cash-flow-chart";
import { useWalletInit } from "@/hooks/use-wallet";

/**
 * CashFlowForm - The main feature composition for the Cash Flow dashboard.
 * It encapsulates the grid layout and the coordination between the 
 * transaction form and the visualization chart.
 * 
 * All sub-components (QuickTransaction, CashFlowChart) are private 
 * to this directory.
 */
export function CashFlowForm({ startDate, className }: CashFlowFormProps) {
  // Ensures a wallet row exists for the current user in tbl_user_wallet.
  // Creates one with vl_balance = 0 if not found.
  const { wallet } = useWalletInit();
  return (
    <div className="grid grid-cols-12 gap-8 flex-1 min-h-0">
      {/* Left Column (Quick Transaction) */}
      <aside className="col-span-12 lg:col-span-4 flex flex-col">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm flex-1">
          <QuickTransaction wallet={wallet} />
        </div>
      </aside>

      {/* Right Column (Chart) */}
      <main className="col-span-12 lg:col-span-8 flex flex-col gap-6 min-w-0 min-h-0">
        <div className="bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800 p-6 flex flex-col flex-1 min-h-0">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Saldo Projetado
              </h3>
              <p className="text-xs text-muted-foreground">
                Evolução do saldo consolidado
              </p>
            </div>
          </div>

          <div className="flex-1 w-full min-w-0 min-h-0 relative bg-zinc-50/50 dark:bg-zinc-900/10">
            <CashFlowChart startDate={startDate} />
          </div>
        </div>
      </main>
    </div>
  );
}
