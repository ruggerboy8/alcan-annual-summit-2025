
interface SummitLogoProps {
  className?: string;
  variant?: 'white' | 'black';
}

const SummitLogo = ({ className = "", variant = 'white' }: SummitLogoProps) => {
  const logoSrc = variant === 'white' 
    ? "/lovable-uploads/TheSummitWhite.png"
    : "/lovable-uploads/TheSummitBlack.png";

  // No animation here on purpose. The hero wraps this in a Framer Motion
  // element that owns the entrance. This component previously ALSO ran a CSS
  // keyframe pinned to opacity:0 with a 2s delay, so the logo stayed invisible
  // until after the tagline, date badge and CTA had already appeared.
  return (
    <img
      src={logoSrc}
      alt="The Summit"
      className={className}
    />
  );
};

export default SummitLogo;
