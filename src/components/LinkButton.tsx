import { ReactNode } from "react";

export interface Props {
  icon: ReactNode;
  label: string;
  href: string;
  hide?: boolean;
}

export const LinkButton = ({ hide, href, icon, label }: Props) => {
  const classes = [
    "flex",
    "items-center",
    "justify-center",
    "h-12",
    "gap-6",
    "text-base",
    "font-medium",
    "bg-white",
    "border",
    "rounded-full",
    "shadow-sm",
    "border-gray-50",
  ];
  if (!hide) {
    classes.push("hover:shadow-lg");
    classes.push("hover:border-gray-200");
  } else {
    classes.push("cursor-not-allowed");
  }
  return (
    <a
      target="_blank"
      rel="me noopener noreferrer"
      className={classes.join(" ")}
      href={href}
      onClick={(e) => hide && e.preventDefault()}
    >
      {icon}
      {label}
    </a>
  );
};
