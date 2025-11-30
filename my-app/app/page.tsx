import { CsvUpload } from "@/components/CsvUpload";
import { Button } from "@/components/ui/button";
import { GenericDrawer } from "@/components/GenericDrawer";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black p-4">
      <GenericDrawer
        trigger={<Button variant="outline">Abrir Upload CSV</Button>}
        title="Upload de Arquivo CSV"
        description="Arraste seu arquivo ou clique para selecionar."
      >
        <CsvUpload />
      </GenericDrawer>
    </div>
  );
}
