

type Props = {
    children: React.ReactNode;
  };

  const LandingLayout = ({ children }: Props) => {
    return (
      <>
        <main>{children}</main>

      </>
    );
  };

  export default LandingLayout;
