import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';          // shadcn tailwind-merge helper

interface Activity {
  title: string;
  description: string;
}

interface AgendaDay {
  id: string;
  title: string;
  date: string;
  activities: Activity[];
}

const agendaData: AgendaDay[] = [
  {
    id: 'day1',
    title: 'Day 1',
    date: 'Thursday, December 11',
    activities: [
      { title: 'CE Sessions',            description: 'Educational sessions led by the Alcan team and exciting guest speakers.' },
      { title: 'Sunset Cocktail Hour',   description: 'Network and unwind with colleagues as the sun sets over Austin.' },
      { title: 'Headshot Lounge',        description: 'Professional headshot sessions — glam up!' },
      { title: 'Free Evening in Austin', description: 'Explore the vibrant Austin scene at your own pace.' }
    ]
  },
  {
    id: 'day2',
    title: 'Day 2',
    date: 'Friday, December 12',
    activities: [
      { title: 'Culture-Focused Sessions', description: 'Deep-dive into building and maintaining exceptional practice culture.' },
      { title: 'Energizing Keynotes',      description: 'Inspiring presentations to motivate and energize your team.' },
      { title: 'Team Dinner Celebration',  description: 'Toast this year’s achievements with a memorable dinner.' }
    ]
  }
];

const Agenda = () => {
  const [openDay, setOpenDay] = useState<string | null>(null);

  const toggleDay = (dayId: string) => setOpenDay(prev => (prev === dayId ? null : dayId));

  return (
    <section id="agenda" className="py-12 bg-white">
      <div className="container">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-biondi font-bold text-primary mb-4 leading-tight">
            Event Agenda
          </h2>
          <p className="text-lg sm:text-xl text-gray-600">
            Two days packed with learning, networking, and celebration
          </p>
        </div>

        {/* Accordion */}
        <div className="max-w-4xl mx-auto space-y-6">
          {agendaData.map(day => (
            <Collapsible key={day.id} open={openDay === day.id} onOpenChange={() => toggleDay(day.id)}>
              <Card className="border-2 border-primary/10 hover:border-primary/30 transition-colors">
                {/* Trigger */}
                <CollapsibleTrigger asChild>
                  <button
                    className={cn(
                      'w-full flex items-center justify-between px-4 sm:px-6 py-4',
                      openDay === day.id ? 'bg-primary text-white' : 'bg-white text-primary'
                    )}
                  >
                    <CardHeader className="p-0">
                      <CardTitle className="text-lg sm:text-2xl font-biondi font-semibold">
                        {day.title} – {day.date}
                      </CardTitle>
                    </CardHeader>
                    <ChevronDown
                      className={cn(
                        'h-6 w-6 flex-shrink-0 transition-transform duration-300',
                        openDay === day.id ? 'rotate-180' : ''
                      )}
                    />
                  </button>
                </CollapsibleTrigger>

                {/* Content */}
                <CollapsibleContent className="overflow-hidden transition-all duration-300 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                  <CardContent className="bg-white py-6 px-4 sm:px-6">
                    <div className="space-y-4">
                      {day.activities.map((activity, idx) => (
                        <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-primary mb-2 font-biondi">
                            {activity.title}
                          </h4>
                          <p className="text-gray-700 text-lg">{activity.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Agenda;
