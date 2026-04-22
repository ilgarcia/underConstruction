import { PageProps } from "./types";
import { Dropdown } from "@/components/custom/dropdown";

const DEFAULT_OPTIONS = [
  { id: "user1", label: "Usuário principal" },
  { id: "user2", label: "Usuário secundário" },
];

export function Page({
  title,
  subtitle,
  children,
  onOptionChange,
}: PageProps) {
  return (
    <div className="flex-1 w-full lg:h-[calc(100vh-48px)] p-8 bg-zinc-50 dark:bg-zinc-950 shadow-sm lg:overflow-hidden flex flex-col">
      <div className="max-w-[1400px] mx-auto w-full space-y-8 flex-1 flex flex-col min-h-0">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <section>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
            <section className="text-muted-foreground mt-2">
              {subtitle}
            </section>
          </section>

          <Dropdown options={DEFAULT_OPTIONS} onOptionChange={onOptionChange} />
        </div>

        <div className={"flex-1 flex flex-col min-h-0"}>
          {children}
        </div>
      </div>
    </div>
  );
}
