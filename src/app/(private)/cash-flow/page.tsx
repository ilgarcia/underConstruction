import { Page } from "@/components/custom";
import { CashFlowForm } from "@/components/form";

export default async function CashFlowPage() {
  const now = new Date();
  const today = now.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <Page
      title="Fluxo de Caixa"
      subtitle={`Projeção dos próximos 30 dias · a partir de hoje, ${today}`}
    >
      <CashFlowForm startDate={now} />
    </Page>
  );
}
