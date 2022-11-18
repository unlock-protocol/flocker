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
      className="flex items-center justify-center gap-6 px-4 py-2 text-base font-medium bg-white rounded-lg shadow-sm hover:bg-gray-50"
      href={href}
    >
      {icon}
      {label}
    </a>
  );
};
