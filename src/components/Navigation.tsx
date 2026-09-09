import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import wordmarkNavy from '@/assets/logos/alcan-wordmark-navy.png';
import wordmarkWhite from '@/assets/logos/alcan-wordmark-white.png';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Switch to solid bar once we scroll past the hero (~85% viewport height)
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'Home', id: 'hero' },
    { label: 'About', id: 'about' },
    { label: 'Lineup', id: 'lineup' },
    { label: 'Travel', id: 'travel' },
    { label: 'Register', id: 'register' },
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setOpen(false);
  };

  // Over the hero the bar is transparent, so links need white + a shadow to stay
  // legible against the video. Once the bar goes solid they switch to navy.
  const linkTone = isScrolled
    ? 'text-navy'
    : 'text-white [text-shadow:0_1px_8px_rgb(0_0_0/0.45)]';

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300
        ${isScrolled
          ? 'bg-white/95 shadow-sm backdrop-blur-md border-b border-black/5'
          : 'bg-transparent border-b border-transparent'
        }`}
    >
      <div className="container flex items-center justify-between py-3">
        {/* Logo */}
        <button
          onClick={() => scrollTo('hero')}
          className="flex items-center transition-opacity hover:opacity-80"
        >
          {/* Two real brand wordmarks rather than a CSS filter. The old markup
              used the WHITE artwork for both states and only inverted it over the
              hero — so once the bar went solid white, the logo was white on white. */}
          <img
            src={isScrolled ? wordmarkNavy : wordmarkWhite}
            alt="Alcan Dental Cooperative"
            className="h-8 w-auto transition-opacity duration-300"
          />
        </button>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-x-7 lg:gap-x-9">
          {links.map(l => (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id)}
              className={`group relative font-biondi hover:opacity-80 transition-all duration-300 text-sm uppercase tracking-[0.18em] ${linkTone}`}
            >
              {l.label}
              <span className="pointer-events-none absolute -bottom-1.5 left-1/2 h-px w-0 -translate-x-1/2 bg-teal transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className={`md:hidden transition-colors duration-300 drop-shadow-[0_1px_4px_rgb(0_0_0/0.4)] ${linkTone}`}
          aria-label="Toggle menu"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile dropdown — always white */}
      {open && (
        <div className="md:hidden bg-white border-t border-black/5 shadow-lg">
          {links.map(l => (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id)}
              className="block w-full text-left px-6 py-4 font-biondi uppercase tracking-[0.18em] text-sm text-navy hover:bg-n02 transition-colors"
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navigation;
