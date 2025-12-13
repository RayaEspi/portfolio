import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center">
      <Image
        src="header.webp"
        alt="Raya Serahill hero background"
        fill
        priority
        className="object-cover opacity-100"
        sizes="100vw"
        unoptimized
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black  to-transparent" />
      <header className="absolute top-0 left-0 right-0 z-20 ">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <span className="text-sm tracking-[0.3em] uppercase text-[#FF9FC6]">
            Raya Serahill
          </span>
          <nav className="hidden gap-6 text-sm md:flex text-shadow-lg/90">
            <a href="#plugins" className="hover:text-[#FF9FC6] transition-colors">
              Plugins
            </a>
            <a href="#mods" className="hover:text-[#FF9FC6] transition-colors">
              Mods
            </a>
            <a href="#gambling" className="hover:text-[#FF9FC6] transition-colors">
              Gambling
            </a>
            <a href="#contact" className="hover:text-[#FF9FC6] transition-colors">
              Contact
            </a>
          </nav>
        </div>
      </header>
      <div className="relative z-10 flex w-full justify-center">
        <div className="mx-auto flex w-full max-w-6xl justify-start px-6 py-24 lg:py-32">
          <div className="max-w-xl space-y-6 animate-[fadeIn_0.8s_ease-out]">
            <p className="text-sm tracking-[0.35em] uppercase text-[#FF9FC6]">
              Developer • Modder • Gambler
            </p>
            <h1 className="text-4xl font-semibold sm:text-5xl md:text-6xl">
              <span className="block">Raya</span>
              <span className="block text-[#FF9FC6]">Serahill</span>
            </h1>
            <p className="text-base text-zinc-300 sm:text-lg text-shadow-lg/90">
              Heyy! I&apos;m Raya ^^ I build plugins, create cosmetic mods, and track
              way too many gambling stats for fun. This is my little website where
              I host my projects ^^
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#plugins"
                className="text-shadow-lg/30 rounded-full px-6 py-2 text-sm font-medium bg-[#FF9FC6] text-black shadow-[0_0_20px_rgba(255,159,198,0.8)] transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(255,159,198,1)]"
              >
                Explore my work
              </a>
              <a
                href="#contact"
                className="text-shadow-lg/30 rounded-full px-6 py-2 text-sm font-medium border border-[#FF9FC6]/70 text-[#FF9FC6] transition-all duration-200 hover:bg-[#FF9FC6] hover:text-black"
              >
                Contact me on Discord
              </a>
            </div>
            <div className="flex flex-wrap gap-3 pt-2 text-sm text-zinc-300">
              <a
                href="https://www.instagram.com/raya_serahill/"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-2 rounded-full border border-zinc-700 px-4 py-1.5 transition-all hover:border-[#FF9FC6] hover:bg-[#FF9FC6]/5"
              >
                <span className="text-shadow-lg/90 h-1.5 w-1.5 rounded-full bg-[#FF9FC6] group-hover:scale-125 transition-transform" />
                Instagram
              </a>
              <a
                href="#gambling"
                className="text-shadow-lg/90 group flex items-center gap-2 rounded-full border border-zinc-700 px-4 py-1.5 transition-all hover:border-[#FF9FC6] hover:bg-[#FF9FC6]/5"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#FF9FC6] group-hover:scale-125 transition-transform" />
                Espi Gamba
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-6 left-0 right-0 flex justify-center">
        <a
          href="#plugins"
          className="flex flex-col items-center text-xs text-zinc-400 hover:text-[#FF9FC6] transition-colors"
        >
          <span className="mb-1">Scroll</span>
          <span className="h-8 w-px animate-bounce bg-[#FF9FC6]" />
        </a>
      </div>
    </section>
  );
}
