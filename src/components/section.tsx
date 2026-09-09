import { motion, useReducedMotion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

/* ---------------------------------------------------------------------------
   Shared section primitives.

   The point of this file is constraint. Every section on the site reveals with
   the SAME recipe and labels itself with the SAME eyebrow, so the page reads as
   one designed system instead of a stack of individually tuned blocks. When you
   add a section later, reach for these rather than hand-rolling motion again.

   One reveal. One duration. One easing. One distance.
   --------------------------------------------------------------------------- */

const DURATION = 0.55;
const DISTANCE = 16;
const EASE = [0.22, 1, 0.36, 1] as const;

const revealVariants: Variants = {
  hidden: { opacity: 0, y: DISTANCE },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: DURATION, delay, ease: EASE },
  }),
};

interface RevealProps {
  children: ReactNode;
  /** Seconds. Keep chains short — at most two or three steps per section. */
  delay?: number;
  className?: string;
}

/** Fades and lifts its children into view once, the first time they are seen. */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={revealVariants}
      initial="hidden"
      whileInView="visible"
      custom={delay}
      viewport={{ once: true, amount: 0.25 }}
    >
      {children}
    </motion.div>
  );
}

interface EyebrowProps {
  children: ReactNode;
  /** `dark` = sitting on navy. `light` = sitting on a light surface. */
  tone?: 'light' | 'dark';
  className?: string;
}

/**
 * Small metadata label above a heading. Uses the brand's metadata face
 * (IBM Plex Mono, uppercase, open tracking) rather than the body face, which is
 * what makes it read as a label instead of just small text.
 */
export function Eyebrow({ children, tone = 'light', className = '' }: EyebrowProps) {
  return (
    <p
      className={[
        'font-mono text-eyebrow font-medium uppercase',
        tone === 'dark' ? 'text-teal-bright' : 'text-teal',
        className,
      ].join(' ')}
    >
      {children}
    </p>
  );
}

/**
 * The mountains mark from the brand package, used as panel texture.
 *
 * The brand guide is explicit that this belongs inside navy panels and nowhere
 * else, so it is scoped to `NavyPanel` below rather than exported on its own.
 */
function PanelTexture() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 720 344"
      preserveAspectRatio="xMinYMax slice"
      className="pointer-events-none absolute -bottom-8 -left-20 h-[45%] w-[135%] text-navy-panel"
    >
      {/* Path taken verbatim from alcan-brand/assets/logos/mountains/MOUNTAINS
          GRAPHIC.svg, coordinates rounded. */}
      <path
        fill="currentColor"
        d="M720 344 L0 344 L0 278.37 L162.21 114.01 L241.6 194.24 L432.45 0.85 L530.41 97.12 L619.09 0 L720 108.73 Z"
      />
    </svg>
  );
}

interface NavyPanelProps {
  children: ReactNode;
  className?: string;
}

/**
 * The brand deck's signature block: a navy panel holding the section's title,
 * set against a light content field. Carries the mountains texture.
 *
 * Use this sparingly. It is the page's loudest structural device, and it stops
 * being a device the moment two sections in a row use it.
 */
export function NavyPanel({ children, className = '' }: NavyPanelProps) {
  return (
    <div className={`relative isolate overflow-hidden bg-navy ${className}`}>
      <PanelTexture />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
