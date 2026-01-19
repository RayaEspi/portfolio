import type { ReactNode } from "react";

const portfolioItems = [
  {
    id: 1,
    title: "Quiet Confidence",
    description: "A gentle, flowing idle animation with subtle swaying movements",
    type: "Idle Pose",
  },
  {
    id: 2,
    title: "Soft Claim",
    description: "A warm couples animation for embracing partners",
    type: "Couples Pose",
  },
  {
    id: 3,
    title: "Anactoria",
    description: "A sitting idle animation with cute leg movements",
    type: "Sitting Idle Pose",
  },
] as const;

function Icon({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      aria-hidden
      className={
        "inline-flex items-center justify-center select-none leading-none " + className
      }
    >
      {children}
    </span>
  );
}

export default function VelvetPage() {
  return (
    <div className="velvet-scope min-h-screen">
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url(/velvet/velvet-hero-bg.jpg)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />

        <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-20 text-center">
          <div className="flex justify-center gap-3 mb-6 animate-pulse-soft">
            <Icon className="text-primary text-xl">♥</Icon>
            <Icon className="text-velvet-gold text-xl">✦</Icon>
            <Icon className="text-primary text-xl">♥</Icon>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium mb-4 animate-fade-up">
            <span className="text-velvet-gradient">Fifty Shades</span>
            <br />
            <span className="text-velvet-cream italic">of Velvet</span>
          </h1>

          <p
            className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-8 animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            ✿ Raya's offerings ✿
            <br />
            {/*<span className="text-velvet-soft">A cozy auction for bespoke poses &amp; movements</span>*/}
          </p>

          {/* Character Placeholder */}
          <div className="relative mx-auto w-64 h-80 md:w-80 md:h-96 rounded-2xl velvet-card overflow-hidden mb-10 animate-float">
            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground chara-background"
                 style={{ backgroundImage: "url(/velvet/piccie.png)" }}>
            </div>

            <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-primary/40 rounded-tl-lg" />
            <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-primary/40 rounded-tr-lg" />
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-primary/40 rounded-bl-lg" />
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-primary/40 rounded-br-lg" />
          </div>

          <a href="#auction" className="btn-velvet gap-2">
            <Icon className="text-base">♥</Icon>
            View Auction Details
          </a>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* AUCTION */}
      <section id="auction" className="py-20 px-6 relative">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="flex justify-center gap-2 mb-4">
              <Icon className="text-velvet-gold">✦</Icon>
              <Icon className="text-velvet-gold">✦</Icon>
              <Icon className="text-velvet-gold">✦</Icon>
            </div>
            <h2 className="text-4xl md:text-5xl text-velvet-cream mb-4">The Auction</h2>
            {/* <p className="text-muted-foreground">A custom animation mod, crafted just for you</p> */}
          </div>

          <div className="velvet-card p-8 md:p-12 mb-8 velvet-glow">
            <div className="text-center mb-8">
              <Icon className="text-primary text-4xl">✦</Icon>
              <h3 className="text-2xl md:text-3xl text-velvet-soft mt-4 mb-2">
                Custom Animation Mod
              </h3>
              <p className="text-muted-foreground">
                A cute FFXIV animation tailored to your vision
              </p>
            </div>

            <div className="decorative-border rounded-xl p-6 bg-secondary/20 mb-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="text-center p-4">
                  <Icon className="text-primary text-3xl">♥</Icon>
                  <h4 className="text-xl text-velvet-cream mt-3 mb-2">Solo Animation</h4>
                  <p className="text-sm text-muted-foreground">
                    One beautifully crafted custom animation for your character
                  </p>
                </div>

                <div className="text-center p-4 border-t md:border-t-0">
                  <Icon className="text-velvet-gold text-3xl">✿</Icon>
                  <h4 className="text-xl text-velvet-cream mt-3 mb-2">Couples Animation</h4>
                  <p className="text-sm text-muted-foreground">
                    Two matching animations for you and your special someone
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[hsl(var(--velvet-rich)_/_0.2)] via-primary/10 to-[hsl(var(--velvet-rich)_/_0.2)] rounded-xl p-6 border border-primary/20">
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center">
                <div className="flex items-center gap-2">
                  <Icon className="text-velvet-gold">✦</Icon>
                  <span className="text-xl text-velvet-gold">Bonus Tier</span>
                </div>
                <div className="hidden md:block w-px h-8 bg-border/50" />
                <p className="text-velvet-cream">
                  Bids over <span className="text-velvet-gold font-semibold">100,000,000 gil</span> unlock the
                  <span className="text-primary font-semibold"> Couples Animation</span> upgrade!
                </p>
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p className="flex items-center justify-center gap-2">
              <Icon className="text-primary/70">♥</Icon>
              Made with love
              <Icon className="text-primary/70">♥</Icon>
            </p>
          </div>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section id="portfolio" className="py-20 px-6 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-5xl relative">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/30 border border-border/50 mb-6">
              <Icon className="text-primary">👁</Icon>
              <span className="text-sm text-muted-foreground">Past Creations</span>
            </div>
            <h2 className="text-4xl md:text-5xl text-velvet-cream mb-4">Portfolio</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              A glimpse of my previous work in custom FFXIV animations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {portfolioItems.map((item, index) => (
              <div
                key={item.id}
                className="velvet-card group overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_hsl(340_50%_40%_/_0.2)]"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative aspect-[4/5] bg-gradient-to-br from-secondary/50 to-secondary/20 flex items-center justify-center">
                  <div className="flex flex-col items-center text-muted-foreground/60">
                    <Icon className="text-4xl opacity-50">▶</Icon>
                    <span className="text-xs">Preview</span>
                  </div>

                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-background/80 backdrop-blur-sm border border-border/50">
                    <span className="text-xs text-velvet-soft">{item.type}</span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-xl text-velvet-cream mb-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>

                <div className="px-5 pb-5">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
                    <Icon className="text-primary/50">♥</Icon>
                    <span>Completed Commission</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-sm text-muted-foreground/60 italic">
              ✿ Each piece is unique and tailored to the commissioner's vision ✿
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6 border-t border-border/30">
        <div className="mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/40" />
            <Icon className="text-velvet-gold text-lg">✦</Icon>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary/40" />
          </div>

          <h3 className="text-2xl text-velvet-gradient mb-4">Fifty Shades of Velvet</h3>

          <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
            Thank you for visiting my portfolio! I hope you have fun at the auction and find what you are looking for
          </p>

          <div className="flex justify-center gap-2 mb-6">
            <Icon className="text-primary/40 text-lg">♥</Icon>
            <Icon className="text-primary/60 text-lg">♥</Icon>
            <Icon className="text-primary text-lg">♥</Icon>
            <Icon className="text-primary/60 text-lg">♥</Icon>
            <Icon className="text-primary/40 text-lg">♥</Icon>
          </div>

          <p className="text-xs text-muted-foreground/50">✿ Made with love ✿</p>
        </div>
      </footer>
    </div>
  );
}
