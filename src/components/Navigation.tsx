
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
    { label: 'Agenda', id: 'agenda' },
    { label: 'Speakers', id: 'speakers' },
    { label: 'Travel', id: 'travel' },
    { label: 'Register', id: 'register' }
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
          ? 'bg-white shadow-[0_2px_6px_rgba(0,0,0,0.05)] backdrop-blur-sm'
          : 'bg-white/95 backdrop-blur-sm'
        }`}
    >
      <div className="container flex items-center justify-between py-3">
        {/* Logo (left) */}
        <button
          onClick={() => scrollTo('hero')}
          className="flex items-center"
        >
          <img 
            src="/lovable-uploads/b03b3869-2bb8-4e4a-9e0b-db7f04c5d946.png" 
            alt="Alcan Dental Cooperative" 
            className="h-8 w-auto"
          />
        </button>

        {/* ───────── Desktop Links ───────── */}
        <div className="hidden md:flex gap-x-6 lg:gap-x-8">
          {links.map(l => (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id)}
              className="font-biondi text-primary/90 hover:text-accent transition-colors text-base"
            >
              {l.label}
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
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          {links.map(l => (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id)}
              className="block w-full text-left px-6 py-4 font-biondi text-primary hover:bg-gray-50"
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
