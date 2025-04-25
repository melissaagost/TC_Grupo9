import LandingLayout from '../layouts/Landing';
import Hero from '../components/Landing/Hero';
import Features from '../components/Landing/Features.tsx';
import CallToAction from '../components/Landing/CallToAction.tsx';

const Home = () => {
  return (
    <LandingLayout>
      <CallToAction/>
      <Hero />
      <Features />
    </LandingLayout>
  );
};

export default Home;
