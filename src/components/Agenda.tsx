import { Mountain } from 'lucide-react';

/**
 * 2025 agenda — preserved for restoration once 2026 schedule is finalized.
 */
// const agendaData = [
//   {
//     id: 'day1', title: 'Day 1', date: 'Thursday, December 11',
//     activities: [
//       { title: 'CE Sessions', description: 'Educational sessions led by the Alcan team and exciting guest speakers.' },
//       { title: 'Sunset Cocktail Hour', description: 'Network and unwind with colleagues as the sun sets over Austin.' },
//       { title: 'Headshot Lounge', description: 'Professional headshot sessions — glam up!' },
//       { title: 'Free Evening in Austin', description: 'Explore the vibrant Austin scene at your own pace.' },
//     ],
//   },
//   {
//     id: 'day2', title: 'Day 2', date: 'Friday, December 12',
//     activities: [
//       { title: 'Culture-Focused Sessions', description: 'Deep-dive into building and maintaining exceptional practice culture.' },
//       { title: 'Energizing Keynotes', description: 'Inspiring presentations to motivate and energize your team.' },
//       { title: 'Team Dinner Celebration', description: 'Toast this year\u2019s achievements with a memorable dinner.' },
//     ],
//   },
// ];

const Agenda = () => {
  return (
    <section id="agenda" className="py-16 bg-white sm:py-20">
      <div className="container">
        {/* Heading */}
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-biondi font-bold text-primary mb-4 leading-tight">
            Event Agenda
          </h2>
          <p className="text-lg sm:text-xl text-foreground/70">
            Two days packed with learning, networking, and celebration
          </p>
        </div>

        {/* Coming soon card */}
        <div className="max-w-3xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl border-2 border-primary/15 bg-gradient-to-br from-white via-gray-50 to-white p-10 text-center shadow-lg sm:p-14">
            {/* decorative top accent */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent" />

            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Mountain className="h-8 w-8 text-primary" strokeWidth={1.5} />
            </div>

            <div className="mx-auto mb-4 h-px w-16 bg-accent/60" />

            <h3 className="font-biondi text-2xl font-semibold text-primary sm:text-3xl">
              The 2026 agenda is taking shape
            </h3>
            <p className="mx-auto mt-4 max-w-xl text-base text-foreground/70 sm:text-lg">
              Two days. Sharper skills. Deeper friendships. New altitudes.
              Full agenda dropping soon.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Agenda;
