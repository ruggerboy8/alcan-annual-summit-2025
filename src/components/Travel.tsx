
const Travel = () => {
  return (
    <section id="travel" className="py-12 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-biondi font-bold text-primary mb-4">
            Travel & Accommodations
          </h2>
          <p className="text-xl text-gray-600">Everything you need to know for your trip to Kyle, TX</p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Venue Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-biondi font-bold text-primary mb-4">Venue</h3>
              <div className="space-y-2">
                <p className="font-semibold">Texas Old Town</p>
                <p>Kyle, TX 78640</p>
                <p className="text-gray-600">A historic venue perfect for our annual gathering</p>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-biondi font-bold text-primary mb-4">Hotel Accommodations</h3>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="font-semibold mb-2">Hampton Inn & Suites Austin South/Buda</p>
                <p className="text-gray-600 mb-4">15 minutes from the venue</p>
                <a 
                  href="https://www.hilton.com/en/book/reservation/deeplink/?ctyhocn=AUSBDHX&groupCode=CHHAMS&arrivaldate=2025-12-10&departuredate=2025-12-13&cid=OM,WW,HILTONLINK,EN,DirectLink&fromId=HILTONLINKDIRECT" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-biondi"
                >
                  Book Your Room
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-biondi font-bold text-primary mb-4">Getting There</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold">✈️ Fly into Austin-Bergstrom (AUS)</p>
                  <p className="text-gray-600">30 minutes to Kyle, TX</p>
                </div>
                <div>
                  <p className="font-semibold">🚗 Driving</p>
                  <p className="text-gray-600">Free parking available at venue</p>
                </div>
                <div>
                  <p className="font-semibold">🚕 Rideshare</p>
                  <p className="text-gray-600">Uber/Lyft readily available</p>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="flex justify-center">
            <div className="w-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3445.8472813354847!2d-97.8730!3d30.1986!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8644d5e6e1234567%3A0x1234567890abcdef!2sKyle%2C%20TX%2078640!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
                className="w-full h-[400px] md:h-[400px] sm:h-[300px] rounded-lg"
                style={{ border: 0, borderRadius: '8px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Texas Old Town Kyle Location"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Travel;
