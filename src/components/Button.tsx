import { forwardRef, ReactNode, ForwardedRef, HTMLAttributes } from "react";
import { CgSpinner } from "react-icons/cg";

interface Props extends HTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  secondary?: boolean;
}

export const LoadingIcon = () => {
  return (
    <CgSpinner
      size={20}
      className="animate animate-spin motion-reduce:animate-none"
    />
  );
};

export const buildButtonClasses = (props: Props = {}) => {
  const { children, icon, loading, disabled, secondary, ...rest } = props;

  let buttonClassName =
    "inline-flex rounded-full justify-center cursor-pointer  font-medium px-4 py-2 items-center gap-2  disabled:cursor-not-allowed";
  if (secondary) {
    buttonClassName = `${buttonClassName} text-blue-500 border-2 border-blue-500 hover:border-blue-400 hover:text-blue-400 disabled:border-blue-400 disabled:hover:border-blue-400`;
  } else {
    buttonClassName = `${buttonClassName} text-white bg-blue-500  hover:bg-blue-400 disabled:bg-blue-400 disabled:bg-blue-400 disabled:hover:bg-blue-400`;
  }
  return buttonClassName;
};

export const Button = forwardRef(
  (props: Props, ref: ForwardedRef<HTMLButtonElement>) => {
    const { children, icon, loading, disabled, secondary, ...rest } = props;
    return (
      <button
        ref={ref}
        className={buildButtonClasses(props)}
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
