import { motion, useReducedMotion } from 'framer-motion';
import RegisterModal from '@/components/RegisterModal';
import SummitLogo    from '@/components/SummitLogo';

const Hero = () => {
  const prefersReduced = useReducedMotion();

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* ─── Video background ─────────────────────────────── */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        poster="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=2340&q=80"
      >
        <source src="/lovable-uploads/HeroSummitVideo1.mp4" type="video/mp4" />
      </video>

      {/* ─── Soft mist overlay for readability ────────────── */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />

      {/* ─── Content ─────────────────────────────────────── */}
      <div className="container">
        <div className="relative z-10 text-center text-white mx-auto max-w-4xl">

          {/* Summit logo — bigger + animated */}
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, scale: 2 }}
            animate={prefersReduced ? {} : { opacity: 1, scale: 1 }}
            transition={{ duration: 1.8, ease: 'easeOut' }}
            className="mb-10 flex justify-center"
          >
            {/* Responsive height chain → huge on desktop, reasonable on mobile */}
            <SummitLogo
              className="h-44 sm:h-56 md:h-64 lg:h-72 xl:h-80 w-auto"
              variant="white"
            />
          </motion.div>

          {/* Tagline */}
          <h1
            className="text-2xl sm:text-4xl md:text-5xl font-biondi font-light mb-10 animate-fade-in leading-tight"
            style={{ textShadow: '0 2px 6px rgba(0,0,0,0.55)' }}
          >
            Let&rsquo;s&nbsp;climb&nbsp;together
          </h1>

          {/* Date badge */}
          <div className="inline-block border-2 border-white text-white bg-black/20 backdrop-blur-sm px-6 sm:px-10 py-3 rounded text-xl sm:text-2xl md:text-3xl font-semibold mb-14 tracking-wide cursor-default">
            December&nbsp;11 – 12&nbsp;·&nbsp;Kyle,&nbsp;TX
          </div>

          {/* CTA */}
          <RegisterModal />
        </div>
      </div>
    </section>
  );
};

export default Hero;