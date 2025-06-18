
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const Register = () => {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleFallbackClick = () => {
    window.open('https://form.jotform.com/243667816995167', '_blank');
  };

  return (
    <>
      <section id="register" className="py-12 bg-primary text-white">
        <div className="container mx-auto px-2 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-biondi font-bold mb-6 leading-tight">
            Reserve Your Spot
          </h2>
          <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto px-2">
            Don't miss out on this incredible opportunity to learn, network, and celebrate with the Alcan community.
          </p>
          
          <div className="space-y-4">
            <Button 
              onClick={openModal}
              className="bg-white text-primary hover:bg-white/90 px-6 sm:px-12 py-4 text-lg sm:text-xl rounded-full transition-all duration-300 hover:scale-105 shadow-lg font-biondi"
            >
              Grab My Ticket
            </Button>
            
            <Button 
              onClick={handleFallbackClick}
              variant="ghost"
              className="block mx-auto text-white hover:bg-white/10 px-4 py-2 text-sm"
            >
              Open in New Tab
            </Button>
          </div>
        </div>
      </section>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              <button 
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
              <iframe
                src="https://form.jotform.com/243667816995167"
                width="100%"
                height="800"
                style={{ 
                  border: 'none',
                  minHeight: '800px'
                }}
                title="Event Registration Form"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Register;
