import { cn } from "@/lib/utils";
import { LogoProps } from "./types";

export function Logo({ className, title = "Peach Organizer" }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      role="img"
      aria-label={title}
      className={cn("h-8 w-8 shrink-0", className)}
    >
      <path
        d="M13 25 H16 M21 25 H51 M9 34 H12 M17 34 H55 M11 43 H14 M19 43 H53 M19 52 H22 M27 52 H45"
        fill="none"
        strokeWidth="4"
        className="stroke-primary"
      />
      <path
        d="M32 18 C33 11 39 7 46 7.5 C45 14 39 18 32 18 Z"
        className="fill-[#2f8a5f] dark:fill-[#8fe0bc]"
      />
    </svg>
  );
}
