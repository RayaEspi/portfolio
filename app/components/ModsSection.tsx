import Image from "next/image";

export function ModsSection() {
  return (
    <section
      id="mods"
      className="bg-gradient-to-b from-black via-zinc-950 to-black py-20 md:py-24"
    >
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
            I create mods mainly for myself and friends, sometimes releasing small
            things :p My range goes from simple accessories to tattoos, clothing
            mods and just recently animations! I&apos;m on a mission to make me and
            my friends look the best we can
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
  );
}
