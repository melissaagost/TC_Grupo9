import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button = ({ children, ...props }: ButtonProps) => {
  return (
    <button
      {...props}
      className={`bg-blood-100 hover:bg-blood-300 text-eggshell-100 font-semibold py-2 px-4 rounded-md transition-colors ${props.className || ""}`}
    >
      {children}
    </button>
  );
};
