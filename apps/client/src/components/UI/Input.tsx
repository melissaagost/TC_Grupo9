import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = ({ className = "", ...rest }: InputProps) => {
  return (
    <input
      {...rest}
      className={`w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-burgundy transition ${className}`}
    />
  );
};
