import { motion, useReducedMotion } from 'framer-motion';

const HYPE_VIDEO_VIMEO_SRC =
  'https://player.vimeo.com/video/1154545041?h=abccca39e0&title=0&byline=0&portrait=0';

export default function Speakers() {
  const prefersReducedMotion = useReducedMotion();

  const fade = (delay = 0) =>
    prefersReducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.2 },
          transition: { duration: 0.6, delay, ease: 'easeOut' as const },
        };

  return (
    <section id="speakers" className="border-t border-gray-100 bg-white py-12 sm:py-16">
      <div className="container">
        <div className="mb-8 text-center sm:mb-10">
          <motion.h2
            {...fade(0)}
            className="mb-3 font-biondi text-3xl font-bold leading-tight text-primary sm:text-4xl md:text-5xl"
          >
            A Lineup Worth the Climb.
          </motion.h2>
          <motion.p
            {...fade(0.1)}
            className="text-sm font-semibold uppercase tracking-[0.3em] text-gold"
          >
            Speaker announcements coming soon
          </motion.p>
        </div>

        <motion.div
          {...(prefersReducedMotion
            ? {}
            : {
                initial: { opacity: 0, scale: 0.96 },
                whileInView: { opacity: 1, scale: 1 },
                viewport: { once: true, amount: 0.3 },
                transition: { duration: 0.7, delay: 0.2, ease: 'easeOut' },
              })}
          className="mx-auto max-w-4xl"
        >
          <div className="aspect-video overflow-hidden rounded-2xl bg-black shadow-xl">
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
          <motion.p
            {...fade(0.4)}
            className="mt-6 text-center text-base text-gray-500"
          >
            Until then, here&rsquo;s a look at what we built last year.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
