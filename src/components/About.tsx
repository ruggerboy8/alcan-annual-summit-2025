// components/About.tsx
import ImageCarousel from './ImageCarousel';
import RegisterModal from './RegisterModal';

const About = () => (
  <section id="about" className="py-14 lg:py-20 bg-gray-50">
    <div className="container">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* ── Copy block ───────────────────────────── */}
          <div className="order-2 md:order-1 max-w-[680px]">

            <h2 className="font-biondi font-bold text-primary text-3xl sm:text-4xl md:text-5xl mb-6 leading-tight">
              Why attend&nbsp;The&nbsp;Summit?
            </h2>

            <p className="text-lg sm:text-xl text-text leading-relaxed mb-5">
              Two days built to sharpen your skills, widen your network, and celebrate the work we’re doing together.
            </p>

            <p className="text-lg sm:text-xl text-text leading-relaxed mb-5">
              You can look forward&nbsp;to:
            </p>

            <ul className="space-y-4 text-lg sm:text-xl text-text leading-relaxed mb-8 list-none">
              <li className="flex">
                <span className="text-primary mr-3 font-bold">•</span>
                <span><strong>Focused CE workshops</strong> led by industry experts.</span>
              </li>
              <li className="flex">
                <span className="text-primary mr-3 font-bold">•</span>
                <span><strong>Cross-practice round-tables</strong> where ideas move from concept to roadmap.</span>
              </li>
              <li className="flex">
                <span className="text-primary mr-3 font-bold">•</span>
                <span><strong>Evening gatherings</strong> that build culture and spark new friendships.</span>
              </li>
            </ul>

            <p className="text-lg sm:text-xl text-text leading-relaxed mb-10">
              You’ll head home with fresh tools, stronger partnerships, and a clear view of what’s next.
            </p>

            {/* CTA */}
            <div className="flex">
              <RegisterModal
                buttonClassName="bg-primary hover:bg-primary/90 text-white px-8 sm:px-12 py-4 text-lg sm:text-xl rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 font-biondi font-bold"
              />
            </div>
          </div>

          {/* ── Carousel ────────────────────────────── */}
          <div className="order-1 md:order-2 flex justify-center md:justify-end">
            <div className="w-full max-w-sm sm:max-w-md md:max-w-none md:w-[80%]">
              <ImageCarousel />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default About;