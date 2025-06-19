
interface SummitLogoProps {
  className?: string;
  animate?: boolean;
  variant?: 'white' | 'black';
}

const SummitLogo = ({ className = "", animate = true, variant = 'white' }: SummitLogoProps) => {
  const logoSrc = variant === 'white' 
    ? "/lovable-uploads/TheSummitWhite.png"
    : "/lovable-uploads/TheSummitBlack.png";

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
