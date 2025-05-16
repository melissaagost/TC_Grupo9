
import Mesas from "../components/Tables/Mesas"
import FadeEffect from "../components/UI/FadeEffect";

const Tables = () => {


  return (

    <div className="w-full bg-eggshell-whitedove  py-8 px-4">

      <FadeEffect duration={1}>
        <div className="max-w-screen-2xl min-h-screen mx-auto">
            <Mesas/>
        </div>
      </FadeEffect>

    </div>

  );

};

export default Tables;
