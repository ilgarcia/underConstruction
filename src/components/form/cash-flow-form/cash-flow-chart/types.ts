export interface ChartDataPoint {
  date: string;
  value: number;
}

export interface MonthlyDataPoint {
  label: string;
  /** Balance on the last day of the month. */
  value: number;
  /** Lowest balance reached during the month (usually right before payday). */
  minValue: number;
}

export interface DailyBalance {
  date: Date;
  value: number;
}

export type ChartRange = "month" | "six-months";
