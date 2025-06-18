
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
              <p className="text-xl text-text leading-relaxed">
                Join us for an incredible two-day experience designed for all Alcan practice roles. 
                Our annual meeting brings together learning opportunities, meaningful connections, 
                and plenty of fun in the heart of Texas. Whether you're looking to expand your 
                knowledge, network with peers, or simply enjoy great company, this event promises 
                to deliver an unforgettable experience for everyone in the Alcan family.
              </p>
            </div>
            <div className="flex justify-center lg:justify-end order-1 lg:order-2">
              <div className="w-full max-w-md lg:max-w-none lg:w-[40%]">
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
