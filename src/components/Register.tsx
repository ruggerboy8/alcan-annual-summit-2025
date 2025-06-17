
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Register = () => {
  return (
    <section id="register" className="py-20 bg-navy text-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Secure Your Spot
          </h2>
          <p className="text-xl opacity-90">Don't miss out on this incredible two-day experience</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="bg-white text-navy">
            <CardHeader>
              <CardTitle className="text-3xl text-center">ALCAN Annual Meeting 2025</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="text-center space-y-4">
                <div className="text-lg">
                  <strong>December 11-12, 2025</strong>
                </div>
                <div className="text-lg">
                  Texas Old Town, Kyle, TX
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                <h3 className="text-xl font-semibold text-center mb-4">What's Included:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Two days of CE sessions</li>
                  <li>✓ Networking cocktail hour</li>
                  <li>✓ Professional headshots</li>
                  <li>✓ Culture and leadership sessions</li>
                  <li>✓ Team celebration dinner</li>
                  <li>✓ All meals and refreshments</li>
                </ul>
              </div>

              {/* Registration Form */}
              <div className="bg-gray-100 p-4 rounded-lg">
                <iframe
                  id="JotFormIFrame-251667175047159"
                  title="ALCAN Annual Meeting 2025 Registration"
                  onLoad={() => window.parent.scrollTo(0,0)}
                  allowtransparency="true"
                  allow="geolocation; microphone; camera; fullscreen"
                  src="https://form.jotform.com/251667175047159"
                  frameBorder="0"
                  style={{
                    minWidth: '100%',
                    maxWidth: '100%',
                    height: '539px',
                    border: 'none'
                  }}
                  scrolling="no"
                />
              </div>

              <div className="text-center">
                <Button 
                  onClick={() => document.getElementById('JotFormIFrame-251667175047159')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-teal hover:bg-teal/90 text-white px-12 py-4 text-xl rounded-full transition-all duration-300 hover:scale-105"
                >
                  Grab My Ticket
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Register;
