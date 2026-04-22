import { Phone, MapPin, Plane } from 'lucide-react';

const Travel = () => {
  return (
    <section id="travel" className="relative py-20 overflow-hidden">
      {/* Austin Skyline Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(18, 69, 112, 0.88), rgba(18, 69, 112, 0.88)), url('/lovable-uploads/e5b3efd8-7083-44d6-8335-457d92c7629e.png')`,
        }}
      />

      {/* Content */}
      <div className="container relative z-10">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-biondi font-bold text-white mb-4 leading-tight">
            See You In Austin!
          </h2>
          <div className="mx-auto h-px w-24 bg-gradient-to-r from-transparent via-white/70 to-transparent" />
        </div>

        {/* Venue */}
        <div className="max-w-5xl mx-auto mb-14">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                <MapPin className="h-6 w-6 text-white" strokeWidth={1.5} />
                <h3 className="text-2xl sm:text-3xl font-biondi font-bold text-white">
                  Event Venue
                </h3>
              </div>
              <div className="text-center md:text-left text-lg text-white leading-relaxed" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                <p className="font-semibold text-xl">Texas Old Town</p>
                <p>1205 Roland Ln</p>
                <p>Kyle, TX 78640</p>
              </div>

              <div className="mt-8 flex items-center justify-center md:justify-start gap-3 mb-4">
                <Plane className="h-6 w-6 text-white" strokeWidth={1.5} />
                <h3 className="text-2xl sm:text-3xl font-biondi font-bold text-white">
                  Getting There
                </h3>
              </div>
              <div className="text-center md:text-left text-lg text-white leading-relaxed space-y-1" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                <p><strong>From Austin-Bergstrom Airport:</strong> 25 min by car</p>
                <p><strong>From Downtown Austin:</strong> 30 min by car</p>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="w-full overflow-hidden rounded-lg shadow-2xl ring-1 ring-white/20">
                <iframe
                  src="https://maps.google.com/maps?q=29.969447961809706,-97.8886213490766&output=embed&z=15"
                  title="Texas Old Town Location"
                  width="100%"
                  height="300"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full md:h-96"
                  style={{ border: 0 }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Staying in Buda — premium card */}
        <div className="max-w-3xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/[0.07] backdrop-blur-md p-8 sm:p-12 text-center shadow-2xl">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />

            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.3em] text-white/80 mb-3">
              Where to Stay
            </p>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-biondi font-bold text-white mb-4">
              Staying in Buda!
            </h3>
            <div className="mx-auto mb-6 h-px w-16 bg-white/40" />

            <div className="text-lg text-white leading-relaxed" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
              <p className="font-semibold text-xl">Fairfield Inn &amp; Suites Austin Buda</p>
              <p className="mt-2 text-white/90">
                Call the hotel directly and <strong>mention Alcan</strong> to receive your discounted group rate.
              </p>

              <a
                href="tel:+15122773482"
                className="mt-6 inline-flex items-center gap-3 rounded-full border border-white/40 bg-white/10 px-6 py-3 text-base sm:text-lg font-medium text-white backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-primary hover:scale-[1.03] shadow-lg"
              >
                <Phone className="h-5 w-5" strokeWidth={2} />
                512-277-3482
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Travel;
