import Image from "next/image";

export function PluginsSection() {
  return (
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
            data, and add quality-of-life tweaks. Think stats collectors, fun
            games, and nerdy little utilities that probably started as a “what if
            I just…”. I also create stuff if someone brings an interesting idea
            to me!
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
  );
}
