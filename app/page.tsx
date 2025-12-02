import Image from "next/image";

export default function Home() {
  return (
      <div className="min-h-screen bg-black text-white font-sans scroll-smooth">
        <main className="min-h-screen">
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
                    Heyy! I'm Raya ^^ I build plugins, create cosmetic mods, and track way too
                    many gambling stats for fun. This is my little website where I host my projects ^^
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

          <section id="plugins" className="bg-black py-20 md:py-24">
            <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 lg:flex-row lg:items-center">
              <div className="flex-1 space-y-4">
                <h2 className="text-3xl font-semibold md:text-4xl">
                  Plugin development
                  <span className="block text-base font-normal text-[#FF9FC6]">
                  Tools that the make the game more exciting
                </span>
                </h2>
                <p className="text-zinc-300">
                  I build ffxiv plugins that smooth out the rough edges, surface useful
                  data, and add quality-of-life tweaks. Think stats collectors, fun games, and
                  nerdy little utilities that probably started as a “what if I just…”. I also create stuff if someone brings an interesting idea to me!
                </p>
                <ul className="space-y-2 text-sm text-zinc-300">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#FF9FC6]" />
                    Live stats, overlays, and quality-of-life helpers
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#FF9FC6]" />
                    Focus on clarity and performance
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#FF9FC6]" />
                    Goofy stuff and commissions
                  </li>
                </ul>
              </div>
              <div className="flex-1">
                <div className="group relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-3 shadow-[0_0_40px_rgba(0,0,0,0.7)] transition-transform duration-300 hover:-translate-y-2 hover:shadow-[0_0_60px_rgba(255,159,198,0.5)]">
                  <Image
                      src="plugin_demo.webp"
                      alt="Plugin development preview"
                      width={600}
                      height={400}
                      className="h-full w-full rounded-2xl object-cover"
                      unoptimized
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/70 via-transparent to-[#FF9FC6]/20 opacity-80" />
                </div>
              </div>
            </div>
          </section>

          <section id="mods" className="bg-gradient-to-b from-black via-zinc-950 to-black py-20 md:py-24">
            <div className="mx-auto flex max-w-6xl flex-col-reverse gap-12 px-6 lg:flex-row lg:items-center">
              <div className="flex-1">
                <div className="group relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-3 shadow-[0_0_40px_rgba(0,0,0,0.7)] transition-transform duration-300 hover:-translate-y-2 hover:shadow-[0_0_60px_rgba(255,159,198,0.5)]">
                  <Image
                      src="mod_demo.webp"
                      alt="Mod creation preview"
                      width={600}
                      height={400}
                      className="h-full w-full rounded-2xl object-cover"
                      unoptimized
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-tl from-black/70 via-transparent to-[#FF9FC6]/25 opacity-80" />
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <h2 className="text-3xl font-semibold md:text-4xl">
                  Mod creation
                  <span className="block text-base font-normal text-[#FF9FC6]">
                  Accessories, animations, clothes &amp; more
                </span>
                </h2>
                <p className="text-zinc-300">
                  I create mods mainly for myself and friends, sometimes releasing small things :p
                   My range goes from simple accessories to tattoos, clothing mods and just recently animations!
                  I'm on a mission to make me and my friends look the best we can
                </p>
                <ul className="space-y-2 text-sm text-zinc-300">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#FF9FC6]" />
                    Character accessories and fashion-focused pieces
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#FF9FC6]" />
                    Custom animations and personality-driven details
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#FF9FC6]" />
                    Personalized tattoos and body modifications
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section id="gambling" className="bg-black py-20 md:py-24">
            <div className="mx-auto max-w-6xl px-6">
              <div className="grid gap-10 lg:grid-cols-[1.3fr_minmax(0,1fr)] lg:items-center">
                <div className="space-y-4">
                  <h2 className="text-3xl font-semibold md:text-4xl">
                    Espi Gamba!
                    <span className="block text-base font-normal text-[#FF9FC6]">
                    Numbers, odds, lost gil and way too many stats
                  </span>
                  </h2>
                  <p className="text-zinc-300">
                    I like games of chance almost as much as I like tracking them. I log my
                    gambling sessions, collect stats, and turn them into something I can poke
                    at later: trends, streaks, and leaderboards to make it exciting for players too ^^
                  </p>
                  <p className="text-zinc-400 text-sm">
                    The data itself lives elsewhere, but this is the home base if you want to peek
                    into the numbers.
                  </p>
                  <div className="flex flex-wrap gap-4 pt-2">
                    <a
                        href="#"
                        className="rounded-full px-6 py-2 text-sm font-medium bg-[#FF9FC6] text-black shadow-[0_0_20px_rgba(255,159,198,0.8)] transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(255,159,198,1)]"
                    >
                      View my stats
                    </a>
                    <a
                        href="#contact"
                        className="rounded-full px-6 py-2 text-sm font-medium border border-zinc-700 text-zinc-200 transition-all duration-200 hover:border-[#FF9FC6] hover:text-[#FF9FC6]"
                    >
                      Talk gambling &amp; math
                    </a>
                  </div>
                </div>
                <div className="space-y-4 rounded-3xl border border-zinc-800 bg-zinc-950/60 p-5 shadow-[0_0_40px_rgba(0,0,0,0.7)]">
                  <h3 className="text-sm font-medium tracking-[0.25em] uppercase text-[#FF9FC6]">
                    Snapshot
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="rounded-2xl bg-black/50 p-4 transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(255,159,198,0.4)]">
                      <p className="text-xs text-zinc-400">Tracked sessions</p>
                      <p className="text-2xl font-semibold text-white">000</p>
                    </div>
                    <div className="rounded-2xl bg-black/50 p-4 transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(255,159,198,0.4)]">
                      <p className="text-xs text-zinc-400">Favorite games</p>
                      <p className="text-base text-white">Blackjack, Roulette</p>
                    </div>
                    <div className="col-span-2 rounded-2xl bg-black/60 p-4 text-xs text-zinc-300">
                      I will add some small stats here when I get my stats API up q.q
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="contact" className="bg-gradient-to-t from-black via-zinc-950 to-black py-20 md:py-24">
            <div className="mx-auto max-w-4xl px-6">
              <h2 className="text-center text-3xl font-semibold md:text-4xl">
                Get in touch
              </h2>
              <p className="mt-3 text-center text-zinc-300">
                The easiest way to reach me is on Discord. I&apos;m happy to talk plugins,
                mods, gambling stats, or potential collabs.
              </p>
              <div className="mt-10 rounded-3xl border border-zinc-800 bg-black/70 p-6 shadow-[0_0_40px_rgba(0,0,0,0.7)] backdrop-blur">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-[#FF9FC6]">
                      Primary contact
                    </p>
                    <p className="mt-1 text-lg font-medium">
                      Discord: <span className="text-[#FF9FC6]">raya</span>
                    </p>
                    <p className="mt-2 text-sm text-zinc-400">
                      Send me a DM and let me know where you found me or what you&apos;re
                      interested in.
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 text-sm text-zinc-300">
                    <a
                        href="https://instagram.com/"
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-zinc-700 px-5 py-2 text-center transition-all hover:border-[#FF9FC6] hover:bg-[#FF9FC6]/10"
                    >
                      Instagram
                    </a>
                    <a
                        href="#"
                        className="rounded-full border border-zinc-700 px-5 py-2 text-center transition-all hover:border-[#FF9FC6] hover:bg-[#FF9FC6]/10"
                    >
                      Gambling stats page
                    </a>
                  </div>
                </div>
              </div>
              <p className="mt-8 text-center text-xs text-zinc-500">
                &copy; 2024 Raya Serahill
              </p>
            </div>
          </section>
        </main>
      </div>
  );
}
