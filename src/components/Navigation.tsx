
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  /* switch to solid bar once we scroll past the hero */
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > window.innerHeight - 80);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'Home', id: 'hero' },
    { label: 'About', id: 'about' },
    { label: 'Speakers', id: 'speakers' },
    { label: 'Agenda', id: 'agenda' },
    { label: 'Travel', id: 'travel' },
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setOpen(false);
  };

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300
        ${isScrolled
          ? 'bg-primary/95 shadow-[0_4px_24px_rgba(0,0,0,0.25)] backdrop-blur-xl border-b border-white/10'
          : 'bg-gradient-to-b from-black/55 to-transparent backdrop-blur-sm border-b border-transparent'
        }`}
    >
      <div className="container flex items-center justify-between py-3">
        {/* Logo (left) */}
        <button
          onClick={() => scrollTo('hero')}
          className="flex items-center transition-opacity hover:opacity-80"
        >
          <img
            src="/lovable-uploads/b03b3869-2bb8-4e4a-9e0b-db7f04c5d946.png"
            alt="Alcan Dental Cooperative"
            className="h-8 w-auto brightness-0 invert"
          />
        </button>

        {/* ───────── Desktop Links ───────── */}
        <div className="hidden md:flex gap-x-7 lg:gap-x-9">
          {links.map(l => (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id)}
              style={{ color: '#ffffff', textShadow: '0 1px 8px rgba(0,0,0,0.45)' }}
              className="group relative font-biondi hover:opacity-80 transition-opacity text-sm uppercase tracking-[0.18em]"
            >
              {l.label}
              <span className="pointer-events-none absolute -bottom-1.5 left-1/2 h-px w-0 -translate-x-1/2 bg-accent transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </div>

        {/* ───────── Hamburger (mobile) ───────── */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]"
          aria-label="Toggle menu"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* ───────── Mobile dropdown ───────── */}
      {open && (
        <div className="md:hidden bg-primary/95 backdrop-blur-xl border-t border-white/10 shadow-lg">
          {links.map(l => (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id)}
              className="block w-full text-left px-6 py-4 font-biondi text-white/90 uppercase tracking-[0.18em] text-sm hover:bg-white/10 transition-colors"
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
