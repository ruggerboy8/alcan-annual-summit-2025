import { Phone, MapPin, Plane, ExternalLink } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

const HOTEL_PHONE = '512-277-3482';
const HOTEL_PHONE_HREF = 'tel:+15122773482';
const HOTEL_URL = 'https://www.marriott.com/en-us/hotels/ausbu-fairfield-inn-and-suites-austin-buda/overview/';

const Travel = () => {
  const prefersReducedMotion = useReducedMotion();

  const fromLeft = (delay = 0) =>
    prefersReducedMotion
      ? {}
      : {
          initial: { opacity: 0, x: -24 },
          whileInView: { opacity: 1, x: 0 },
          viewport: { once: true, amount: 0.2 },
          transition: { duration: 0.6, delay, ease: 'easeOut' as const },
        };

  const fromRight = (delay = 0) =>
    prefersReducedMotion
      ? {}
      : {
          initial: { opacity: 0, x: 24 },
          whileInView: { opacity: 1, x: 0 },
          viewport: { once: true, amount: 0.2 },
          transition: { duration: 0.6, delay, ease: 'easeOut' as const },
        };

  const fadeUp = (delay = 0) =>
    prefersReducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.2 },
          transition: { duration: 0.6, delay, ease: 'easeOut' as const },
        };

  return (
    <section id="travel" className="relative overflow-hidden py-20">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(18, 69, 112, 0.88), rgba(18, 69, 112, 0.88)), url('/lovable-uploads/e5b3efd8-7083-44d6-8335-457d92c7629e.png')`,
        }}
      />

      <div className="container relative z-10">
        <div className="mb-14 text-center">
          <motion.h2
            {...fadeUp(0)}
            className="mb-4 font-biondi text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl"
          >
            Getting Here.
          </motion.h2>
          <div className="mx-auto h-px w-24 bg-gradient-to-r from-transparent via-gold/80 to-transparent" />
        </div>

        {/* Venue */}
        <div className="mx-auto mb-14 max-w-5xl">
          <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-2">
            <motion.div {...fromLeft(0)}>
              <div className="mb-4 flex items-center justify-center gap-3 md:justify-start">
                <MapPin className="h-6 w-6 text-gold" strokeWidth={1.5} />
                <h3 className="font-biondi text-2xl font-bold text-white sm:text-3xl">
                  Event Venue
                </h3>
              </div>
              <div
                className="text-center text-lg leading-relaxed text-white md:text-left"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
              >
                <p className="text-xl font-semibold">Texas Old Town</p>
                <p>1205 Roland Ln</p>
                <p>Kyle, TX 78640</p>
              </div>

              <div className="mb-4 mt-8 flex items-center justify-center gap-3 md:justify-start">
                <Plane className="h-6 w-6 text-gold" strokeWidth={1.5} />
                <h3 className="font-biondi text-2xl font-bold text-white sm:text-3xl">
                  Travel Times
                </h3>
              </div>
              <div
                className="space-y-1 text-center text-lg leading-relaxed text-white md:text-left"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
              >
                <p><strong>From Austin-Bergstrom Airport:</strong> 25 min by car</p>
                <p><strong>From Downtown Austin:</strong> 30 min by car</p>
              </div>
            </motion.div>

            <motion.div {...fromRight(0.1)} className="flex justify-center">
              <div className="w-full overflow-hidden rounded-lg shadow-2xl ring-1 ring-white/20">
                <iframe
                  src="https://maps.google.com/maps?q=29.969447961809706,-97.8886213490766&output=embed&z=15"
                  title="Texas Old Town Location"
                  width="100%"
                  height="300"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full md:h-96"
                  style={{ border: 0 }}
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Staying in Buda */}
        <motion.div {...fadeUp(0.1)} className="mx-auto max-w-3xl">
          <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/[0.07] p-8 text-center shadow-2xl backdrop-blur-md sm:p-12">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/80 to-transparent" />

            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-gold sm:text-sm">
              Where to Stay
            </p>
            <h3 className="mb-4 font-biondi text-2xl font-bold text-white sm:text-3xl md:text-4xl">
              Staying in Buda!
            </h3>
            <div className="mx-auto mb-6 h-px w-16 bg-gold/60" />

            <div
              className="text-lg leading-relaxed text-white"
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
            >
              <p className="text-xl font-semibold">Fairfield Inn &amp; Suites Austin Buda</p>

              <a
                href={HOTEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-2 text-base text-gold hover:text-gold-400 hover:underline sm:text-lg"
              >
                View hotel website
                <ExternalLink className="h-4 w-4" strokeWidth={2} />
              </a>

              <p className="mx-auto mt-5 max-w-xl text-white/90">
                To receive the Alcan group rate, call the hotel directly and let them know you&rsquo;re with Alcan.
              </p>

              <a
                href={HOTEL_PHONE_HREF}
                className="mt-6 inline-flex items-center gap-3 rounded-full border border-gold/70 bg-transparent px-6 py-3 text-base font-medium text-gold shadow-lg transition-all duration-300 hover:scale-[1.03] hover:bg-gold hover:text-primary sm:text-lg"
              >
                <Phone className="h-5 w-5" strokeWidth={2} />
                {HOTEL_PHONE}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Travel;
