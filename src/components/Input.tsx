import {
  forwardRef,
  ReactNode,
  ForwardedRef,
  InputHTMLAttributes,
} from "react";
import { twMerge } from "tailwind-merge";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
  label?: string;
  optional?: boolean;
}

export const Input = forwardRef(
  (props: Props, ref: ForwardedRef<HTMLInputElement>) => {
    const { icon, label, id, optional, ...rest } = props;
    const inputClassName = twMerge(
      "block w-full box-border rounded-lg transition-all  border border-gray-400 hover:border-gray-500 focus:ring-gray-500 focus:border-gray-500 focus:outline-none flex-1 disabled:bg-gray-100",
      icon ? "pl-10" : undefined
    );
    return (
      <div className="grid gap-2">
        {label && (
          <label htmlFor={id}>
            {label}{" "}
            {optional && <span className="text-gray-500"> {"(optional)"}</span>}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              {icon}
            </span>
          )}
          <input
            className={inputClassName}
            type="text"
            id={id}
            ref={ref}
            {...rest}
          />
        </div>
      </div>
    );
  }
);

Input.displayName = "Input";
