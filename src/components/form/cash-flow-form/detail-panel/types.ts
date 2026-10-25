import type { PanelKey } from "../types";

export interface DetailPanelProps {
  panel: PanelKey;
  onClose: () => void;
}
