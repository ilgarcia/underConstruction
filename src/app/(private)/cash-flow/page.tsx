import { CashFlowChart, QuickTransactionForm } from "@/components/custom";

export default async function CashFlowPage() {
  const now = new Date();
  const today = now.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className="flex-1 w-full lg:h-[calc(100vh-48px)] p-8 bg-zinc-50 dark:bg-zinc-950 shadow-sm lg:overflow-hidden flex flex-col">
      <div className="max-w-[1400px] mx-auto w-full space-y-8 flex-1 flex flex-col min-h-0">
        {/* Page Header */}
        <section>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Fluxo de Caixa
          </h1>
          <p className="text-muted-foreground mt-2">
            Projeção dos próximos 30 dias · a partir de hoje, {today}
          </p>
        </section>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-12 gap-8 flex-1 min-h-0">
          {/* Left Column (Quick Transaction) */}
          <aside className="col-span-12 lg:col-span-4 flex flex-col">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm flex-1">
              <QuickTransactionForm />
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
                <CashFlowChart startDate={now} />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
