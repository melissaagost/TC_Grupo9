import { useOrderLogic } from "../../hooks/useOrderLogic";
import OrderCard from "./OrderCard";
import Toast from "../UI/Toast";
import { usePermisos } from "../../hooks/usePermisos";

const OrderTable = () => {
    //  const [open, setOpen] = useState(true);
      const { tienePermiso } = usePermisos();

     const {
        toastMessage, setToastMessage,
        toastType,
     } = useOrderLogic();

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

            <OrderCard/>


        {/* <NewOrderModal isOpen={open} onClose={() => setOpen(false)} ></NewOrderModal> */}
        </div>
    );
};

export default OrderTable;