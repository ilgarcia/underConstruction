import { QuickTransaction } from "./quick-transaction";
import { CashFlowChart } from "./cash-flow-chart";
import { Paper } from "@/components/custom";

export function CashFlowForm() {
  return (
    <div className="grid grid-cols-12 gap-8 flex-1 min-h-0">
      <aside className="col-span-12 lg:col-span-4 flex flex-col">
        <Paper className="flex-1">
          <QuickTransaction />
        </Paper>
      </aside>
      <main className="col-span-12 lg:col-span-8 flex flex-col gap-6 min-w-0 min-h-0">
        <Paper
          title="Saldo Projetado"
          subtitle="Evolução do saldo consolidado"
          className="flex-1 min-h-0"
        >
          <CashFlowChart />
        </Paper>
      </main>
    </div>
  );
}
