/* -------------------------------------------------------------------------- */
/*  Hero                                                                     */
/* -------------------------------------------------------------------------- */
import { motion, useReducedMotion } from 'framer-motion';
import RegisterModal           from '@/components/RegisterModal';
import SummitLogo              from '@/components/SummitLogo';

const bgPoster =
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=2400&q=80';

export default function Hero() {
  /* honor the user’s “reduced motion” setting */
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
          className="mb-10 flex justify-center"
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
          className="mb-8 text-center font-biondi text-3xl text-white drop-shadow-md sm:text-4xl md:text-5xl"
        >
          Let&rsquo;s&nbsp;climb&nbsp;together
        </motion.h1>

        {/* date badge */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={1.2}
          variants={prefersReducedMotion ? {} : uiVariants}
          className="mb-14 inline-block rounded border-2 border-white/90 bg-black/30 px-6 py-3 text-lg font-semibold tracking-wide text-white backdrop-blur-sm sm:px-10 sm:text-2xl"
          aria-label="Event date: December 11 to 12"
        >
          December&nbsp;11&nbsp;–&nbsp;12
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