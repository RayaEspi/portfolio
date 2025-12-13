export function ContactSection() {
  return (
    <section
      id="contact"
      className="bg-gradient-to-t from-black via-zinc-950 to-black py-20 md:py-24"
    >
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
        <p className="mt-8 text-center text-xs text-zinc-500">&copy; 2024 Raya Serahill</p>
      </div>
    </section>
  );
}
