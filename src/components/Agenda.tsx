
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';

const Agenda = () => {
  const [openDay, setOpenDay] = useState<string | null>(null);

  const toggleDay = (day: string) => {
    setOpenDay(openDay === day ? null : day);
  };

  return (
    <section id="agenda" className="py-12 bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-biondi font-bold text-primary mb-4 leading-tight">
            Event Agenda
          </h2>
          <p className="text-lg sm:text-xl text-gray-600">Two days packed with learning, networking, and celebration</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Day 1 */}
          <Collapsible open={openDay === 'day1'} onOpenChange={() => toggleDay('day1')}>
            <Card className="border-2 border-primary/10 hover:border-primary/30 transition-colors">
              <CollapsibleTrigger className="w-full">
                <CardHeader className={`flex flex-row items-center justify-between ${openDay === 'day1' ? 'bg-primary text-white' : 'bg-white text-primary'} transition-colors px-4 sm:px-6`}>
                  <CardTitle className="text-lg sm:text-2xl font-biondi font-semibold">Day 1 – Thursday, December 11</CardTitle>
                  <ChevronDown className={`h-6 w-6 transition-transform duration-300 flex-shrink-0 ml-2 ${openDay === 'day1' ? 'rotate-180 text-white' : 'text-primary'}`} />
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent className="transition-all duration-300 ease-in-out overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                <CardContent className="bg-white py-6 px-4 sm:px-6">
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-primary mb-2 font-biondi">CE Sessions</h4>
                      <p className="text-gray-700 text-lg">Educational sessions led by the Alcan team and exciting guest speakers</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-primary mb-2 font-biondi">Sunset Cocktail Hour</h4>
                      <p className="text-gray-700 text-lg">Network and unwind with colleagues as the sun sets over Austin</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-primary mb-2 font-biondi">Headshot Lounge</h4>
                      <p className="text-gray-700 text-lg">Professional headshot sessions, so glam up!</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-primary mb-2 font-biondi">Free Evening in Austin</h4>
                      <p className="text-gray-700 text-lg">Explore the vibrant Austin scene at your own pace</p>
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Day 2 */}
          <Collapsible open={openDay === 'day2'} onOpenChange={() => toggleDay('day2')}>
            <Card className="border-2 border-primary/10 hover:border-primary/30 transition-colors">
              <CollapsibleTrigger className="w-full">
                <CardHeader className={`flex flex-row items-center justify-between ${openDay === 'day2' ? 'bg-primary text-white' : 'bg-white text-primary'} transition-colors px-4 sm:px-6`}>
                  <CardTitle className="text-lg sm:text-2xl font-biondi font-semibold">Day 2 – Friday, December 12</CardTitle>
                  <ChevronDown className={`h-6 w-6 transition-transform duration-300 flex-shrink-0 ml-2 ${openDay === 'day2' ? 'rotate-180 text-white' : 'text-primary'}`} />
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent className="transition-all duration-300 ease-in-out overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                <CardContent className="bg-white py-6 px-4 sm:px-6">
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-primary mb-2 font-biondi">Culture-Focused Sessions</h4>
                      <p className="text-gray-700 text-lg">Deep dive into building and maintaining exceptional practice culture</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-primary mb-2 font-biondi">Energizing Keynotes</h4>
                      <p className="text-gray-700 text-lg">Inspiring presentations to motivate and energize your team</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-primary mb-2 font-biondi">Team Dinner Celebration</h4>
                      <p className="text-gray-700 text-lg">Celebrate this year's achievements and connections with a memorable dinner</p>
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        </div>
      </div>
    </section>
  );
};

export default Agenda;
