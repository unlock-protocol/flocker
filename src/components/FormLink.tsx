import { Input } from "./Input";
import { FiLink as LinkIcon } from "react-icons/fi";
import { useState } from "react";

interface FormLinkProps {
  partner: any;
}

export const FormLink = ({ partner, ...rest }: FormLinkProps) => {
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
        <button className="" onClick={expand}>
          {expanded ? "-" : "?"}
        </button>
      </h2>
      {/* transition duration-200 ease-in-out text-brand-ui-primary  */}
      <div className={expanded ? "" : "hidden"}>
        <div className="text-gray-600 mb-6">{partner.description}</div>
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
        optional
        type="url"
        icon={partner.icon || <LinkIcon />}
        label="URL"
        placeholder="https://"
        {...rest}
      />
    </section>
  );
};
