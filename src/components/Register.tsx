

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
        <div className="container">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-biondi font-bold mb-6 leading-tight">
              Reserve Your Spot
            </h2>
            <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto">
              Don't miss out on this incredible opportunity to learn, network, and celebrate with the Alcan community.
            </p>
            
            <div className="space-y-4">
              <Button 
                onClick={openModal}
                className="bg-white text-primary hover:bg-white/90 px-12 sm:px-16 py-6 text-xl sm:text-2xl rounded-lg transition-all duration-300 hover:scale-105 shadow-lg font-biondi font-bold min-w-[280px] sm:min-w-[320px]"
              >
                Register Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {showModal && (
        <div className="modal-backdrop p-4" onClick={closeModal}>
          <div className="modal-content w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={closeModal}
              className="modal-close"
              aria-label="Close modal"
            >
              <X size={16} />
            </button>
            <div className="p-0 h-full">
              <iframe
                src="https://form.jotform.com/251667175047159"
                className="w-full h-[80vh] min-h-[600px]"
                style={{ 
                  border: 'none'
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

