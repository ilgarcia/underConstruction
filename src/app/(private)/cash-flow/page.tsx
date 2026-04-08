export default async function CashFlowPage() {
  const today = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className="flex-1 w-full h-full p-8 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Fluxo de Caixa</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Projeção dos próximos 30 dias · a partir de hoje {today}
        </p>
      </div>
    </div>
  );
}
