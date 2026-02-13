import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ShowcaseSection } from "@/components/ShowcaseSection";
import { Footer } from "@/components/Footer";
import { portfolioData } from "@/data/portfolioData";

export default function CreativeHubIndex() {
  return (
    <div className="creative-hub-scope min-h-screen bg-background">
      <Navbar />
      <Hero />

      <div className="container mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      </div>

      {portfolioData.map((section, i) => (
        <ShowcaseSection key={section.id} section={section} index={i} />
      ))}

      <Footer />
    </div>
  );
}
