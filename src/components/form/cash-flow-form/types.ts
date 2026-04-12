import { ReactNode } from "react";

export interface CashFlowFormProps {
  /**
   * The current date used for the subtitle projection.
   */
  startDate: Date;
  
  /**
   * Optional additional class name for the form wrapper.
   */
  className?: string;
}
