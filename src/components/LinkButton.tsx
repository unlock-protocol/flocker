import { ReactNode } from "react";

export interface Props {
  icon: ReactNode;
  label: string;
  href: string;
}

export const LinkButton = ({ href, icon, label }: Props) => {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 p-2 bg-white rounded shadow-sm hover:bg-gray-50"
      href={href}
    >
      {icon}
      {label}
    </a>
  );
};
