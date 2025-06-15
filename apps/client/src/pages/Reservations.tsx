import FadeEffect from "../components/UI/FadeEffect";
import Title from "../components/Reservations/Title";
import ReservationsTable from "../components/Reservations/ReservationsTable";


const Reservations = () =>{
    return(
        <FadeEffect duration={1}>

            <div className="w-full bg-eggshell-whitedove py-8 px-4">

                <div className="max-w-screen-2xl mx-auto">

                    <Title/>
                    <ReservationsTable/>

                </div>

            </div>

        </FadeEffect>
    );
};

export default Reservations;