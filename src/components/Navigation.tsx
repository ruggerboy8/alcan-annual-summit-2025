import { useState, useEffect } from 'react';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  /* ─────────────────────────────────────────────
     Detect scroll position to add shadow / blur
  ───────────────────────────────────────────── */
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* Smooth-scroll helper */
  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${isScrolled
          ? 'bg-white/95 backdrop-blur-sm shadow-[0_2px_6px_rgba(0,0,0,0.05)]'
          : 'bg-white/95 backdrop-blur-sm'
        }`}
    >
      <div className="container">
        <div className="py-2 sm:py-4">

          {/* ───── Menu buttons (now wrap on small screens) ───── */}
          <div
            className="
              flex flex-wrap                    /* ENABLE WRAP */
              justify-center
              gap-x-2 gap-y-2                   /* horiz & vert gaps */
              sm:flex-nowrap sm:gap-y-0        /* single row ≥640px */
              sm:space-x-4 lg:space-x-6
              overflow-visible                 /* kill horizontal scroll */
            "
          >
            {[
              { label: 'Home', id: 'hero' },
              { label: 'About', id: 'about' },
              { label: 'Agenda', id: 'agenda' },
              { label: 'Speakers', id: 'speakers' },
              { label: 'Travel', id: 'travel' },
              { label: 'Register', id: 'register' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="
                  font-biondi font-medium
                  text-primary hover:text-accent
                  transition-colors duration-200
                  text-sm sm:text-base lg:text-lg
                  tracking-wide whitespace-nowrap
                  px-2 py-1 sm:px-3
                "
                style={{ letterSpacing: '0.5px' }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;