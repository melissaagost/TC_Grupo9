import LandingLayout from '../layouts/Landing';
import Hero from '../components/Landing/Hero';
import Features from '../components/Landing/Features.tsx';

const Home = () => {
  return (
    <LandingLayout>
      <Hero />
      <Features />
    </LandingLayout>
  );
};

export default Home;
