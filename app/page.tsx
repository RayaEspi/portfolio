import { ContactSection } from "./components/ContactSection";
import { GamblingSection } from "./components/GamblingSection";
import { HeroSection } from "./components/HeroSection";
import { ModsSection } from "./components/ModsSection";
import { PluginsSection } from "./components/PluginsSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <PluginsSection />
      <ModsSection />
      <GamblingSection />
      <ContactSection />
    </>
  );
}
