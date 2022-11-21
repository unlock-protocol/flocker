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
      className="flex items-center justify-center h-12 gap-6 text-base font-medium bg-white border rounded-full shadow-sm border-gray-50 hover:shadow-lg hover:border-gray-200"
      href={href}
    >
      {icon}
      {label}
    </a>
  );
};
