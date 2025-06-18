
const Footer = () => {
  return (
    <footer className="bg-accent text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Logo Column */}
          <div className="flex justify-center md:justify-start">
            <img 
              src="/lovable-uploads/16f3af94-62a6-4cf8-9394-b4b3117966be.png" 
              alt="ALCAN Dental Cooperative Logo" 
              className="h-12 filter brightness-0 invert"
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
            <div className="inline-block bg-white/10 rounded-full px-4 py-2">
              <a href="mailto:info@alcandentalcooperative.com" className="text-white hover:underline">
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
