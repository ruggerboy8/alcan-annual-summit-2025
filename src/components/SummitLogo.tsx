
interface SummitLogoProps {
  className?: string;
  animate?: boolean;
}

const SummitLogo = ({ className = "", animate = true }: SummitLogoProps) => {
  return (
    <svg 
      viewBox="0 0 500 500"
      className={`${className} ${animate ? 'animate-fade-in' : ''}`}
      fill="none"
      stroke="currentColor" 
      strokeWidth="2"
      strokeLinecap="round" 
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>The Summit logo</title>

      {/* Word "THE" (small, above SUMMIT) */}
      <g id="word-the" className={animate ? 'animate-fade-in' : ''} style={{ animationDelay: animate ? '0.3s' : '0s' }}>
        <path fill="currentColor" d="M287 247l.09-9h14v3l-10 .2v3l9 .2v3l-9 .2v4h11v4h-14z"/>
        <path fill="currentColor" d="M266 247l.09-9 4-.2v7h9v-7h4v17h-4v-7h-9v7h-4z"/>
        <path fill="currentColor" d="M251 246v-10h-9v-4l22 .2.2 4h-9v19h-4z"/>
      </g>

      {/* Word "SUMMIT" */}
      <g id="word-summit" className={animate ? 'animate-fade-in' : ''} style={{ animationDelay: animate ? '0.6s' : '0s' }}>
        {/* S */}
        <path fill="currentColor" d="M457 300l-.08-14-12-.2v-7h32v7l-12 .2-.2 27h-7z"/>
        {/* U */}
        <path fill="currentColor" d="M431 297v-17h7v34h-7z"/>
        {/* M 1 */}
        <path fill="currentColor" d="M382 297v-17h8l6 12c3 6 6 12 6 12s3-5 6-12l6-12h8v34h-7l-.2-21-11 20-5 .2-11-21-.2 21h-7z"/>
        {/* M 2 */}
        <path fill="currentColor" d="M332 297v-17h8l6 12c3 6 6 12 6 12s3-5 6-12l6-12h8v34h-7l-.2-21-11 20-5 .2-11-21-.2 21h-7z"/>
        {/* I */}
        <path fill="currentColor" d="M303 314c-8-1-12-5-13-11-.2-1-.3-7-.3-13l-.002-11h8l.002 11c.001 7 .1 11 .3 12 .5 2 2 4 4 4 1 .4 2 .6 5 .6 4 0 6-.5 7-2 2-2 2-3 2-15v-11h8l-.002 11c-.001 6-.1 12-.3 13-.9 5-4 9-10 10-2 .5-9 .9-11 .6z"/>
        {/* T */}
        <path fill="currentColor" d="M257 314c-3-.5-6-2-8-3-2-1-6-5-6-5 0-.2 1-2 3-3l3-3 2 2c4 4 9 5 15 5 5-.3 8-2 9-4 .8-2 .8-3-.02-4-1-2-3-3-12-5-9-2-12-3-15-6-2-2-3-4-3-8 .3-6 3-10 10-12 8-3 20-1 27 3l.7.5-2 3c-1 2-2 3-2 3-.05.05-1-.5-2-1-4-3-7-3-13-3-3 .1-4 .3-5 .9-4 2-5 5-3 8 .9 1 3 2 10 4 10 2 13 3 16 6 2 2 3 4 3 8-.01 4-.8 6-3 8-2 2-5 3-8 4-3 .7-12 .9-15 .3z"/>
      </g>

      {/* Mountain Icon */}
      <path 
        id="mountain"
        className={animate ? 'animate-fade-in hover:scale-105 transition-transform duration-300' : ''}
        style={{ animationDelay: animate ? '0.9s' : '0s' }}
        fill="currentColor"
        d="M88 262l60-60 43 43 103-103 52 52 8-9c4-5 11-13 16-17s11-13 15-17l8-9 2 2c.8.9 3 3 4 5s4 4 5 6c3 3 14 16 30 33 6 6 11 13 13 14 4 5 13 14 13 15 .06.2-3 .3-8 .3h-8l-6-7c-3-4-6-7-6-7-.2-.2-13-14-15-16-1-1-5-6-10-11s-9-10-11-12c-1-2-3-3-3-3-.2.09-3 3-12 14-2 3-8 9-12 13-11 12-13 14-13 15 0 .1 2 3 5 5l5 5-1 .2c-.6.09-2 .3-3 .4-2 .2-10 2-11 3-.5.3-4-3-29-28l-28-28-121 121 1 2c5 9 15 17 30 23 13 6 28 10 48 14 3 .6 6 1 6 1 .08.08-22 .2-49 .2h-49l-1-2c-3-4-6-9-8-14l-.8-2-18 18h-10c-5 0-10-.1-10-.2s8-8 18-18l18-18 .7-3c.8-3 4-9 6-13 4-6 10-13 16-18 2-1 3-3 3-3 .2-.2-28-28-28-28-.1 0-23 23-51 50l-50 50h-19z"
      />

      {/* Summit accent */}
      <path 
        id="summit-accent"
        className={animate ? 'animate-fade-in' : ''}
        style={{ animationDelay: animate ? '1.2s' : '0s' }}
        fill="currentColor"
        d="M179 253l-2-2-.6.7c-1 2-3 5-4 8-2 6-2 6 4 .5l5-5z"
      />
    </svg>
  );
};

export default SummitLogo;
