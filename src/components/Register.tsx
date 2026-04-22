import { motion, useReducedMotion } from 'framer-motion';
import RegistrationModal from '@/components/RegistrationModal';

const Register = () => {
  const prefersReducedMotion = useReducedMotion();

  const fade = (delay = 0) =>
    prefersReducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.3 },
          transition: { duration: 0.6, delay, ease: 'easeOut' as const },
        };

  return (
    <section id="register" className="bg-primary py-16 text-white sm:py-20">
      <div className="container">
        <div className="text-center">
          <motion.h2
            {...fade(0)}
            className="mb-6 font-biondi text-3xl font-bold leading-tight sm:text-4xl md:text-5xl"
          >
            Ready to Make the Climb?
          </motion.h2>
          <motion.p
            {...fade(0.1)}
            className="mx-auto mb-8 max-w-2xl text-lg text-white/90 sm:text-xl"
          >
            Registration is open to all Alcan team members. Secure your seat before spots fill.
          </motion.p>

          <motion.div {...fade(0.2)}>
            <RegistrationModal
              buttonText="Register Now"
              buttonClassName="bg-gold hover:bg-white text-primary px-12 sm:px-16 py-6 text-xl sm:text-2xl rounded-lg transition-all duration-300 hover:scale-105 shadow-xl font-biondi font-bold min-w-[280px] sm:min-w-[320px]"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Register;
