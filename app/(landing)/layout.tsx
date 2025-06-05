import { NavbarApp } from "./_components/navbar-app";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavbarApp />
      {children}
    </>
  );
}
