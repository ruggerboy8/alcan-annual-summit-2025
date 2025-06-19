
import RegisterModal from '@/components/RegisterModal';

const Register = () => {
  return (
    <section id="register" className="py-12 bg-primary text-white">
      <div className="container">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-biondi font-bold mb-6 leading-tight">
            Reserve Your Spot
          </h2>
          <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto text-white">
            Don't miss out on this incredible opportunity to learn, network, and celebrate with the Alcan community.
          </p>
          
          <div className="space-y-4">
            <RegisterModal 
              buttonClassName="bg-white text-primary hover:bg-white/90 px-12 sm:px-16 py-6 text-xl sm:text-2xl rounded-lg transition-all duration-300 hover:scale-105 shadow-lg font-biondi font-bold min-w-[280px] sm:min-w-[320px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
