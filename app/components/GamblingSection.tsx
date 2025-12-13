export function GamblingSection() {
  return (
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
              I like games of chance almost as much as I like tracking them. I
              log my gambling sessions, collect stats, and turn them into
              something I can poke at later: trends, streaks, and leaderboards
              to make it exciting for players too ^^
            </p>
            <p className="text-zinc-400 text-sm">
              The data itself lives elsewhere, but this is the home base if you
              want to peek into the numbers.
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
  );
}
