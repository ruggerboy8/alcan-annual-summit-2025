
import { Card, CardContent } from '@/components/ui/card';

const Speakers = () => {
  const speakers = [
    { name: 'Laura Maly', title: 'Practice Excellence Specialist' },
    { name: 'Dr. Barry Oulton', title: 'Clinical Director' },
    { name: 'Dr. Kasey Stark', title: 'Innovative Dentistry Expert' },
    { name: 'Johno Oberly', title: 'Leadership Development Coach' },
    { name: 'Dr. Alex Otto', title: 'Advanced Procedures Specialist' },
    { name: 'Tim Otto', title: 'Practice Management Consultant' },
    { name: 'Ryan Jones', title: 'Technology Integration Expert' }
  ];

  return (
    <section id="speakers" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-navy mb-4">
            Featured Speakers
          </h2>
          <p className="text-xl text-gray-600">Learn from industry leaders and Alcan experts</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {speakers.map((speaker, index) => (
            <Card key={speaker.name} className="text-center hover:shadow-lg transition-shadow group">
              <CardContent className="p-6">
                <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-navy to-teal rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
                  <div className="text-white text-4xl font-bold">
                    {speaker.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-navy mb-2">{speaker.name}</h3>
                <p className="text-gray-600">{speaker.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Speakers;
