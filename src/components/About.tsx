
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
                Why attend The Summit?
              </h2>
              <p className="text-lg sm:text-xl text-text leading-relaxed mb-6">
                Every ascent starts with a single step—and with the right partners on the rope.
              </p>
              <p className="text-lg sm:text-xl text-text leading-relaxed mb-6">
                Over two powerful days we'll climb together through:
              </p>
              <ul className="text-lg sm:text-xl text-text leading-relaxed mb-6 space-y-3">
                <li className="flex items-start">
                  <span className="text-primary mr-3 font-bold">•</span>
                  <span><strong>Skill pitches</strong> – fast-paced CE sessions that add real altitude to your craft.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3 font-bold">•</span>
                  <span><strong>Roped-in round-tables</strong> – cross-practice huddles where we solve for tomorrow, today.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3 font-bold">•</span>
                  <span><strong>Base-camp celebrations</strong> – nightly socials that refuel relationships (and appetites).</span>
                </li>
              </ul>
              <p className="text-lg sm:text-xl text-text leading-relaxed mb-8">
                By the time we plant our flag in Austin's hill country, you'll head home with fresh tools, deeper bonds, and a renewed view from the top.
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
