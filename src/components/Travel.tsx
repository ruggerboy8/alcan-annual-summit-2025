
import { Button } from '@/components/ui/button';

const Travel = () => {
  return (
    <section id="travel" className="relative py-20 overflow-hidden">
      {/* Austin Skyline Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(18, 69, 112, 0.85), rgba(18, 69, 112, 0.85)), url('/lovable-uploads/e5b3efd8-7083-44d6-8335-457d92c7629e.png')`
        }}
      />
      
      {/* Content */}
      <div className="container relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-biondi font-bold text-white mb-4 leading-tight">
            See You In Austin!
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Left Column - Text Content */}
            <div className="space-y-8">
              {/* Venue */}
              <div className="text-center">
                <h3 className="text-xl sm:text-2xl font-biondi font-bold text-white mb-4">
                  Event Venue
                </h3>
                <div className="text-lg text-white leading-relaxed" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                  <p className="font-semibold">Texas Old Town</p>
                  <p>1205 Roland Ln</p>
                  <p>Kyle, TX 78640</p>
                </div>
              </div>

              {/* Getting There */}
              <div className="text-center">
                <h3 className="text-xl sm:text-2xl font-biondi font-bold text-white mb-4">
                  Getting There
                </h3>
                <div className="text-lg text-white leading-relaxed space-y-2" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                  <p><strong>From Austin-Bergstrom Airport:</strong></p>
                  <p>25 minutes by car</p>
                  <p><strong>From Downtown Austin:</strong></p>
                  <p>30 minutes by car</p>
                </div>
              </div>

              {/* Hotel */}
              <div className="text-center">
                <h3 className="text-xl sm:text-2xl font-biondi font-bold text-white mb-4">
                  Hotel Accommodations
                </h3>
                <div className="text-lg text-white leading-relaxed" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                  <p className="font-semibold">Fairfield Inn & Suites Austin Buda</p>
                  <p className="mt-2">
                    Call the hotel directly and <strong>mention Alcan</strong> to receive your discounted group rate.
                  </p>
                  <p className="mt-4">
                    <a href="tel:+10000000000" className="underline decoration-white/50 underline-offset-4 hover:decoration-white">
                      Phone number coming soon
                    </a>
                  </p>
                  <p className="mt-1 text-base text-white/80">
                    Hotel website coming soon
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Map */}
            <div className="flex justify-center">
              <div className="w-full overflow-hidden rounded-lg shadow-lg">
                <iframe
                  src="https://maps.google.com/maps?q=29.969447961809706,-97.8886213490766&output=embed&z=15"
                  title="Texas Old Town Location"
                  width="100%"
                  height="300"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full md:h-96 rounded-lg"
                  style={{ border: 0 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Travel;
