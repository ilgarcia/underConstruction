import { Page } from "@/components/custom";
import { CashFlowForm } from "@/components/form";
import { formatDate } from "@/helpers/date";

export default async function CashFlowPage() {
  const now = new Date();
  const today = formatDate(now);

  return (
    <Page
      title="Fluxo de Caixa"
      subtitle={`Projeção dos próximos 30 dias · a partir de hoje, ${today}`}
    >
      <CashFlowForm startDate={now} />
    </Page>
  );
}
