import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import SummitLogo from '@/components/SummitLogo';
import RegisterModal from '@/components/RegisterModal';

const bgPoster = '/lovable-uploads/246de050-106d-48c5-b1b9-e68886c9e482.png';

export default function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const logoVariants = {
    hidden: { scale: 0.6, y: 120, opacity: 0, filter: 'blur(20px)' },
    visible: {
      scale: 1, y: 0, opacity: 1, filter: 'blur(0px)',
      transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] as const }
    }
  };

  const uiVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: (delay = 0) => ({
      opacity: 1, y: 0,
      transition: { delay, duration: 0.6, ease: 'easeOut' as const }
    })
  };

  return (
    <section
      id="hero"
      className="relative isolate flex min-h-screen items-center justify-center overflow-hidden"
    >
      {!prefersReducedMotion && (
        <video
          autoPlay muted loop playsInline
          className="absolute inset-0 h-full w-full object-cover"
          poster={bgPoster}
          preload="metadata"
        >
          <source src="/lovable-uploads/HeroSummitVideo1.webm" type="video/webm" />
          <source src="/lovable-uploads/HeroSummitVideo1.mp4" type="video/mp4" />
        </video>
      )}

      {prefersReducedMotion && (
        <div
          className="absolute inset-0 h-full w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${bgPoster})` }}
        />
      )}

      {/* Layered cinematic overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70" />

      {/* Bottom gradient bridge into the dark CountdownTimer below */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0d2e4a] to-transparent" />

      {/* Main content */}
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-4">
        <motion.div
          initial="hidden" animate="visible"
          variants={prefersReducedMotion ? {} : logoVariants}
          className="mb-3 flex justify-center sm:mb-5"
        >
          <SummitLogo
            className="h-[34vh] max-h-[220px] w-auto sm:h-[44vh] sm:max-h-[300px]"
            variant="white"
          />
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial="hidden" animate="visible" custom={0.5}
          variants={prefersReducedMotion ? {} : uiVariants}
          className="mb-6 font-biondi text-xs uppercase tracking-[0.45em] text-white/80 sm:text-sm md:text-base"
        >
          Earn the View
        </motion.p>

        {/* BIG 2026 */}
        <motion.div
          initial="hidden" animate="visible" custom={0.7}
          variants={prefersReducedMotion ? {} : uiVariants}
          className="mb-6 flex flex-col items-center sm:mb-8"
        >
          <div className="mb-2 h-px w-20 bg-gradient-to-r from-transparent via-gold/80 to-transparent" />
          <div
            className="font-biondi font-bold leading-none text-white tabular-nums [text-shadow:0_4px_24px_rgba(0,0,0,0.55)]"
            style={{ fontSize: 'clamp(4.5rem, 14vw, 10rem)', letterSpacing: '0.04em' }}
            aria-label="2026"
          >
            2026
          </div>
          <div className="mt-2 h-px w-20 bg-gradient-to-r from-transparent via-gold/80 to-transparent" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial="hidden" animate="visible" custom={0.9}
          variants={prefersReducedMotion ? {} : uiVariants}
          className="mb-6 text-center font-biondi text-2xl tracking-[0.04em] text-white sm:text-3xl md:text-4xl [text-shadow:0_2px_10px_rgba(0,0,0,0.4)]"
        >
          Built for people who never stop climbing.
        </motion.h1>

        {/* Date badge — gold border */}
        <motion.div
          initial="hidden" animate="visible" custom={1.2}
          variants={prefersReducedMotion ? {} : uiVariants}
          className="inline-block rounded-sm border border-gold/80 px-6 py-2.5 text-sm font-medium uppercase tracking-[0.28em] text-white backdrop-blur-sm sm:px-10 sm:text-base"
          aria-label="Event date: December 11 to 12, 2026, Austin Texas"
        >
          December&nbsp;11&ndash;12,&nbsp;2026 · Austin,&nbsp;TX
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: scrolled ? 0 : 1 }}
        transition={{ duration: 0.4 }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={prefersReducedMotion ? {} : { y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="text-white/80"
        >
          <ChevronDown size={32} strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    </section>
  );
}
