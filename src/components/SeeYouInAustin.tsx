
const SeeYouInAustin = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Austin Skyline Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(18, 69, 112, 0.85), rgba(18, 69, 112, 0.85)), url('/lovable-uploads/e5b3efd8-7083-44d6-8335-457d92c7629e.png')`
        }}
      />
      
      {/* Content */}
      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-5xl font-biondi font-semibold mb-8">
            See You in Austin!
          </h2>
          
          <p className="text-lg md:text-xl leading-relaxed mb-8" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
            Join us in the heart of Texas for an unforgettable experience! Austin's vibrant culture, 
            world-class dining, and legendary music scene provide the perfect backdrop for our annual 
            gathering. From the iconic food trucks to the scenic Hill Country views, you'll discover 
            why Austin truly is one of America's most beloved destinations. Get ready to network, 
            learn, and celebrate in a city that knows how to keep things weird – and wonderful.
          </p>
          
          <div className="inline-block border-2 border-white text-white bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg text-lg font-medium">
            🎸 Keep Austin Weird 🌮
          </div>
        </div>
      </div>
    </section>
  );
};

export default SeeYouInAustin;
