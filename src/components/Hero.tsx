
/* -------------------------------------------------------------------------- */
/*  Hero                                                                     */
/* -------------------------------------------------------------------------- */
import { motion, useReducedMotion } from 'framer-motion';
import RegisterModal           from '@/components/RegisterModal';
import SummitLogo              from '@/components/SummitLogo';

const bgPoster = '/lovable-uploads/246de050-106d-48c5-b1b9-e68886c9e482.png';

export default function Hero() {
  /* honor the user's "reduced motion" setting */
  const prefersReducedMotion = useReducedMotion();

  /* animation variants ----------------------------------------------------- */
  const logoVariants = {
    hidden: { scale: 0.6, y: 120, opacity: 0, filter: 'blur(20px)' },
    visible: {
      scale: 1,
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const uiVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay, duration: 0.6, ease: 'easeOut' }
    })
  };

  /* ----------------------------------------------------------------------- */
  return (
    <section
      id="hero"
      className="relative isolate flex min-h-screen items-center justify-center overflow-hidden"
    >
      {/* ---------- video background ---------- */}
      {!prefersReducedMotion && (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          poster={bgPoster}
          preload="metadata"
        >
          <source
            src="/lovable-uploads/HeroSummitVideo1.webm"
            type="video/webm"
          />
          <source
            src="/lovable-uploads/HeroSummitVideo1.mp4"
            type="video/mp4"
          />
        </video>
      )}

      {/* fallback image when video is disabled / reduced-motion */}
      {prefersReducedMotion && (
        <div
          className="absolute inset-0 h-full w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${bgPoster})` }}
        />
      )}

      {/* ---------- dark overlay for readability ---------- */}
      <div className="absolute inset-0 bg-black/60 sm:bg-black/50" />
      {/* ---------- bottom gradient for legibility & countdown bridge ---------- */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-transparent to-black/80" />

      {/* ---------- subtle mist layer (parallax) ---------- */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-repeat-x opacity-70"
        style={{
          backgroundImage:
            "url('https://raw.githubusercontent.com/ste-sources/cdn-assets/main/mist.png')",
          backgroundSize: 'contain'
        }}
      />

      {/* ---------- main content ---------- */}
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-4">
        {/* Summit logo */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={prefersReducedMotion ? {} : logoVariants}
          className="mb-6 flex justify-center sm:mb-8"
        >
          <SummitLogo
            className="h-[45vh] max-h-[280px] w-auto sm:h-[55vh] sm:max-h-[360px]"
            variant="white"
          />
        </motion.div>

        {/* headline */}
        <motion.h1
          initial="hidden"
          animate="visible"
          custom={0.9}
          variants={prefersReducedMotion ? {} : uiVariants}
          className="mb-6 text-center font-biondi text-3xl tracking-wide text-white sm:text-4xl md:text-5xl [text-shadow:0_2px_12px_rgba(0,0,0,0.45)]"
        >
          Let&rsquo;s&nbsp;climb&nbsp;together
        </motion.h1>

        {/* date badge */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={1.2}
          variants={prefersReducedMotion ? {} : uiVariants}
          className="mb-10 inline-block rounded border border-white/80 bg-black/30 px-6 py-2.5 text-base font-medium uppercase tracking-[0.2em] text-white backdrop-blur-sm shadow-[inset_0_0_20px_rgba(255,255,255,0.08)] sm:px-10 sm:text-lg"
          aria-label="Event date: December 2026, dates coming soon"
        >
          December&nbsp;2026 — Dates&nbsp;Coming&nbsp;Soon
        </motion.div>

        {/* CTA button */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={1.5}
          variants={prefersReducedMotion ? {} : uiVariants}
        >
          <RegisterModal />
        </motion.div>
      </div>
    </section>
  );
}
