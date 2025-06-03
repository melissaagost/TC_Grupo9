import OrderCard from "./OrderCard";
import Toast from "../UI/Toast";
import { usePermisos } from "../../hooks/usePermisos";
import { useState } from "react";

const OrderTable = () => {
    //  const [open, setOpen] = useState(true);
      const { tienePermiso } = usePermisos();

    // State for toast messages
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [toastType, setToastType] = useState<"success" | "error" | "info">("info");

    // Function to show toast messages
    const showOrderActionToast = (message: string, type: "success" | "error" | "info") => {
        setToastMessage(message);
        setToastType(type);
    };

    return (

        <div  className=" font-raleway flex flex-col lg:px-10 lg:py-0  py-10 px-0">

             {toastMessage && (
                    <Toast
                        message={toastMessage}
                        type={toastType}
                        onClose={() => setToastMessage(null)}
                    />
            )}


            <h1 className="text-4xl font-playfair text-blood-100 font-bold mb-4">Gestión de Pedidos</h1>

            {tienePermiso("filtrar_pedidos") &&
                <h3 className="text-lg font-urbanist  text-gray-700 font-light mb-4">Administra los pedidos de tu restaurante</h3>
            }
            {tienePermiso("marcar_en_preparacion") &&
                <h3 className="text-lg font-urbanist  text-gray-700 font-light mb-4">Administra los pedidos pendientes del restaurante</h3>

            }

            <OrderCard showOrderActionToast={showOrderActionToast} />


        {/* <NewOrderModal isOpen={open} onClose={() => setOpen(false)} ></NewOrderModal> */}
        </div>
    );
};

export default OrderTable;