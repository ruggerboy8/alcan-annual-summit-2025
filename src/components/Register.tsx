
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';

const Register = () => {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <>
      <section id="register" className="py-12 bg-navy text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-biondi font-bold mb-4">
              Secure Your Spot
            </h2>
            <p className="text-xl opacity-90">Don't miss out on this incredible two-day experience</p>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card className="bg-white text-navy">
              <CardHeader>
                <CardTitle className="text-3xl text-center font-biondi">ALCAN Annual Meeting 2025</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center space-y-4">
                  <div className="text-lg">
                    <strong>December 11-12, 2025</strong>
                  </div>
                  <div className="text-lg">
                    Texas Old Town, Kyle, TX
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                  <h3 className="text-xl font-semibold text-center mb-4 font-biondi">What's Included:</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>✓ Two days of CE sessions</li>
                    <li>✓ Networking cocktail hour</li>
                    <li>✓ Professional headshots</li>
                    <li>✓ Culture and leadership sessions</li>
                    <li>✓ Team celebration dinner</li>
                    <li>✓ All meals and refreshments</li>
                  </ul>
                </div>

                <div className="text-center space-y-4">
                  <Button 
                    onClick={openModal}
                    className="bg-primary hover:bg-primary/92 text-white px-12 py-4 text-xl rounded-full transition-all duration-300 hover:scale-105 font-biondi"
                  >
                    Grab My Ticket
                  </Button>
                  
                  <div>
                    <a 
                      href="https://form.jotform.com/251667175047159" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white px-8 py-3 text-lg rounded-full transition-all duration-300 font-biondi"
                    >
                      Open Registration Form
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4" style={{ background: 'rgba(0, 0, 0, 0.6)' }}>
          <div className="relative bg-white rounded-xl w-full max-w-4xl" style={{ maxHeight: '90vh', height: '90vh' }}>
            <button 
              onClick={closeModal} 
              className="absolute top-4 right-4 z-10 bg-black/10 hover:bg-black/20 rounded-full p-2 transition-colors"
            >
              <X size={20} />
            </button>
            <iframe
              id="JotFormIFrame-251667175047159"
              title="ALCAN Annual Meeting 2025 Registration"
              allowTransparency={true}
              allow="geolocation; microphone; camera; fullscreen"
              src="https://form.jotform.com/251667175047159"
              frameBorder="0"
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                borderRadius: '12px'
              }}
              scrolling="yes"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Register;
