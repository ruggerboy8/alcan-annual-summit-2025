
import { Card, CardContent } from '@/components/ui/card';

const Speakers = () => {
  const speakers = [
    { 
      name: 'Laura Maly', 
      title: 'Co-Founder, Wonderist',
      image: '/lovable-uploads/b0dfb997-9c2e-4c85-9ab7-8eb1fc6aa663.png'
    },
    { 
      name: 'Dr. Barry Oulton', 
      title: 'Dental Coach, UK',
      image: '/lovable-uploads/1e76889c-e595-435d-8b3b-a8abb49601eb.png'
    },
    { 
      name: 'Dr. Kasey Stark', 
      title: 'Co-Founder, Kids Tooth Team Michigan',
      image: '/lovable-uploads/65f0bfee-b259-4915-97db-6d52e4cc3b9c.png'
    },
    { 
      name: 'Johno Oberly', 
      title: 'Director of Training, Alcan',
      image: '/lovable-uploads/93b5b5cc-6598-45b8-ac06-77371e442e25.png'
    },
    { 
      name: 'Dr. Alex Otto', 
      title: 'Co-Founder, Alcan',
      image: '/lovable-uploads/56d2f9ef-dac7-4337-98c0-396d9b98b458.png'
    },
    { 
      name: 'Tim Otto', 
      title: 'Co-Founder, Alcan',
      image: '/lovable-uploads/ff7a71fa-80bc-48b2-9d7f-d8d9a319d0ca.png'
    },
    { 
      name: 'Ryan Jones', 
      title: 'Financial Advisor, Raymond James',
      image: '/lovable-uploads/952db68c-78c6-4073-9c46-960cc6a76a60.png'
    }
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
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden group-hover:scale-105 transition-transform">
                  <img 
                    src={speaker.image} 
                    alt={speaker.name}
                    className="w-full h-full object-cover"
                  />
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
