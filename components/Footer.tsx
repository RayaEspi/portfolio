export function Footer() {
  return (
    <footer className="border-t border-border py-12 mt-20">
      <div className="overflow-hidden mb-8">
        <div className="animate-marquee whitespace-nowrap flex">
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="font-gothic text-5xl text-primary mx-8 select-none"
            >
              Raya Serahill ✦
            </span>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 text-center">
        <p className="font-body text-xs text-muted-foreground uppercase tracking-widest">
          © {new Date().getFullYear()} Raya Serahill — All rights reserved
        </p>
        <p className="font-body text-[10px] text-muted-foreground/50 mt-2 uppercase tracking-widest">
          Code · Model · Animate
        </p>
      </div>
    </footer>
  );
}
