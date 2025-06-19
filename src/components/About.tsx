
import ImageCarousel from './ImageCarousel';
import RegisterModal from './RegisterModal';

const About = () => {
  return (
    <section id="about" className="py-12 bg-gray-50">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="max-w-[680px] order-2 md:order-1">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-biondi font-bold text-primary mb-6 leading-tight">
                About the Event
              </h2>
              <p className="text-lg sm:text-xl text-text leading-relaxed mb-6">
                We're thrilled to officially invite you to the 2025 Alcan Annual Event
                —a two-day experience designed to sharpen our skills, strengthen
                our teams, and celebrate the incredible work happening across
                our practices. From high-impact CE sessions to unforgettable
                team celebrations, this year's event in Austin will be our biggest
                and best yet.
              </p>
              <p className="text-lg sm:text-xl text-text leading-relaxed mb-8">
                Get ready to learn, connect, and have some serious fun—we can't
                wait to see you there!
              </p>
              
              {/* Register Button */}
              <div className="flex justify-start">
                <RegisterModal 
                  buttonClassName="bg-primary hover:bg-primary/92 text-white px-8 sm:px-12 py-4 text-lg sm:text-xl rounded-lg transition-all duration-300 hover:scale-105 shadow-lg font-biondi font-bold"
                />
              </div>
            </div>
            <div className="flex justify-center md:justify-end order-1 md:order-2">
              <div className="w-full max-w-sm sm:max-w-md md:max-w-none md:w-[80%]">
                <ImageCarousel />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
