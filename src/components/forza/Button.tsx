import React, { forwardRef } from "react";
import "./ui.css";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "ghost" | "solid" | "outline";
  size?: "sm" | "md" | "lg" | "icon";
  className?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "ghost", size = "sm", className = "", type = "button", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={`ui-button ui-button-${size} ${className}`}
      {...props}
    />
  );
});

export default Button;
