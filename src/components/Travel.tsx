
import { Button } from '@/components/ui/button';

const Travel = () => {
  return (
    <section id="travel" className="py-12 bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-biondi font-bold text-primary mb-4 leading-tight">
            Travel Information
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Left Column - Text Content */}
            <div className="space-y-8">
              {/* Venue */}
              <div className="text-center">
                <h3 className="text-xl sm:text-2xl font-biondi font-bold text-primary mb-4">
                  Event Venue
                </h3>
                <div className="text-lg text-text leading-relaxed">
                  <p className="font-semibold">Texas Old Town</p>
                  <p>1205 Roland Ln</p>
                  <p>Kyle, TX 78640</p>
                </div>
              </div>

              {/* Getting There */}
              <div className="text-center">
                <h3 className="text-xl sm:text-2xl font-biondi font-bold text-primary mb-4">
                  Getting There
                </h3>
                <div className="text-lg text-text leading-relaxed space-y-2">
                  <p><strong>From Austin-Bergstrom Airport:</strong></p>
                  <p>25 minutes by car</p>
                  <p><strong>From Downtown Austin:</strong></p>
                  <p>30 minutes by car</p>
                </div>
              </div>

              {/* Hotel */}
              <div className="text-center">
                <h3 className="text-xl sm:text-2xl font-biondi font-bold text-primary mb-4">
                  Hotel Accommodations
                </h3>
                <div className="text-lg text-text leading-relaxed">
                  <p className="font-semibold">Fairfield Inn & Suites Austin Buda</p>
                  <p className="mt-2 mb-4">We have arranged a special rate for event guests.</p>
                  <Button 
                    onClick={() => window.open('https://www.marriott.com/event-reservations/reservation-link.mi?id=1733945462114&key=CORP&guestreslink2=true&app=resvlink', '_blank')}
                    className="bg-primary text-white hover:bg-primary/90 px-6 py-3 text-base rounded-lg transition-all duration-300 hover:scale-105 shadow-lg font-biondi"
                  >
                    Book Hotel Room
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Column - Map */}
            <div className="flex justify-center">
              <div className="w-full overflow-hidden rounded-lg">
             <iframe
  src="https://maps.google.com/maps?q=1205%20Roland%20Ln%2C%20Kyle%2C%20TX%2078640&output=embed"
  title="Texas Old Town Location"
  width="100%"
  height="300"
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
  className="w-full md:h-96 rounded-lg shadow-lg"
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
