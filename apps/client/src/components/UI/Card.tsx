import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Card = ({ className = "", ...props }: CardProps) => {
  return (
    <div
      className={`bg-white rounded-lg border-1 border-eggshell-creamy shadow-md overflow-hidden ${className}`}
      {...props}
    />
  );
};
