import { useState, useEffect } from 'react';

/**
 * Tentative target date for the 2026 Summit.
 * Update this single constant when official dates are confirmed.
 */
const TARGET_DATE = new Date('December 11, 2026 09:00:00').getTime();

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = TARGET_DATE - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds, pulse: true },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-black via-primary to-white py-16 sm:py-20">
      {/* subtle radial flourish */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at center top, rgba(255,255,255,0.15), transparent 60%)',
        }}
      />

      <div className="container relative text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.35em] text-accent sm:text-sm">
          The next ascent begins in
        </p>
        <div className="mx-auto mb-10 h-px w-24 bg-gradient-to-r from-transparent via-accent to-transparent" />

        <div className="mx-auto grid max-w-4xl grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
          {units.map((u) => (
            <div key={u.label} className="flex flex-col items-center">
              <div className="relative w-full">
                {/* thin accent ring */}
                <div className="absolute inset-0 rounded-2xl border border-white/15" />
                <div className="absolute inset-0 rounded-2xl border-t border-accent/40" />

                <div className="relative rounded-2xl bg-white/5 px-2 py-4 backdrop-blur-sm sm:px-4 sm:py-6 lg:py-8">
                  <div
                    className={`font-biondi font-bold text-white tabular-nums leading-none ${
                      u.pulse ? 'animate-pulse-soft' : ''
                    }`}
                    style={{ fontSize: 'clamp(2.25rem, 9vw, 7rem)' }}
                  >
                    {u.value.toString().padStart(2, '0')}
                  </div>
                </div>
              </div>
              <div className="mt-3 h-px w-8 bg-accent/60" />
              <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.25em] text-white/80 sm:text-xs">
                {u.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CountdownTimer;
