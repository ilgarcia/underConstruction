import type { PanelKey } from "../types";

export interface SummaryCardsProps {
  openPanel: PanelKey | null;
  onToggle: (panel: PanelKey) => void;
}
