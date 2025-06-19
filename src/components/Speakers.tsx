

import { Card, CardContent } from '@/components/ui/card';

const Speakers = () => {
  const speakers = [
    { name: 'Laura Maly',  title: 'Co-Founder, Wonderist',                        image: '/lovable-uploads/47baf016-75e9-403b-a5ee-bab4709def31.png' },
    { name: 'Dr. Barry Oulton', title: 'Dental Coach, UK',                         image: '/lovable-uploads/aff85297-abd8-4c3b-9c22-f63c8349e76a.png' },
    { name: 'Dr. Kasey Stark', title: 'Co-Founder, Kids Tooth Team Michigan',      image: '/lovable-uploads/4f473ff7-c1eb-4ee2-b65d-eb35eaa2e7be.png' },
    { name: 'Johno Oberly',    title: 'Director of Training, Alcan',               image: '/lovable-uploads/762fc73a-5c3d-466a-a8ae-71ba61269381.png' },
    { name: 'Dr. Alex Otto',   title: 'Co-Founder, Alcan',                         image: '/lovable-uploads/5a2076b1-3dc8-4a01-a5e2-db5b762eb990.png' },
    { name: 'Tim Otto',        title: 'Co-Founder, Alcan',                         image: '/lovable-uploads/ebfdffb3-51f1-4d6f-8f18-5ae91b2cf50c.png' },
    { name: 'Ryan Jones',      title: 'Financial Advisor, Raymond James',          image: '/lovable-uploads/829ddd51-7341-483a-bf9d-ce0f13e489e8.png' }
  ];

  return (
    <section id="speakers" className="py-12 bg-gray-50">
      <div className="container">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-biondi font-bold text-primary mb-4 leading-tight">
            Featured Speakers
          </h2>
          <p className="text-lg sm:text-xl text-gray-600">
            Learn from industry leaders and Alcan experts
          </p>
        </div>

        {/* Speaker grid */}
        <div className="flex justify-center">
          <div className="
            grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 
            auto-rows-fr gap-8 max-w-6xl w-full
          ">
            {speakers.map((sp) => (
              <Card
                key={sp.name}
                className="
                  flex flex-col h-full
                  transition-all duration-300 hover:shadow-[0_6px_12px_rgba(0,0,0,0.08)]
                  rounded-xl bg-white border border-black/[0.04]
                "
              >
                <CardContent className="flex flex-col items-center text-center p-6">
                  <div className="w-32 h-32 sm:w-36 sm:h-36 mb-4 rounded-full overflow-hidden">
                    <img
                      src={sp.image}
                      alt={sp.name}
                      loading="lazy"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <h3 className="text-xl font-biondi text-primary mb-2 leading-tight">
                    {sp.name}
                  </h3>
                  <p className="text-base text-gray-600 leading-tight">
                    {sp.title}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Speakers;

