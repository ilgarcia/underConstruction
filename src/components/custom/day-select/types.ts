export interface DaySelectProps {
  label: string;
  value: number;
  onChange: (day: number) => void;
  disabled?: boolean;
  containerClassName?: string;
}
