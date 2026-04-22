
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  /* shadow on scroll */
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
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
          ? 'bg-white/85 shadow-[0_4px_20px_rgba(18,69,112,0.08)] backdrop-blur-xl border-b border-primary/5'
          : 'bg-white/70 backdrop-blur-md border-b border-transparent'
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
            className="h-8 w-auto"
          />
        </button>

        {/* ───────── Desktop Links ───────── */}
        <div className="hidden md:flex gap-x-7 lg:gap-x-9">
          {links.map(l => (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id)}
              className="group relative font-biondi text-primary/85 hover:text-primary transition-colors text-base tracking-wide"
            >
              {l.label}
              <span className="pointer-events-none absolute -bottom-1 left-1/2 h-px w-0 -translate-x-1/2 bg-accent transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </div>

        {/* ───────── Hamburger (mobile) ───────── */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-primary"
          aria-label="Toggle menu"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* ───────── Mobile dropdown ───────── */}
      {open && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-primary/5 shadow-lg">
          {links.map(l => (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id)}
              className="block w-full text-left px-6 py-4 font-biondi text-primary hover:bg-primary/5 transition-colors"
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
