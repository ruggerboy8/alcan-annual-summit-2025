import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import SummitLogo from '@/components/SummitLogo';
import RegistrationModal from '@/components/RegistrationModal';


const bgPoster = '/lovable-uploads/hero-poster.jpg';

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
          {/* Both files must exist. A .webm source was previously listed here
              without the file ever being committed: browsers selected it, got a
              404, and stalled at readyState 0 WITHOUT falling through to the mp4,
              so the hero only ever showed its poster. */}
          <source src="/lovable-uploads/hero-1080.webm" type="video/webm" />
          <source src="/lovable-uploads/hero-1080.mp4" type="video/mp4" />
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
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-navy-deep to-transparent" />

      {/* Main content */}
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-4">
        {/* The mark is wide (~2.4:1), so it is sized by WIDTH. The source PNG used
            to be a 1563x1563 square whose artwork filled only 41% of the height,
            which meant a tall box rendered a small logo; the padding is now
            trimmed off the asset itself. */}
        <motion.div
          initial="hidden" animate="visible"
          variants={prefersReducedMotion ? {} : logoVariants}
          className="mb-6 flex w-full justify-center sm:mb-8"
        >
          <SummitLogo
            className="h-auto w-[min(88%,720px)]"
            variant="white"
          />
        </motion.div>

        {/* Tagline — now the headline */}
        <motion.h1
          initial="hidden" animate="visible" custom={0.7}
          variants={prefersReducedMotion ? {} : uiVariants}
          className="mb-8 text-center font-biondi font-bold uppercase text-white tracking-[0.16em] sm:tracking-[0.24em] [text-shadow:0_2px_14px_rgb(0_0_0/0.5)]"
          style={{ fontSize: 'clamp(1.5rem, 4.6vw, 3.5rem)' }}
        >
          Earn the View
        </motion.h1>

        {/* Date badge — teal border */}
        <motion.div
          initial="hidden" animate="visible" custom={1.0}
          variants={prefersReducedMotion ? {} : uiVariants}
          className="inline-block rounded-sm border border-teal-bright/80 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.22em] text-white backdrop-blur-sm sm:px-10 sm:text-base sm:tracking-[0.28em]"
          aria-label="Event date: December 10 to 11, 2026, Austin Texas"
        >
          December&nbsp;10&ndash;11,&nbsp;2026 · Austin,&nbsp;TX
        </motion.div>

        <motion.div
          initial="hidden" animate="visible" custom={1.2}
          variants={prefersReducedMotion ? {} : uiVariants}
          className="mt-8 sm:mt-10"
        >
          <RegistrationModal
            buttonText="Register Now"
            buttonClassName="bg-teal-bright hover:bg-white text-primary px-10 sm:px-14 py-5 sm:py-6 text-lg sm:text-xl rounded-lg transition-all duration-300 hover:scale-105 shadow-xl font-biondi font-bold"
          />
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
