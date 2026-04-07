import clsx from "clsx";

import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type ButtonVariant = "primary" | "secondary" | "outline";

type ButtonSize = "sm" | "md" | "lg";

type Props = ButtonHTMLAttributes<HTMLButtonElement> &
  PropsWithChildren & {
    variant?: ButtonVariant;

    size?: ButtonSize;
  };

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white hover:bg-primary/90",

  secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",

  outline:
    "bg-transparent border-2 border-primary text-primary hover:bg-primary/10",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1 text-sm",

  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

const Button = ({
  children,

  className,

  variant = "primary",

  size = "md",

  ...otherProps
}: Props) => (
  <button
    className={clsx(
      "btn-shadow rounded-md font-semibold",
      variantClasses[variant],

      sizeClasses[size],
      className,
    )}
    {...otherProps}
  >
    <span>{children}</span>
  </button>
);

export default Button;
