import ReservationCard from "./ReservationCard";
import { ArrowRight } from "lucide-react";

const CallToAction = () => {
    return (

    <section className="bg-cover bg-center bg-no-repeat bg-[url(/assets/img/bg-calltoaction2.jpg)]">

      <div className="bg-blood-500/80  backdrop-opacity-15 py-16 px-40 ">

        <div className="container mx-auto flex flex-col md:flex-row justify-center items-center gap-50">


          {/* Left content */}
          <div className="text-white max-w-xl space-y-6">

            <h2 className="text-6xl md:text-5xl font-playfair font-bold leading-tight">
              Eleva la gestión de tu restaurante
            </h2>

            <p className="text-lg font-raleway">
            Simplifica las reservas, optimiza la gestión del menú y fortaleca las relaciones con los clientes con nuestra plataforma de gestión de restaurantes todo en uno.
            </p>

            <div className="flex gap-4 font-raleway">

                <button className="bg-gold-mustard text-blood-700 font-semibold px-6 py-3 rounded-md flex items-center gap-2 hover:bg-gold-after transition-all duration-300 hover:-translate-y-1 shadow-md">
                  Empieza <ArrowRight size={16} />
                </button>

                <button className="bg-white text-blood-500 px-6 py-3 rounded-md font-semibold hover:bg-gray-300 transition-all duration-300 hover:-translate-y-1 shadow-md">
                  Aprender Más
                </button>

            </div>


          </div>

          {/* Right: Reservation Card */}
          <ReservationCard />


        </div>

      </div>

    </section>

    );
};

export default CallToAction