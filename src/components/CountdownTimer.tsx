import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const TARGET_DATE = new Date('December 10, 2026 09:00:00').getTime();

const CountdownTimer = () => {
  const prefersReducedMotion = useReducedMotion();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const update = () => {
      const diff = TARGET_DATE - new Date().getTime();
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      }
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  const itemMotion = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.4 },
      };

  return (
    <section className="bg-[#0d2e4a] py-16 sm:py-24">
      <div className="container text-center">
        <motion.p
          {...(prefersReducedMotion
            ? {}
            : {
                initial: { opacity: 0, y: 12 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true },
                transition: { duration: 0.6 },
              })}
          className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-gold"
        >
          The Ascent Begins
        </motion.p>
        <div className="mx-auto mb-12 h-px w-24 bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

        <div className="mx-auto flex max-w-5xl items-center justify-center gap-3 sm:gap-6 lg:gap-10">
          {units.map((u, i) => (
            <div key={u.label} className="flex items-center">
              <motion.div
                {...itemMotion}
                transition={{ duration: 0.6, delay: i * 0.08, ease: 'easeOut' }}
                className="flex flex-col items-center"
              >
                <div
                  className="font-biondi font-bold text-white tabular-nums leading-none"
                  style={{ fontSize: 'clamp(2.5rem, 10vw, 7rem)' }}
                >
                  {u.value.toString().padStart(2, '0')}
                </div>
                <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.3em] text-white/50 sm:text-xs">
                  {u.label}
                </p>
              </motion.div>
              {i < units.length - 1 && (
                <div className="mx-2 h-10 w-px bg-gold/60 sm:mx-4 lg:mx-6" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CountdownTimer;
