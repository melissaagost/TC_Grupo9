import LandingLayout from '../layouts/Landing';
import CallToAction from '../components/Landing/CallToAction.tsx';
import Features from '../components/Landing/Features.tsx'
import Efficiency from '../components/Landing/Efficiency.tsx'
import StartTrial from '../components/Landing/StartTrial.tsx'

const Home = () => {
  return (
    <LandingLayout>

      <CallToAction/>

      <Features/>

      <Efficiency/>

      <StartTrial/>

    </LandingLayout>
  );
};

export default Home;
