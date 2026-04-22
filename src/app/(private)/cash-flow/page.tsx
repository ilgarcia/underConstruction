import { Page } from "@/components/custom";
import { CashFlowForm } from "@/components/form";
import { getTodayFormatted } from "@/helpers/date";

export default async function CashFlowPage() {
  const today = getTodayFormatted();

  return (
    <Page
      title="Fluxo de Caixa"
      subtitle={`Projeção dos próximos 30 dias · a partir de hoje, ${today}`}
    >
      <CashFlowForm />
    </Page>
  );
}
