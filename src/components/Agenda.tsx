import { motion, useReducedMotion } from 'framer-motion';

const Agenda = () => {
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
    <section id="agenda" className="bg-gray-50 py-16 sm:py-20">
      <div className="container">
        <div className="mb-10 text-center sm:mb-12">
          <motion.h2
            {...fade(0)}
            className="mb-3 font-biondi text-3xl font-bold leading-tight text-primary sm:text-4xl md:text-5xl"
          >
            Two Days. One Direction.
          </motion.h2>
          <motion.p
            {...fade(0.1)}
            className="text-sm font-semibold uppercase tracking-[0.3em] text-gold"
          >
            Full agenda releasing soon
          </motion.p>
        </div>

        <motion.p
          {...fade(0.2)}
          className="mx-auto max-w-2xl text-center text-lg leading-relaxed text-text sm:text-xl"
        >
          The 2026 Summit agenda is being finalized. Expect two focused days of workshops, keynotes, and connection &mdash; built for every member of your team.
        </motion.p>

        <motion.div
          {...fade(0.3)}
          className="mx-auto mt-10 h-px w-24 bg-gradient-to-r from-transparent via-gold/60 to-transparent"
        />
      </div>
    </section>
  );
};

export default Agenda;
