import wordmarkWhite from '@/assets/logos/alcan-wordmark-white.png';

const Footer = () => {
  return (
    <footer className="bg-navy-deep py-12 text-white">
      <div className="container">
        <p className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.45em] text-white/60">
          Earn the View ·
        </p>

        <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-3">
          <div className="flex justify-center md:justify-start">
            <img
              src={wordmarkWhite}
              alt="Alcan Dental Cooperative"
              className="h-12 w-auto"
            />
          </div>

          <div className="text-center">
            <h4 className="mb-4 font-biondi font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#about" className="transition-colors hover:text-teal-bright">About</a></li>
              <li><a href="#speakers" className="transition-colors hover:text-teal-bright">Speakers</a></li>
              <li><a href="#agenda" className="transition-colors hover:text-teal-bright">Agenda</a></li>
              <li><a href="#travel" className="transition-colors hover:text-teal-bright">Travel</a></li>
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
