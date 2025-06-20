
import { useState } from 'react';

interface Speaker {
  name: string;
  title: string;
  image: string;
  bio: string;
}

const SpeakerFlipCard = ({ speaker }: { speaker: Speaker }) => {
  const [flipped, setFlipped] = useState(false);

  const innerStyle: React.CSSProperties = {
    transformStyle: 'preserve-3d',
    transition: 'transform 0.6s',
    transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
  };

  return (
    <div
      className="flip-card w-full cursor-pointer h-80"
      onClick={() => setFlipped(!flipped)}
      aria-label={`Toggle bio for ${speaker.name}`}
    >
      <div className="relative w-full h-full rounded-xl" style={innerStyle}>
        {/* Front */}
        <div className="flip-card-face absolute inset-0 flex flex-col items-center justify-center bg-white rounded-xl border border-black/5 p-6 shadow-sm">
          <div className="w-32 h-32 sm:w-36 sm:h-36 mb-4 rounded-full overflow-hidden">
            <img
              src={speaker.image}
              alt={speaker.name}
              loading="lazy"
              className="object-cover object-top w-full h-full"
            />
          </div>
          <h3 className="text-xl font-biondi text-primary mb-2 leading-tight text-center">
            {speaker.name}
          </h3>
          <p className="text-base text-gray-600 leading-tight text-center">{speaker.title}</p>
        </div>

        {/* Back */}
        <div
          className="flip-card-face absolute inset-0 flex flex-col items-center justify-center bg-primary text-white rounded-xl p-6 overflow-y-auto"
          style={{ transform: 'rotateY(180deg)' }}
        >
          <h3 className="text-xl font-biondi mb-4 text-center">{speaker.name}</h3>
          <p className="text-sm sm:text-base leading-relaxed text-center">{speaker.bio}</p>
        </div>
      </div>
    </div>
  );
};

export default SpeakerFlipCard;
