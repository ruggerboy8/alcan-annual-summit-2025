
/* -------------------------------------------------------------------------- */
/*  Hero                                                                     */
/* -------------------------------------------------------------------------- */
import { motion, useReducedMotion } from 'framer-motion';
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
          className="mb-4 flex justify-center sm:mb-6"
        >
          <SummitLogo
            className="h-[38vh] max-h-[240px] w-auto sm:h-[48vh] sm:max-h-[320px]"
            variant="white"
          />
        </motion.div>

        {/* BIG 2026 announcement */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={0.7}
          variants={prefersReducedMotion ? {} : uiVariants}
          className="mb-6 flex flex-col items-center sm:mb-8"
        >
          <div className="mb-2 h-px w-20 bg-gradient-to-r from-transparent via-white/70 to-transparent" />
          <div
            className="font-biondi font-bold leading-none text-white tabular-nums [text-shadow:0_4px_24px_rgba(0,0,0,0.55)]"
            style={{ fontSize: 'clamp(4.5rem, 14vw, 10rem)', letterSpacing: '0.04em' }}
            aria-label="2026"
          >
            2026
          </div>
          <div className="mt-2 h-px w-20 bg-gradient-to-r from-transparent via-white/70 to-transparent" />
        </motion.div>

        {/* headline */}
        <motion.h1
          initial="hidden"
          animate="visible"
          custom={0.9}
          variants={prefersReducedMotion ? {} : uiVariants}
          className="mb-6 text-center font-biondi text-2xl tracking-[0.04em] text-white sm:text-3xl md:text-4xl [text-shadow:0_2px_10px_rgba(0,0,0,0.4)]"
        >
          Let&rsquo;s&nbsp;climb&nbsp;together
        </motion.h1>

        {/* date badge */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={1.2}
          variants={prefersReducedMotion ? {} : uiVariants}
          className="inline-block rounded-sm border border-white/70 bg-white/5 px-6 py-2.5 text-sm font-medium uppercase tracking-[0.28em] text-white backdrop-blur-md shadow-[inset_0_0_30px_rgba(255,255,255,0.06)] sm:px-10 sm:text-base"
          aria-label="Event date: December 11 to 12, 2026, Austin Texas"
        >
          December&nbsp;11&ndash;12,&nbsp;2026 · Austin,&nbsp;TX
        </motion.div>
      </div>
    </section>
  );
}
