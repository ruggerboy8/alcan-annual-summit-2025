
const Travel = () => {
  return (
    <section id="travel" className="py-12 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-biondi font-bold text-primary mb-4 leading-tight">
            Travel Information
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column - Text Content */}
            <div className="space-y-8">
              {/* Venue */}
              <div className="text-center lg:text-left">
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
              <div className="text-center lg:text-left">
                <h3 className="text-xl sm:text-2xl font-biondi font-bold text-primary mb-4">
                  Hotel Accommodations
                </h3>
                <div className="text-lg text-text leading-relaxed">
                  <p>We have arranged a special rate for event guests at nearby hotels.</p>
                  <p className="mt-2">Details will be provided upon registration.</p>
                </div>
              </div>
            </div>

            {/* Right Column - Map */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-md lg:max-w-none">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3457.123456789!2d-97.8765432!3d29.9876543!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjnCsDU5JzE1LjYiTiA5N8KwNTInMzUuNiJX!5e0!3m2!1sen!2sus!4v1234567890"
                  width="100%"
                  height="300"
                  className="rounded-lg shadow-lg lg:h-96"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Texas Old Town Location"
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
