
import RegisterModal from '@/components/RegisterModal';
import SummitLogo from '@/components/SummitLogo';

const Hero = () => {
  const scrollToRegister = () => {
    const element = document.getElementById('register');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Austin Skyline Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(18, 69, 112, 0.55), rgba(18, 69, 112, 0.55)), url('/lovable-uploads/e5b3efd8-7083-44d6-8335-457d92c7629e.png')`
        }}
      />
      
      {/* Content */}
      <div className="container">
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto">
          {/* The Summit Logo */}
          <div className="mb-8 flex justify-center">
            <SummitLogo className="h-32 sm:h-40 md:h-48 w-auto text-white" />
          </div>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-biondi font-light mb-6 animate-fade-in leading-tight" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.25)' }}>
            ALCAN Annual Meeting 2025
          </h1>
          
          <p className="text-xl sm:text-2xl md:text-3xl mb-6 font-light text-white">
            Kyle, TX
          </p>
          
          {/* Date Badge */}
          <div className="inline-block border-2 border-white text-white bg-transparent px-4 sm:px-8 py-3 rounded text-xl sm:text-2xl md:text-3xl font-semibold mb-12 font-biondi tracking-wide cursor-default">
            December&nbsp; 11–12
          </div>
          
          {/* CTA Button */}
          <div className="mb-12">
            <RegisterModal />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
