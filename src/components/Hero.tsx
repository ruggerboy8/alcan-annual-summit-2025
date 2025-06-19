
import RegisterModal from '@/components/RegisterModal';
import SummitLogo from '@/components/SummitLogo';

const Hero = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <video 
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster="/lovable-uploads/7aa55f44-b908-4912-a30e-fc99897616cd.png"
      >
        <source src="/lovable-uploads/HeroVideo.mp4" type="video/mp4" />
        <source src="/lovable-uploads/HeroVideo.webm" type="video/webm" />
      </video>
      
      {/* Dark Overlay for text readability */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Content */}
      <div className="container">
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto">
          {/* The Summit Logo */}
          <div className="mb-8 flex justify-center">
            <SummitLogo 
              className="h-32 sm:h-40 md:h-48 w-auto" 
              variant="white"
              animate={true}
            />
          </div>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-biondi font-light mb-6 animate-fade-in leading-tight" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
            ALCAN Annual Meeting 2025
          </h1>
          
          <p className="text-xl sm:text-2xl md:text-3xl mb-6 font-light text-white" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
            Kyle, TX
          </p>
          
          {/* Date Badge */}
          <div className="inline-block border-2 border-white text-white bg-black/20 backdrop-blur-sm px-4 sm:px-8 py-3 rounded text-xl sm:text-2xl md:text-3xl font-semibold mb-12 font-biondi tracking-wide cursor-default">
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
