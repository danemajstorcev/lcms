import { type ReactNode } from "react";

type Variant = "primary" | "ghost" | "danger" | "success";

interface ButtonProps {
  onClick?: () => void;
  children: ReactNode;
  variant?: Variant;
  sm?: boolean;
  disabled?: boolean;
  type?: "button" | "submit";
}

export default function Button({
  onClick,
  children,
  variant = "primary",
  sm,
  disabled,
  type = "button",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn btn--${variant}${sm ? " btn--sm" : ""}`}
    >
      {children}
    </button>
  );
}
