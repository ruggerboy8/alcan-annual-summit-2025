
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
              Every ascent starts with a single step—and with the right partners on the rope.
            </p>

            <p className="text-lg sm:text-xl text-text leading-relaxed mb-5">
              Over two powerful days we'll climb together through:
            </p>

            <ul className="space-y-4 text-lg sm:text-xl text-text leading-relaxed mb-8 list-none">
              <li className="flex">
                <span className="text-primary mr-3 font-bold">•</span>
                <span><strong>Skill pitches</strong> – fast-paced CE sessions that add real altitude to your craft.</span>
              </li>
              <li className="flex">
                <span className="text-primary mr-3 font-bold">•</span>
                <span><strong>Roped-in round-tables</strong> – cross-practice huddles where we solve for tomorrow, today.</span>
              </li>
              <li className="flex">
                <span className="text-primary mr-3 font-bold">•</span>
                <span><strong>Base-camp celebrations</strong> – nightly socials that refuel relationships (and appetites).</span>
              </li>
            </ul>

            <p className="text-lg sm:text-xl text-text leading-relaxed mb-10">
              By the time we plant our flag in Austin's hill country, you'll head home with fresh tools, deeper bonds, and a renewed view from the top.
            </p>

            {/* CTA */}
            <div className="flex justify-center">
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
