
interface SummitLogoProps {
  className?: string;
  animate?: boolean;
  variant?: 'white' | 'black';
}

const SummitLogo = ({ className = "", animate = true, variant = 'white' }: SummitLogoProps) => {
  const logoSrc = variant === 'white' 
    ? "/lovable-uploads/ff7a71fa-80bc-48b2-9d7f-d8d9a319d0ca.png"
    : "/lovable-uploads/65f0bfee-b259-4915-97db-6d52e4cc3b9c.png";

  return (
    <img 
      src={logoSrc}
      alt="The Summit"
      className={`${className} ${animate ? 'animate-summit-logo' : ''}`}
      style={{ 
        animationDelay: animate ? '2s' : '0s',
        opacity: animate ? '0' : '1'
      }}
    />
  );
};

export default SummitLogo;
