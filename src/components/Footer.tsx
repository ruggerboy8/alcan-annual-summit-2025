
const Footer = () => {
  return (
    <footer className="bg-accent text-white py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Logo Column */}
          <div className="flex justify-center md:justify-start">
            <img 
              src="/lovable-uploads/b03b3869-2bb8-4e4a-9e0b-db7f04c5d946.png" 
              alt="Alcan Dental Cooperative" 
              className="h-12 w-auto brightness-0 invert"
            />
          </div>

          {/* Quick Links Column */}
          <div className="text-center">
            <h4 className="font-biondi font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#about" className="hover:text-white/80 transition-colors">About</a></li>
              <li><a href="#agenda" className="hover:text-white/80 transition-colors">Agenda</a></li>
              <li><a href="#speakers" className="hover:text-white/80 transition-colors">Speakers</a></li>
              <li><a href="#travel" className="hover:text-white/80 transition-colors">Travel</a></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="text-center md:text-right">
            <div className="inline-block bg-white/10 rounded-full px-4 py-2 break-all">
              <a href="mailto:info@alcandentalcooperative.com" className="text-white hover:underline text-sm sm:text-base">
                info@alcandentalcooperative.com
              </a>
            </div>
            <div className="mt-4 text-white/70 text-sm">
              © 2025 Alcan Dental Cooperative. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
