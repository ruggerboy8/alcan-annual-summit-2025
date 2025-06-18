
const About = () => {
  return (
    <section id="about" className="py-12 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-[680px]">
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
            <div className="flex justify-center lg:justify-end">
              <div className="w-80 h-80 rounded-full overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Team meeting"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
