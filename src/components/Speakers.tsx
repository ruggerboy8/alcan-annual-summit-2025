import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import { Eyebrow, Reveal } from '@/components/section';

/* ---------------------------------------------------------------------------
   Speaker lineup: a wrapping row of flip cards.

   Front of the card is the headshot with name and title; clicking flips it to
   the bio. Clicking the card again (anywhere on its back), clicking the X,
   clicking outside the grid, or pressing Escape flips it back. Opening one
   card closes whichever was open.

   The back of the card is exactly the size of the front, so bios are edited to
   fit — roughly 75 words. There is no scroll affordance on purpose; if a bio
   overflows, shorten the bio.

   Under prefers-reduced-motion the 3D flip is skipped entirely and the card
   simply swaps faces, matching how Reveal degrades to a plain div.
   --------------------------------------------------------------------------- */

interface Speaker {
  name: string;
  /** Role and organization, shown under the name on the card front. */
  title: string;
  /** Edited to fit the card back — about 75 words. */
  bio: string;
  /** Path under public/, e.g. '/assets/jane-doe.jpg'. Omit while a headshot
      is pending; initials render instead. */
  photo?: string;
}

const SPEAKERS: Speaker[] = [
  {
    name: 'Dr. Alex Otto',
    title: 'Founder, Alcan Dental Cooperative',
    bio: 'A nationally recognized pediatric dentist, speaker, and healthcare executive, Dr. Otto co-founded Kids Tooth Team and the Alcan Dental Cooperative. She serves as Medical Director of Dentistry at Texas Children’s Hospital Austin and President of the Texas Academy of Pediatric Dentistry, and her nonprofit outreach work has donated nearly $1 million in dental care to children in need.',
    photo: '/assets/alex-otto.webp',
  },
  {
    name: 'Tim Otto',
    title: 'Founder, Alcan Dental Cooperative',
    bio: 'Tim has spent his career growing things: startups founded and sold (the first at age 25), national leadership roles inside Fortune 500 companies, and now a family of pediatric dental practices spanning three states. As co-founder of Kids Tooth Team and the Alcan Dental Cooperative, he builds the tools, processes, and partnerships that let independent practices grow without losing what makes them special.',
    photo: '/assets/tim-otto.webp',
  },
  {
    name: 'Johno Oberly',
    title: 'Director of Learning and Development, Alcan Dental Cooperative',
    bio: 'Johno designed curriculum and training for leadership at the Dallas Independent School District and built learning programs adopted by school systems across the country through senior roles at Meteor Education and Leadership ISD. At Alcan he brings that experience to dental teams, on a simple conviction: culture and consistency matter more than content, and great training is regular, human-centered, and built to stick.',
    photo: '/assets/johno-oberly.jpg',
  },
  {
    name: 'Dr. Natalia Chalmers',
    title: 'Chief Dental Officer, Centers for Medicare & Medicaid Services',
    bio: 'The first Chief Dental Officer in the history of the Centers for Medicare & Medicaid Services, Dr. Chalmers brings more than twenty years of clinical, research, industry, and regulatory experience to the national stage. A board-certified pediatric dentist holding a DDS, MHSc, and PhD, she previously served as a Dental Officer at the FDA and now shapes how oral health care reaches millions of children and families.',
    photo: '/assets/natalia-chalmers.jpg',
  },
  {
    name: 'Ryan Hurtado',
    title: 'Consultant, Marsh McLennan',
    bio: 'A consultant at Marsh McLennan with a track record spanning leadership, client management, and organizational development, Ryan is known for turning adversity, professional and deeply personal, into an engine for growth. Drawing on executive experience and hard-won lessons in navigating grief, he gives teams practical frameworks for leading with empathy, connecting authentically, and thriving under pressure, transforming everyday interactions into exceptional human experiences.',
    photo: '/assets/ryan-hurtado.jpg',
  },
  {
    name: 'Tod Moore',
    title: 'Director of HR, Atomic Athlete',
    bio: 'Tod co-founded Atomic Athlete, the Austin training company that grew from thirty athletes and scavenged equipment in a public park into one of the city’s most respected strength communities. Fifteen years of coaching taught him a happy secret: the strongest athletes are the ones who also move well, breathe easy, and stretch more than they planned to. He leads Atomic’s yoga and mobility programming, and yes, there will be breathing.',
    photo: '/assets/tod-moore.jpg',
  },
  {
    name: 'Genevieve Poppe',
    title: 'Founder, Poppe Practice Management',
    bio: 'A nationally recognized dental practice consultant with more than 25 years of experience, Genevieve has held nearly every role a practice has, from dental assistant to multi-location owner. As founder of Poppe Practice Management, she helps teams sharpen leadership, communication, and patient experience, and build systems that drive sustainable growth. Her sessions are interactive, practical, and immediately applicable, sending attendees home with strategies they can use the very next day.',
    photo: '/assets/genevieve-poppe.jpg',
  },
  {
    name: 'Jenn Wooten',
    title: 'Founder, Viasomatic',
    bio: 'Jenn has spent more than twenty years in yoga, somatics, and trauma-informed education, and is the founder of Viasomatic, a science-backed method for restoring resilience through nervous-system-centered care. A certified yoga therapist and nervous system coach, she helps people recognize their patterns of stress and survival and use simple, body-based practices to restore regulation and well-being, at work and everywhere else.',
    photo: '/assets/jenn-wooten.jpg',
  },
];

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

interface SpeakerCardProps {
  speaker: Speaker;
  flipped: boolean;
  onOpen: () => void;
  onClose: () => void;
}

function SpeakerCard({ speaker, flipped, onOpen, onClose }: SpeakerCardProps) {
  const prefersReducedMotion = useReducedMotion();

  const front = (
    <button
      type="button"
      onClick={onOpen}
      aria-expanded={flipped}
      aria-hidden={flipped}
      tabIndex={flipped ? -1 : 0}
      className="flex h-full w-full flex-col overflow-hidden rounded-lg bg-white text-left ring-1 ring-n03 shadow-md transition-shadow duration-300 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal [backface-visibility:hidden]"
    >
      {speaker.photo ? (
        <img
          src={speaker.photo}
          alt={`Headshot of ${speaker.name}`}
          className="aspect-[4/5] w-full object-cover"
        />
      ) : (
        <div className="flex aspect-[4/5] w-full items-center justify-center bg-tint01">
          <span className="font-biondi text-stat font-light text-navy/40">
            {initials(speaker.name)}
          </span>
        </div>
      )}
      <div className="flex flex-1 flex-col justify-between gap-2 p-5">
        <div>
          <h3 className="font-biondi text-display-sm font-bold text-ink">
            {speaker.name}
          </h3>
          <p className="mt-1 text-sm text-ink-soft">{speaker.title}</p>
        </div>
        <p className="font-mono text-eyebrow font-medium uppercase text-teal">
          Read bio +
        </p>
      </div>
    </button>
  );

  const back = (
    <div
      aria-hidden={!flipped}
      onClick={onClose}
      className={[
        'absolute inset-0 flex flex-col overflow-hidden rounded-lg bg-navy p-6 shadow-md',
        flipped ? 'cursor-pointer' : 'pointer-events-none',
        prefersReducedMotion ? '' : '[backface-visibility:hidden] [transform:rotateY(180deg)]',
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-biondi text-lg font-bold leading-snug text-white">
            {speaker.name}
          </h3>
          <p className="mt-0.5 font-mono text-eyebrow font-medium uppercase text-teal-bright">
            {speaker.title}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          tabIndex={flipped ? 0 : -1}
          aria-label={`Close bio of ${speaker.name}`}
          className="-mr-2 -mt-2 rounded-md p-2 text-white/70 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-bright"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-white/85">{speaker.bio}</p>
    </div>
  );

  /* Reduced motion: no 3D at all, just swap which face is shown. */
  if (prefersReducedMotion) {
    return (
      <div className="relative h-full">
        <div className={`h-full ${flipped ? 'invisible' : ''}`}>{front}</div>
        {flipped && back}
      </div>
    );
  }

  return (
    <div className="h-full [perspective:1200px]">
      <div
        className="relative h-full [transform-style:preserve-3d]"
        style={{
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 0.9s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {front}
        {back}
      </div>
    </div>
  );
}

export default function Speakers() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  /* Click anywhere outside the grid, or press Escape, to flip the open card
     back over. Clicks on another card land inside the grid and are handled by
     that card's own button instead. */
  useEffect(() => {
    if (openIndex === null) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!gridRef.current?.contains(event.target as Node)) {
        setOpenIndex(null);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenIndex(null);
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [openIndex]);

  return (
    <div className="mx-auto max-w-6xl px-6 pb-16 sm:px-10 lg:pb-24">
      <Reveal>
        <div className="text-center">
          <Eyebrow className="mb-3">Announced so far</Eyebrow>
        </div>
        <div ref={gridRef} className="mt-8 flex flex-wrap justify-center gap-6">
          {SPEAKERS.map((speaker, index) => (
            <div key={index} className="w-full max-w-xs sm:w-72">
              <SpeakerCard
                speaker={speaker}
                flipped={openIndex === index}
                onOpen={() => setOpenIndex(index)}
                onClose={() => setOpenIndex(null)}
              />
            </div>
          ))}
        </div>
        <p className="mt-10 text-center text-base text-ink-soft">
          More speakers to be announced.
        </p>
      </Reveal>
    </div>
  );
}
