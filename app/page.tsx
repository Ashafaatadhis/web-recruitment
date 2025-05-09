import { NavbarApp } from "./_components/navbar-app";
import { GridBackgroundDemo } from "./_components/grid-background";
import { HeroSection } from "./_components/hero-section";

export default function Home() {
  return (
    <div className="min-h-screen">
      <NavbarApp />
      <GridBackgroundDemo>
        <HeroSection />
      </GridBackgroundDemo>
    </div>
  );
}
