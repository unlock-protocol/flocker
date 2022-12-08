import { Input } from "./Input";
import { FiLink as LinkIcon } from "react-icons/fi";
import { useState } from "react";

interface FormLinkProps {
  partner: any;
  register: (name: string) => any;
}

export const FormLink = ({ partner, register }: FormLinkProps) => {
  const [expanded, setExpanded] = useState(false);
  const expand = (event: any) => {
    event.preventDefault();
    setExpanded(!expanded);
  };
  return (
    <section className="p-6 bg-white shadow rounded-xl">
      <h2 className="flex items-center justify-between">
        <a
          className="py-1 text-xl font-bold"
          href={partner.url}
          target="_blank"
          rel="noreferrer"
        >
          {partner.name}
        </a>
      </h2>
      {/* transition duration-200 ease-in-out text-brand-ui-primary  */}
      <div className="text-gray-600 mb-6">
        {partner.description}{" "}
        <button className="underline" onClick={expand}>
          {expanded ? "Less" : "Learn more"}
        </button>
        .
      </div>
      <div className={expanded ? "" : "hidden"}>
        {partner.youtube && (
          <iframe
            className="w-full rounded aspect-video"
            src={partner.youtube}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        )}
        {partner.image && (
          <img
            src={partner.image}
            alt={partner.name}
            className="w-full rounded aspect-video"
          />
        )}
      </div>
      <Input
        {...register(partner.attribute)}
        optional
        type={partner.type || "url"}
        icon={partner.icon || <LinkIcon />}
        label={partner.label || "URL"}
        placeholder={partner.placeholder || "https://"}
      />
    </section>
  );
};
