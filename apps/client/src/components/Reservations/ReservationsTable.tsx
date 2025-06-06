//buscador
//filtro: pendientes, confirmadas, canceladas
//boton nueva reserva
//card de info de la reserva
//quizas un grafico con info (no es necesario)
import Toast from "../UI/Toast";
import { useState } from "react";
import ReservationCard from "./ReservationCard";

const ReservationsTable = () => {

    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [toastType, setToastType] = useState<"success" | "error" | "info">("info");

    // Function to show toast messages
    const showOrderActionToast = (message: string, type: "success" | "error" | "info") => {
        setToastMessage(message);
        setToastType(type);
    };

    return(
        <div>
            {/*el resto de los  elementos */}
                {toastMessage && (
                        <Toast
                            message={toastMessage}
                            type={toastType}
                            onClose={() => setToastMessage(null)}
                        />
                )}


            {/*renderiza cards de reservas */}
            <div  className=" font-raleway flex flex-col lg:px-10 lg:py-0  py-10 px-0">
                <ReservationCard showOrderActionToast={showOrderActionToast}/>
            </div>
        </div>
    );
};

export default ReservationsTable;