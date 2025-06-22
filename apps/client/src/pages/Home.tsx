import FadeEffect from '../components/UI/FadeEffect.tsx';
import CallToAction from '../components/Landing/CallToAction.tsx';
import Features from '../components/Landing/Features.tsx'
import Efficiency from '../components/Landing/Efficiency.tsx'
import StartTrial from '../components/Landing/StartTrial.tsx'

const Home = () => {
  return (
    <>


      <FadeEffect duration={1}><CallToAction/></FadeEffect>

      <FadeEffect duration={1}><Features/></FadeEffect>

      <FadeEffect duration={1}><Efficiency/></FadeEffect>

      <FadeEffect duration={1}><StartTrial/></FadeEffect>

    </>
  );
};

export default Home;
