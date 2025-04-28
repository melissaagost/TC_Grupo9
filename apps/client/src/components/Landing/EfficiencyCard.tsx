import { useEffect, useState } from "react";

const EfficiencyCard = () => {

    const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div

      className={`relative mx-auto w-full max-w-sm md:max-w-md lg:max-w-lg transition-all duration-700 ease-out
      ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>

      {/* shadow*/}
      <div className="absolute inset-0 rounded-lg bg-gold-400 translate-x-3 translate-y-3 md:translate-x-4 md:translate-y-4"></div>

      {/* pic */}
      <div className="relative rounded-lg overflow-hidden shadow-lg"> {/*agregar aspect-[4/3] si la imagen es grande */}

        <img
          src="/assets/img/efficiencycard2.jpg"
          alt="Restaurant"
          className="w-full h-full object-cover rounded-lg"
        />

      </div>

    </div>
  );

};

export default EfficiencyCard;
