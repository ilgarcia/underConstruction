import { ReactNode } from "react";

export interface PageOption {
  id: string;
  label: string;
}

/**
 * Props for the Page component.
 */
export interface PageProps {
  /**
   * Main title of the page.
   */
  title: string;

  /**
   * Subtitle or description displayed below the title.
   */
  subtitle: ReactNode;

  /**
   * The content to be rendered within the dashboard layout.
   */
  children: ReactNode;

  /**
   * Optional additional class names for the content wrapper.
   */
  className?: string;

  /**
   * Optional list of selectable options for the page filter.
   */
  options?: PageOption[];

  /**
   * Callback triggered when selection changes.
   */
  onOptionChange?: (selectedIds: string[]) => void;
}
