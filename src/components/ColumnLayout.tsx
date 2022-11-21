import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export interface Props {
  children: ReactNode;
  className?: string;
}

export function ColumnLayout({ children, className }: Props) {
  const columnLayoutClass = twMerge(
    "w-full max-w-2xl px-6 sm:px-0 pt-12 pb-6 mx-auto",
    className
  );
  return <div className={columnLayoutClass}>{children}</div>;
}
