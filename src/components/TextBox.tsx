import { forwardRef, ForwardedRef, TextareaHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  optional?: boolean;
}

export const TextBox = forwardRef(
  (props: Props, ref: ForwardedRef<HTMLTextAreaElement>) => {
    const { label, id, optional, ...rest } = props;
    const textBoxClass = twMerge(
      "block w-full box-border rounded-lg transition-all shadow-sm border border-gray-400 hover:border-gray-500 focus:ring-gray-500 focus:border-gray-500 focus:outline-none disabled:bg-gray-100"
    );
    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={id}>
            {label}{" "}
            {optional && <span className="text-gray-500"> {"(optional)"}</span>}
          </label>
        )}
        <textarea {...rest} id={label} ref={ref} className={textBoxClass} />
      </div>
    );
  }
);

TextBox.displayName = "Input";
