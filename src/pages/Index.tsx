
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import CountdownTimer from '@/components/CountdownTimer';
import About from '@/components/About';
import Lineup from '@/components/Lineup';
import Travel from '@/components/Travel';
import Register from '@/components/Register';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <CountdownTimer />
      <About />
      <Lineup />
      <Travel />
      <Register />
      <Footer />
    </div>
  );
};

export default Index;
