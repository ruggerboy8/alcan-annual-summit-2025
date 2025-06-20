
import SpeakerFlipCard from '@/components/SpeakerFlipCard';

const speakers = [
  { 
    name: 'Laura Maly',  
    title: 'Co-Founder, Wonderist',                        
    image: '/lovable-uploads/47baf016-75e9-403b-a5ee-bab4709def31.png',
    bio: 'Laura Maly launched Wonderist from a spare bedroom with two laptops, a rescue dog, and a belief that dentists deserve marketing partners who actually get dentistry. Eleven years later she captains a 57-person, Inc. 5000-ranked team in sunny San Diego, equal parts creative studio and culture lab (yes, the ping-pong table is real). Under Laura\'s "people first, patients second, ping-pong third" mantra, Wonderist has earned four straight "Best Places to Work" awards while guiding hundreds of practices toward record-breaking new-patient flow—and she loves handing dentists the playbook on stage.'
  },
  { 
    name: 'Dr. Barry Oulton', 
    title: 'Dental Coach, UK',                         
    image: '/lovable-uploads/aff85297-abd8-4c3b-9c22-f63c8349e76a.png',
    bio: 'For nearly a quarter-century Barry Oulton steered his award-winning Surrey practice while obsessing over one thing: conversations that turn patients into raving fans. Today he coaches full-time, teaching dentists how finely tuned communication and simple repeatable systems can double private revenue without adding extra treatment rooms. A keynote favourite for Septodont, SOE, Henry Schein and Bupa, Barry blends science-backed behaviour psychology with cheeky British humour, proving that warmer words and clearer choices build healthier smiles and healthier bottom lines.'
  },
  { 
    name: 'Dr. Kasey Stark', 
    title: 'Co-Founder, Kids Tooth Team Michigan',      
    image: '/lovable-uploads/4f473ff7-c1eb-4ee2-b65d-eb35eaa2e7be.png',
    bio: 'Michigan-raised, Alaska-shaped and now happily rooted in Lake Orion, Dr. Kasey Stark personifies adventurous pediatric care. A seven-year accelerated DDS, two-year NYU Langone pediatric residency, and faculty stint with Alaska\'s cleft-lip program gave her clinical depth—and frostbite stories. Today she co-leads Kids Tooth Team\'s first Midwest location, teaching hospital residents by day and chasing daughter Penny (and 180-lb mastiff Lebowski) by weekend. Whether carving ski slopes or caries, Dr. Kasey\'s mission stays the same: deliver fearless, family-centered dentistry that makes every kid grin wider than the Upper Peninsula.'
  },
  { 
    name: 'Johno Oberly',    
    title: 'Director of Training, Alcan',               
    image: '/lovable-uploads/762fc73a-5c3d-466a-a8ae-71ba61269381.png',
    bio: 'After fifteen years designing student-centric programs—from classroom pilots to state-level policy initiatives—Johno Oberly pivoted his passion for transformative learning into dentistry. At Alcan he builds training that flexes like a great lesson plan: data-driven, human-focused, and refreshingly jargon-free. Johno believes every team member craves two things—recognition of their innate goodness and a platform to extend that goodness to others—and he structures curricula accordingly. Off hours you\'ll find him tinkering with workflow apps, coaching youth soccer, or hunting the perfect cortado.'
  },
  { 
    name: 'Dr. Alex Otto',   
    title: 'Co-Founder, Alcan',                         
    image: '/lovable-uploads/5a2076b1-3dc8-4a01-a5e2-db5b762eb990.png',
    bio: 'Named one of the ADA\'s "Top 10 Under 10," Dr. Alex Otto mixes clinical talent, legislative savvy and big-hearted activism. A VCU DDS, Denver GPR grad, and Alaska-trained pediatric specialist, she now anchors Kids Tooth Team in Texas while holding leadership seats at the ADA, TDA and Texas Academy of Pediatric Dentistry. Her proudest line item? A nonprofit mobile clinic that has already delivered $200-plus K in free care to underserved kids. From Capitol Hill testimony to cartoon-themed operatories, Dr. Otto keeps one promise: every child deserves a champion in their corner.'
  },
  { 
    name: 'Tim Otto',        
    title: 'Co-Founder, Alcan',                         
    image: '/lovable-uploads/ebfdffb3-51f1-4d6f-8f18-5ae91b2cf50c.png',
    bio: 'Tim Otto wrote his first business plan before he could legally rent a car, sold his first start-up at 25, and hasn\'t stopped building since. A magna-cum-laude finance grad with an International MBA, Tim spent a decade steering Fortune 500 sales teams before co-founding Alcan alongside wife Dr. Alex. He now architects the cooperative\'s growth strategy—merging Silicon-Valley agility with Main-Street empathy—and still finds time to mentor young entrepreneurs. Ask Tim about EBITDA and he\'ll light up; ask him about Taco Tuesday and you\'ll get a 12-slide deck.'
  },
  { 
    name: 'Ryan Jones',      
    title: 'Financial Advisor, Raymond James',          
    image: '/lovable-uploads/829ddd51-7341-483a-bf9d-ce0f13e489e8.png',
    bio: 'Ryan Jones translates high-stakes financial puzzles into plain-English roadmaps that help clinicians sleep better at night. A CERTIFIED FINANCIAL PLANNER™ professional and former Rotary president, Ryan guides dentists from first practice acquisition through succession using Raymond James\' Goal Planning & Monitoring platform. His fiduciary oath—integrity, objectivity, diligence—shows up in every quarterly review, while his Colorado roots show up on the golf course. When he\'s not plotting retirement glide paths, Ryan is exploring trails with wife Becky and daughters Addison and Piper, proving balance sheets aren\'t the only things worth balancing.'
  }
];

export default function Speakers() {
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
}
