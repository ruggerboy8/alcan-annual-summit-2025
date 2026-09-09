import { Eyebrow, NavyPanel, Reveal } from '@/components/section';

const HYPE_VIDEO_VIMEO_SRC =
  'https://player.vimeo.com/video/1154545041?h=abccca39e0&title=0&byline=0&portrait=0';

/**
 * Speakers and Agenda used to be two separate sections sitting back to back,
 * each saying "coming soon". Two empty promises in a row, immediately before
 * asking people to book travel and register. They are one honest section now.
 *
 * This is also the page's one structural set-piece: the brand deck's navy panel
 * against a light content field. Deliberately the only section that uses it.
 */
export default function Lineup() {
  return (
    <section id="lineup" className="bg-n01">
      {/* The panel full-bleeds to the viewport edge, per the brand deck grid.
          Content inside each column is what gets constrained, not the columns. */}
      <div className="grid grid-cols-1 items-stretch lg:grid-cols-[45fr_55fr]">
        {/* Navy panel — carries the title */}
        <NavyPanel className="flex items-center justify-center px-6 py-14 sm:px-10 lg:justify-end lg:py-28">
          <Reveal className="w-full max-w-lg lg:pr-10">
            <Eyebrow tone="dark" className="mb-5">
              Still to come
            </Eyebrow>
            <h2 className="font-biondi text-display-lg font-bold text-white">
              A Lineup Worth the Climb.
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-white/80">
              Speakers and the full two-day agenda are being finalized. Expect
              workshops, keynotes, and the kind of connection that only happens
              when the whole network is in one room.
            </p>
          </Reveal>
        </NavyPanel>

        {/* Light field — carries the reel */}
        <div className="flex items-center justify-center px-6 py-14 sm:px-10 lg:justify-start lg:py-28">
          <Reveal delay={0.1} className="w-full max-w-2xl lg:pl-10">
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-n06 shadow-xl ring-1 ring-n03">
              <iframe
                title="The Summit 2025 — Hype Reel"
                src={HYPE_VIDEO_VIMEO_SRC}
                className="h-full w-full"
                frameBorder={0}
                referrerPolicy="strict-origin-when-cross-origin"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                allowFullScreen
              />
            </div>
            <p className="mt-5 text-base text-ink-soft">
              Until then, here&rsquo;s a look at what we built last year.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
