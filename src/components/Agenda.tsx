
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';

const Agenda = () => {
  const [openDay1, setOpenDay1] = useState(false);
  const [openDay2, setOpenDay2] = useState(false);

  return (
    <section id="agenda" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-navy mb-4">
            Event Agenda
          </h2>
          <p className="text-xl text-gray-600">Two days packed with learning, networking, and celebration</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Day 1 */}
          <Collapsible open={openDay1} onOpenChange={setOpenDay1}>
            <Card className="border-2 border-navy/10 hover:border-navy/30 transition-colors">
              <CollapsibleTrigger className="w-full">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-2xl text-navy">Day 1 – Thursday, December 11</CardTitle>
                  <ChevronDown className={`h-6 w-6 text-navy transition-transform ${openDay1 ? 'rotate-180' : ''}`} />
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-teal/10 p-4 rounded-lg">
                      <h4 className="font-semibold text-navy mb-2">CE Sessions</h4>
                      <p className="text-gray-700">Continuing education sessions led by Alcan doctors and guest speakers</p>
                    </div>
                    <div className="bg-teal/10 p-4 rounded-lg">
                      <h4 className="font-semibold text-navy mb-2">Sunset Cocktail Hour</h4>
                      <p className="text-gray-700">Network and unwind with colleagues as the sun sets over Austin</p>
                    </div>
                    <div className="bg-teal/10 p-4 rounded-lg">
                      <h4 className="font-semibold text-navy mb-2">Headshot Lounge</h4>
                      <p className="text-gray-700">Professional headshot sessions for your practice needs</p>
                    </div>
                    <div className="bg-teal/10 p-4 rounded-lg">
                      <h4 className="font-semibold text-navy mb-2">Free Evening in Austin</h4>
                      <p className="text-gray-700">Explore the vibrant Austin scene at your own pace</p>
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Day 2 */}
          <Collapsible open={openDay2} onOpenChange={setOpenDay2}>
            <Card className="border-2 border-navy/10 hover:border-navy/30 transition-colors">
              <CollapsibleTrigger className="w-full">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-2xl text-navy">Day 2 – Friday, December 12</CardTitle>
                  <ChevronDown className={`h-6 w-6 text-navy transition-transform ${openDay2 ? 'rotate-180' : ''}`} />
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-navy/10 p-4 rounded-lg">
                      <h4 className="font-semibold text-navy mb-2">Culture-Focused Sessions</h4>
                      <p className="text-gray-700">Deep dive into building and maintaining exceptional practice culture</p>
                    </div>
                    <div className="bg-navy/10 p-4 rounded-lg">
                      <h4 className="font-semibold text-navy mb-2">Energizing Keynotes</h4>
                      <p className="text-gray-700">Inspiring presentations to motivate and energize your team</p>
                    </div>
                    <div className="bg-navy/10 p-4 rounded-lg">
                      <h4 className="font-semibold text-navy mb-2">Team Dinner Celebration</h4>
                      <p className="text-gray-700">Celebrate our achievements and connections with a memorable dinner</p>
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
