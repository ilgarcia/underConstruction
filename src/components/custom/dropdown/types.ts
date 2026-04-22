export interface PageOption {
  id: string;
  label: string;
}

export interface DropdownProps {
  options?: PageOption[];
  onOptionChange?: (selectedIds: string[]) => void;
}
