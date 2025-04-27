import { ReactNode } from "react";
import classNames from "classnames";

interface ProfileCardProps {
  children: ReactNode;
  className?: string;
}

const ProfileCardRoot = ({ children, className }: ProfileCardProps) => {
  return (
    <div className={classNames("rounded-lg animate-fade-in border-eggshell-creamy border-1  bg-white shadow-sm", className)}>

      {children}
    </div>
  );
};

const Header = ({ children, className }: ProfileCardProps) => {
  return (
    <div className={classNames("p-6", className)}>
      {children}
    </div>
  );
};

const Content = ({ children, className }: ProfileCardProps) => {
  return (
    <div className={classNames("px-6 pb-6", className)}>
      {children}
    </div>
  );
};

const Title = ({ children, className }: ProfileCardProps) => {
  return (
    <h2 className={classNames("text-2xl font-bold", className)}>
      {children}
    </h2>
  );
};

// ❗ Asignamos explícitamente
export const ProfileCard = Object.assign(ProfileCardRoot, {
  Header,
  Content,
  Title,
});

export default ProfileCard;
