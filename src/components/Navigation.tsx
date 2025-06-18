
import { useState, useEffect } from 'react';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-[0_2px_6px_rgba(0,0,0,0.05)]' : 'bg-white/95 backdrop-blur-sm'
    }`}>
      <div className="container">
        <div className="py-2 sm:py-4">
          <div className="flex justify-center space-x-2 sm:space-x-4 lg:space-x-6 overflow-x-auto">
            {[
              { label: 'Home', id: 'hero' },
              { label: 'About', id: 'about' },
              { label: 'Agenda', id: 'agenda' },
              { label: 'Speakers', id: 'speakers' },
              { label: 'Travel', id: 'travel' },
              { label: 'Register', id: 'register' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="font-biondi font-medium text-primary hover:text-accent transition-colors duration-200 text-sm sm:text-base lg:text-lg tracking-wide whitespace-nowrap px-2 py-1"
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
