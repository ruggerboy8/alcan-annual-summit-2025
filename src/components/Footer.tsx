
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="text-center space-y-4">
          <div className="text-lg">
            Questions? Contact us at{' '}
            <a href="mailto:info@alcandentalcooperative.com" className="text-teal hover:underline">
              info@alcandentalcooperative.com
            </a>
          </div>
          <div className="text-gray-400">
            © 2025 Alcan Dental Cooperative. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
