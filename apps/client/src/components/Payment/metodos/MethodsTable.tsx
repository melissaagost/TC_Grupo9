import { useState, useEffect } from "react";
import Toast from "../../UI/Toast";
import Search from "./Search";
import { TableLayout } from "../../UI/Table";
import { Edit2, X, Check, MoreHorizontal, Plus } from "lucide-react";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Ban, EditIcon, CheckCircle2  } from "lucide-react";
import { usePaymentLogic } from "../../../hooks/usePaymentLogic";
import { MetodoPagoRow } from "../../../types/paymentTypes";

const MethodsTable = () => {

    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [toastType, setToastType] = useState<"success" | "error" | "info">("info");

    const showOrderActionToast = (message: string, type: "success" | "error" | "info") => {
        setToastMessage(message);
        setToastType(type);
    };

    const {
        metodosFiltrados,
        setBusqueda,
        loading,
        mensaje,
        error,

        buscarMetodosPago,
        guardarMetodoPago,
        deshabilitarMetodoPago,
        habilitarMetodoPago,
    } = usePaymentLogic();

    //buscador
    useEffect(() => {
        buscarMetodosPago({ pageIndex: 1, pageSize: 100 });
    }, []);

    //deshabilitar / habilitar
    const onToggleEstado = async (metodo: MetodoPagoRow) => {
        if (metodo.estado === 1) {
            await deshabilitarMetodoPago(metodo.id_metodo);
        } else {
            await habilitarMetodoPago(metodo.id_metodo);
        }
        // Recargar
        await buscarMetodosPago({ pageIndex: 0, pageSize: 100 });
    };


    return(
        <div className=" font-raleway flex flex-col lg:px-10 lg:py-0  py-10 px-0">

          {toastMessage && (

                <Toast
                    message={toastMessage}
                    type={toastType}
                    onClose={() => setToastMessage(null)}
                />

            )}

            <Search onSearch={setBusqueda}/>

            <div  className="overflow-x-auto w-full">
                <TableLayout
                title=""
                columns={[
                    {
                    key: "nombre",
                    label: "Nombre",
                    className: "font-semibold",
                    },
                    {
                    key: "estado",
                    label: "Estado",
                    className: "font-semibold",
                    render: (item) => (
                        <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.estado === 1
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                        >
                        {item.estado === 1 ? "Active" : "Inactive"}
                        </span>
                    ),
                    },
                    {
                    key: "acciones",
                    label: "Acciones",
                    className: "font-semibold text-center",
                    render: (item) => (
                        <div className="flex gap-2 justify-center">
                        {item.estado === 1 && (
                            <div
                            // onClick={() => onEdit(item)}
                            className="cursor-pointer hover:text-blue-600"
                            title="Edit"
                            >
                            <EditIcon size={18} />
                            </div>
                        )}
                        <div
                            onClick={() => onToggleEstado(item)}
                            className={`cursor-pointer ${
                            item.estado === 1
                                ? "text-red-500 hover:text-red-600"
                                : "text-green-500 hover:text-green-600"
                            }`}
                            title={item.estado === 1 ? "Disable" : "Enable"}
                        >
                            {item.estado === 1 ? <Ban size={18} /> : <CheckCircle2 size={18} />}
                        </div>
                        </div>
                    ),
                    },
                ]}
                data={metodosFiltrados}
                />

            </div>

            <button className="font-semibold transition-all duration-300 hover:-translate-y-1 shadow-md px-4 py-2 ml-0 m-5 w-48 gap-1 inline-flex items-center bg-blood-100 text-white rounded-3xl hover:bg-blood-300"> <Plus size={'20'}/>Agregar Método</button>

        </div>
    );
};

export default MethodsTable;