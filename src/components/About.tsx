import { motion, useReducedMotion } from 'framer-motion';
import ImageCarousel from './ImageCarousel';
import RegisterModal from './RegisterModal';

const bullets = [
  {
    title: 'Hands-on continuing education',
    body: 'Practical, immediately usable, led by people who\u2019ve done the work.',
  },
  {
    title: 'Real conversations between practices',
    body: 'The kind where someone else\u2019s solved problem saves you six months of trial and error.',
  },
  {
    title: 'Time to celebrate',
    body: 'To connect. To remember that the people at this table are building something that matters.',
  },
];

const About = () => {
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
    <section id="about" className="border-t border-gray-100 bg-gray-50 py-14 lg:py-20">
      <div className="container">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
            {/* Copy block */}
            <div className="order-2 max-w-[680px] md:order-1">
              <motion.h2
                {...fade(0)}
                className="mb-6 font-biondi text-3xl font-bold leading-tight text-primary sm:text-4xl md:text-5xl"
              >
                A Different Kind of Gathering.
              </motion.h2>

              <motion.p
                {...fade(0.1)}
                className="mb-5 text-lg leading-relaxed text-text sm:text-xl"
              >
                The Summit is the annual gathering for every member of the Alcan network &mdash; doctors, coordinators, managers, and front-desk teams alike. Not a CE requirement. Not a sales floor. A two-day climb designed for the people who show up every day to do something nobody&rsquo;s done before.
              </motion.p>

              <motion.p {...fade(0.2)} className="mb-5 text-lg leading-relaxed text-text sm:text-xl">
                What you can expect:
              </motion.p>

              <ul className="mb-8 list-none space-y-4 text-lg leading-relaxed text-text sm:text-xl">
                {bullets.map((b, i) => (
                  <motion.li key={b.title} {...fade(0.3 + i * 0.1)} className="flex">
                    <span className="mr-3 font-bold text-gold">•</span>
                    <span>
                      <strong>{b.title}</strong> &mdash; {b.body}
                    </span>
                  </motion.li>
                ))}
              </ul>

              <motion.p
                {...fade(0.6)}
                className="mb-10 text-lg leading-relaxed text-text sm:text-xl"
              >
                You&rsquo;ll leave with new tools, real relationships, and a clearer sense of where you fit in something much bigger than any one practice.
              </motion.p>

              <motion.div {...fade(0.7)} className="flex">
                <RegisterModal
                  buttonText="Reserve Your Spot"
                  buttonClassName="bg-primary hover:bg-primary/90 text-white px-8 sm:px-12 py-4 text-lg sm:text-xl rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 font-biondi font-bold"
                />
              </motion.div>
            </div>

            {/* Carousel */}
            <motion.div
              {...(prefersReducedMotion
                ? {}
                : {
                    initial: { opacity: 0, x: 30 },
                    whileInView: { opacity: 1, x: 0 },
                    viewport: { once: true, amount: 0.2 },
                    transition: { duration: 0.7, ease: 'easeOut' },
                  })}
              className="order-1 flex justify-center md:order-2 md:justify-end"
            >
              <div className="w-full max-w-sm sm:max-w-md md:w-[80%] md:max-w-none">
                <ImageCarousel />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
