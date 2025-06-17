
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Travel = () => {
  return (
    <section id="travel" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-navy mb-4">
            Travel & Accommodation
          </h2>
          <p className="text-xl text-gray-600">Everything you need to plan your stay in Kyle, TX</p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Hotel Information */}
          <Card className="border-2 border-navy/10">
            <CardHeader>
              <CardTitle className="text-2xl text-navy">Hotel Accommodations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-700">
                We've secured a special room block for ALCAN attendees with preferred rates 
                and convenient access to the venue.
              </p>
              
              <div className="bg-teal/10 p-4 rounded-lg">
                <h4 className="font-semibold text-navy mb-2">Venue Address</h4>
                <p className="text-gray-700">
                  Texas Old Town<br />
                  Kyle, TX 78640
                </p>
              </div>

              <Button 
                className="w-full bg-teal hover:bg-teal/90 text-white"
                onClick={() => window.open('https://www.marriott.com/event-reservations/reservation-link.mi?id=1733945462114&key=CORP&guestreslink2=true&app=resvlink', '_blank')}
              >
                Book Hotel Room Block
              </Button>
            </CardContent>
          </Card>

          {/* Map */}
          <Card className="border-2 border-navy/10">
            <CardHeader>
              <CardTitle className="text-2xl text-navy">Location Map</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3464.6!2d-97.8!3d30.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDAwJzAwLjAiTiA5N8KwNDgnMDAuMCJX!5e0!3m2!1sen!2sus!4v1629000000000!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-lg"
                ></iframe>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Travel;
