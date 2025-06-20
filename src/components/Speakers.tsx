
import SpeakerFlipCard from '@/components/SpeakerFlipCard';

const Speakers = () => {
  const speakers = [
    { 
      name: 'Laura Maly',  
      title: 'Co-Founder, Wonderist',                        
      image: '/lovable-uploads/47baf016-75e9-403b-a5ee-bab4709def31.png',
      bio: 'Laura Maly launched Wonderist from a spare bedroom with two laptops, a rescue dog, and a belief that dentists deserve marketing partners who actually get dentistry. Eleven years later she captains a 57-person, Inc. 5000-ranked team in sunny San Diego.'
    },
    { 
      name: 'Dr. Barry Oulton', 
      title: 'Dental Coach, UK',                         
      image: '/lovable-uploads/aff85297-abd8-4c3b-9c22-f63c8349e76a.png',
      bio: 'Dr. Barry Oulton is a renowned dental coach from the UK with decades of experience helping dental practices achieve excellence. His innovative coaching methods have transformed practices across the globe.'
    },
    { 
      name: 'Dr. Kasey Stark', 
      title: 'Co-Founder, Kids Tooth Team Michigan',      
      image: '/lovable-uploads/4f473ff7-c1eb-4ee2-b65d-eb35eaa2e7be.png',
      bio: 'Dr. Kasey Stark co-founded Kids Tooth Team Michigan and has dedicated her career to pediatric dentistry. She is passionate about creating positive dental experiences for children and families.'
    },
    { 
      name: 'Johno Oberly',    
      title: 'Director of Training, Alcan',               
      image: '/lovable-uploads/762fc73a-5c3d-466a-a8ae-71ba61269381.png',
      bio: 'Johno Oberly leads training initiatives at Alcan, bringing innovative educational approaches to dental practice management. His expertise helps practices maximize their potential through strategic training programs.'
    },
    { 
      name: 'Dr. Alex Otto',   
      title: 'Co-Founder, Alcan',                         
      image: '/lovable-uploads/5a2076b1-3dc8-4a01-a5e2-db5b762eb990.png',
      bio: 'Dr. Alex Otto co-founded Alcan with a vision to revolutionize dental practice management. His clinical background combined with business acumen has helped shape the future of dental practice operations.'
    },
    { 
      name: 'Tim Otto',        
      title: 'Co-Founder, Alcan',                         
      image: '/lovable-uploads/ebfdffb3-51f1-4d6f-8f18-5ae91b2cf50c.png',
      bio: 'Tim Otto co-founded Alcan and brings extensive business expertise to the dental industry. His strategic vision and leadership have been instrumental in Alcan\'s growth and success.'
    },
    { 
      name: 'Ryan Jones',      
      title: 'Financial Advisor, Raymond James',          
      image: '/lovable-uploads/829ddd51-7341-483a-bf9d-ce0f13e489e8.png',
      bio: 'Ryan Jones is a financial advisor at Raymond James specializing in helping dental professionals achieve their financial goals. His expertise in practice valuation and retirement planning is invaluable to dental practice owners.'
    }
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
              <SpeakerFlipCard key={sp.name} speaker={sp} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Speakers;
