
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface RegisterModalProps {
  buttonText?: string;
  buttonClassName?: string;
}

const RegisterModal = ({ 
  buttonText = "Register Now", 
  buttonClassName = "bg-primary hover:bg-primary/92 text-white px-12 sm:px-16 py-6 text-xl sm:text-2xl rounded-lg transition-all duration-300 hover:scale-105 shadow-lg font-biondi font-bold min-w-[280px] sm:min-w-[320px]"
}: RegisterModalProps) => {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleFallbackClick = () => {
    window.open('https://form.jotform.com/243667816995167', '_blank');
  };

  return (
    <>
      <Button 
        onClick={openModal}
        className={buttonClassName}
      >
        {buttonText}
      </Button>

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

export default RegisterModal;
