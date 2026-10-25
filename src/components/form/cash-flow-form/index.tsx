"use client";

import * as React from "react";
import { CashFlowChart } from "./cash-flow-chart";
import { SummaryCards } from "./summary-cards";
import { DetailPanel } from "./detail-panel";
import { Paper } from "@/components/custom";
import type { PanelKey } from "./types";

export function CashFlowForm() {
  const [openPanel, setOpenPanel] = React.useState<PanelKey | null>(null);

  const togglePanel = (panel: PanelKey) => {
    setOpenPanel((current) => (current === panel ? null : panel));
  };

  return (
    <div className="flex flex-col gap-6">
      <SummaryCards openPanel={openPanel} onToggle={togglePanel} />

      {openPanel && <DetailPanel panel={openPanel} onClose={() => setOpenPanel(null)} />}

      <Paper>
        <CashFlowChart />
      </Paper>
    </div>
  );
}
