import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

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
    { label: 'Speakers', id: 'speakers' },
    { label: 'Agenda', id: 'agenda' },
    { label: 'Travel', id: 'travel' },
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setOpen(false);
  };

  const linkColor = isScrolled ? '#124570' : '#ffffff';
  const linkShadow = isScrolled ? 'none' : '0 1px 8px rgba(0,0,0,0.45)';

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
          <img
            src="/lovable-uploads/b03b3869-2bb8-4e4a-9e0b-db7f04c5d946.png"
            alt="Alcan Dental Cooperative"
            className={`h-8 w-auto transition-all duration-300 ${isScrolled ? '' : 'brightness-0 invert'}`}
          />
        </button>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-x-7 lg:gap-x-9">
          {links.map(l => (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id)}
              style={{ color: linkColor, textShadow: linkShadow }}
              className="group relative font-biondi hover:opacity-80 transition-all duration-300 text-sm uppercase tracking-[0.18em]"
            >
              {l.label}
              <span className="pointer-events-none absolute -bottom-1.5 left-1/2 h-px w-0 -translate-x-1/2 bg-gold transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          style={{ color: linkColor }}
          className="md:hidden transition-colors duration-300 drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]"
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
              style={{ color: '#124570' }}
              className="block w-full text-left px-6 py-4 font-biondi uppercase tracking-[0.18em] text-sm hover:bg-gray-50 transition-colors"
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
