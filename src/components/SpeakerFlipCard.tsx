import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface Speaker {
  name: string;
  title: string;
  image: string;
  bio: string;
}

export default function SpeakerFlipCard({ speaker }: { speaker: Speaker }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <Card
      onClick={() => setFlipped(!flipped)}
      className="flip-card cursor-pointer h-80 rounded-xl bg-white border border-black/5 shadow-sm hover:shadow-lg transition-shadow duration-300"
    >
      <div
        className={`flip-card-inner relative w-full h-full ${
          flipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* ───────── FRONT ───────── */}
        <CardContent className="flip-card-face absolute inset-0 flex flex-col items-center justify-center p-6">
          <div className="w-32 h-32 sm:w-36 sm:h-36 mb-4 rounded-full overflow-hidden">
            <img
              src={speaker.image}
              alt={speaker.name}
              loading="lazy"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <h3 className="text-xl font-biondi text-primary mb-2 leading-tight text-center">
            {speaker.name}
          </h3>
          <p className="text-base text-gray-600 leading-tight text-center">
            {speaker.title}
          </p>
        </CardContent>

        {/* ───────── BACK ───────── */}
        <CardContent
          className="
            flip-card-face absolute inset-0 flex flex-col items-center justify-start
            bg-primary text-white p-6 rounded-xl rotate-y-180
          "
        >
          <h3 className="text-xl font-biondi mb-4 text-center">{speaker.name}</h3>

          {/* Scrollable bio only */}
          <div className="overflow-y-auto pr-1 max-h-[65%] w-full">
            <p className="text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {speaker.bio}
            </p>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}