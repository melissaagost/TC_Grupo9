import ReservationCard from "./ReservationCard";
import { ArrowRight } from "lucide-react";

const CallToAction = () => {
    return (

    <section
      className="bg-cover bg-center bg-no-repeat  "
      style={{ backgroundImage: "url('/your-background.jpg')" }}>

      <div className="bg-blood-500 bg-opacity-70 py-16 px-8 ">

        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-12">


          {/* Left content */}
          <div className="text-white max-w-xl space-y-6">

            <h2 className="text-4xl md:text-5xl font-playfair font-bold leading-tight">
              Elevate Your Restaurant Management
            </h2>

            <p className="text-lg font-raleway">
              Simplify reservations, streamline menu management, and enhance customer relationships with our all-in-one restaurant management platform.
            </p>

            <div className="flex gap-4">
              <button className="bg-gold-golden text-white px-6 py-3 rounded-md font-semibold flex items-center gap-2 hover:bg-gold-300 transition-colors">
                Get Started <ArrowRight size={16} />
              </button>
              <button className="bg-white text-blood-500 px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors">
                Learn More
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