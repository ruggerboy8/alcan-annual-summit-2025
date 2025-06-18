
import ImageCarousel from './ImageCarousel';

const About = () => {
  return (
    <section id="about" className="py-12 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-[680px] order-2 lg:order-1">
              <h2 className="text-4xl md:text-5xl font-biondi font-bold text-primary mb-6">
                About the Meeting
              </h2>
              <p className="text-xl text-text leading-relaxed mb-6">
                We're thrilled to officially invite you to the 2025 Alcan Annual Event
                —a two-day experience designed to sharpen our skills, strengthen
                our teams, and celebrate the incredible work happening across
                our practices. From high-impact CE sessions to unforgettable
                team celebrations, this year's event in Austin will be our biggest
                and best yet.
              </p>
              <p className="text-xl text-text leading-relaxed">
                Get ready to learn, connect, and have some serious fun—we can't
                wait to see you there!
              </p>
            </div>
            <div className="flex justify-center lg:justify-end order-1 lg:order-2">
              <div className="w-full max-w-md lg:max-w-none lg:w-[60%]">
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
