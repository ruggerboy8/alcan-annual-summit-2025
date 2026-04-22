import { motion, useReducedMotion } from 'framer-motion';
import ImageCarousel from './ImageCarousel';
import RegistrationModal from './RegistrationModal';

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

  const headingFade = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.2 },
        transition: { duration: 0.5, ease: 'easeOut' as const },
      };

  const bodyFade = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.2 },
        transition: { duration: 0.5, delay: 0.07, ease: 'easeOut' as const },
      };

  const carouselFade = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, x: 24 },
        whileInView: { opacity: 1, x: 0 },
        viewport: { once: true, amount: 0.2 },
        transition: { duration: 0.6, ease: 'easeOut' as const },
      };

  return (
    <section id="about" className="border-t border-gray-100 bg-gray-50 py-12 lg:py-16">
      <div className="container">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
            {/* Copy block */}
            <div className="order-2 max-w-[680px] md:order-1">
              <motion.h2
                {...headingFade}
                className="mb-6 font-biondi text-3xl font-bold leading-tight text-primary sm:text-4xl md:text-5xl"
              >
                A Different Kind of Gathering.
              </motion.h2>

              <motion.div {...bodyFade}>
                <p className="mb-5 text-lg leading-relaxed text-text sm:text-xl">
                  The Summit is the annual gathering for every member of the Alcan network &mdash; doctors, coordinators, managers, and front-desk teams alike. Not a CE requirement. Not a sales floor. A two-day climb designed for the people who show up every day to do something nobody&rsquo;s done before.
                </p>

                <p className="mb-5 text-lg leading-relaxed text-text sm:text-xl">
                  What you can expect:
                </p>

                <ul className="mb-8 list-none space-y-4 text-lg leading-relaxed text-text sm:text-xl">
                  {bullets.map((b) => (
                    <li key={b.title} className="flex">
                      <span className="mr-3 font-bold text-gold">•</span>
                      <span>
                        <strong>{b.title}</strong> &mdash; {b.body}
                      </span>
                    </li>
                  ))}
                </ul>

                <p className="mb-10 text-lg leading-relaxed text-text sm:text-xl">
                  You&rsquo;ll leave with new tools, real relationships, and a clearer sense of where you fit in something much bigger than any one practice.
                </p>

                <div className="flex">
                  <RegistrationModal
                    buttonText="Reserve Your Spot"
                    buttonClassName="bg-primary hover:bg-primary/90 text-white px-8 sm:px-12 py-4 text-lg sm:text-xl rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 font-biondi font-bold"
                  />
                </div>
              </motion.div>
            </div>

            {/* Carousel */}
            <motion.div
              {...carouselFade}
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
