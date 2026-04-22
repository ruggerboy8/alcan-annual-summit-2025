import SpeakerFlipCard from '@/components/SpeakerFlipCard';

/**
 * 2025 speaker lineup — preserved for restoration once 2026 speakers are announced.
 * To restore: re-enable this array and swap the JSX below back to the grid.
 */
// const speakers = [
//   {
//     name: 'Laura Maly',
//     title: 'Co-Founder, Wonderist',
//     image: '/lovable-uploads/47baf016-75e9-403b-a5ee-bab4709def31.png',
//     bio: 'Laura Maly launched Wonderist from a spare bedroom...'
//   },
//   { name: 'Dr. Barry Oulton', title: 'The Confident Dentist, UK', image: '/lovable-uploads/aff85297-abd8-4c3b-9c22-f63c8349e76a.png', bio: '...' },
//   { name: 'Dr. Kasey Stark', title: 'Co-Founder, Kids Tooth Team Michigan', image: '/lovable-uploads/4f473ff7-c1eb-4ee2-b65d-eb35eaa2e7be.png', bio: '...' },
//   { name: 'Johno Oberly', title: 'Director of Training, Alcan', image: '/lovable-uploads/762fc73a-5c3d-466a-a8ae-71ba61269381.png', bio: '...' },
//   { name: 'Dr. Alex Otto', title: 'Co-Founder, Alcan', image: '/lovable-uploads/5a2076b1-3dc8-4a01-a5e2-db5b762eb990.png', bio: '...' },
//   { name: 'Tim Otto', title: 'Co-Founder, Alcan', image: '/lovable-uploads/ebfdffb3-51f1-4d6f-8f18-5ae91b2cf50c.png', bio: '...' },
//   { name: 'Ryan Jones', title: 'Financial Advisor, Raymond James', image: '/lovable-uploads/829ddd51-7341-483a-bf9d-ce0f13e489e8.png', bio: '...' },
// ];

// Vimeo hype reel from The Summit 2025
const HYPE_VIDEO_VIMEO_SRC =
  'https://player.vimeo.com/video/1154545041?h=abccca39e0&title=0&byline=0&portrait=0';

// Keep import referenced for future restoration without TS unused warning.
void SpeakerFlipCard;

export default function Speakers() {
  return (
    <section id="speakers" className="py-16 bg-gray-50 sm:py-20">
      <div className="container">
        {/* Heading */}
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-biondi font-bold text-primary mb-4 leading-tight">
            Speakers
          </h2>
          <p className="text-lg sm:text-xl text-foreground/70">
            We're curating an unforgettable lineup. Stay tuned.
          </p>
        </div>

        {/* Hype video frame */}
        <div className="mx-auto max-w-5xl">
          <div className="relative rounded-2xl bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20 p-1 shadow-2xl">
            <div className="relative overflow-hidden rounded-[14px] bg-black" style={{ paddingTop: '56.25%' }}>
              <iframe
                title="The Summit 2025 — Hype Reel"
                src={HYPE_VIDEO_VIMEO_SRC}
                className="absolute inset-0 h-full w-full"
                frameBorder={0}
                referrerPolicy="strict-origin-when-cross-origin"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                allowFullScreen
              />
            </div>
          </div>
          <p className="mt-6 text-center text-sm uppercase tracking-[0.25em] text-primary/70">
            A look back at The Summit 2025
          </p>
        </div>
      </div>
    </section>
  );
}
