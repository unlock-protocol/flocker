import { forwardRef, ReactNode, ForwardedRef, HTMLAttributes } from "react";
import { CgSpinner } from "react-icons/cg";

interface Props extends HTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
}

export const LoadingIcon = () => {
  return (
    <CgSpinner
      size={20}
      className="animate animate-spin motion-reduce:animate-none"
    />
  );
};

export const Button = forwardRef(
  (props: Props, ref: ForwardedRef<HTMLButtonElement>) => {
    const { children, icon, loading, disabled, ...rest } = props;
    const buttonClassName =
      "inline-flex bg-blue-500 hover:bg-blue-600 disabled:hover:bg-blue-500 disabled:hover:bg-opacity-75 rounded-full justify-center cursor-pointer text-white font-medium px-4 py-2 items-center gap-2 disabled:bg-opacity-75 disabled:cursor-not-allowed";

    return (
      <button
        ref={ref}
        className={buttonClassName}
        disabled={disabled || loading}
        {...rest}
      >
        {loading ? <LoadingIcon /> : icon}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
