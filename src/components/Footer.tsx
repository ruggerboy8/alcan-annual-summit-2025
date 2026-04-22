const Footer = () => {
  return (
    <footer className="bg-accent py-12 text-white">
      <div className="container">
        <p className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.45em] text-white/50">
          Earn the View
        </p>

        <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-3">
          <div className="flex justify-center md:justify-start">
            <img
              src="/lovable-uploads/b03b3869-2bb8-4e4a-9e0b-db7f04c5d946.png"
              alt="Alcan Dental Cooperative"
              className="h-12 w-auto brightness-0 invert"
            />
          </div>

          <div className="text-center">
            <h4 className="mb-4 font-biondi font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#about" className="transition-colors hover:text-gold">About</a></li>
              <li><a href="#speakers" className="transition-colors hover:text-gold">Speakers</a></li>
              <li><a href="#agenda" className="transition-colors hover:text-gold">Agenda</a></li>
              <li><a href="#travel" className="transition-colors hover:text-gold">Travel</a></li>
            </ul>
          </div>

          <div className="text-center md:text-right">
            <div className="inline-block break-all rounded-full bg-white/10 px-4 py-2">
              <a
                href="mailto:info@alcandentalcooperative.com"
                className="text-sm text-white hover:underline sm:text-base"
              >
                info@alcandentalcooperative.com
              </a>
            </div>
            <div className="mt-4 text-sm text-white/70">
              © 2026 Alcan Dental Cooperative. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
