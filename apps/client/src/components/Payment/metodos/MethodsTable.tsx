import { useState, useEffect } from "react";
import Toast from "../../UI/Toast";
import Search from "./Search";
import { TableLayout } from "../../UI/Table";
import { Ban, EditIcon, CheckCircle2, Plus  } from "lucide-react";
import { usePaymentLogic } from "../../../hooks/usePaymentLogic";
import { MetodoPagoRow, MetodoPagoGuardarDTO } from "../../../types/paymentTypes";
import { Dialog } from "@headlessui/react";
import CreateMethod from "./CreateMethod";
import EditMethod from "./EditMethod";

const MethodsTable = () => {

    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [toastType, setToastType] = useState<"success" | "error" | "info">("info");
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [metodoToEdit, setMetodoToEdit] = useState<MetodoPagoGuardarDTO | null>(null);


    const showToast = (message: string, type: "success" | "error" | "info") => {
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

    useEffect(() => {
        if (error) {
            showToast(error, "error");
        }
    }, [error]);

    //buscador
    useEffect(() => {
        buscarMetodosPago({ pageIndex: 1, pageSize: 100});
    }, []);

    // //deshabilitar / habilitar
    const onToggleEstado = async (metodo: MetodoPagoRow) => {
    const result = metodo.estado === 1
        ? await deshabilitarMetodoPago(metodo.id_metodo)
        : await habilitarMetodoPago(metodo.id_metodo);

    if (result.success) {
        showToast(result.message, "success");
    } else {
        showToast(result.message, "error");
    }

    // Recargar
    await buscarMetodosPago({ pageIndex: 1, pageSize: 100 });
    };

    //crear / editar
     const handleCreate = async (data: MetodoPagoGuardarDTO) => {
    const result = await guardarMetodoPago(data);

    if (result.success) {
        showToast(result.message, "success");
        setIsCreating(false);
        await buscarMetodosPago({ pageIndex: 1, pageSize: 100 });
    } else {
        showToast(result.message, "error");
    }
    };

    const handleEdit = async (data: MetodoPagoGuardarDTO) => {
     const result =  await guardarMetodoPago(data);

    if (result.success) {
        showToast(result.message, "success");
        setIsEditing(false);
        setMetodoToEdit(null);
        await buscarMetodosPago({ pageIndex: 1, pageSize: 100 });
    } else {
        showToast(result.message, "error");
    }
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
                 data={metodosFiltrados ?? []}
                columns={[
                    {
                    key: "nombre",
                    label: "Nombre",
                    className: "font-semibold",
                    render: (metodo) => metodo.nombre,
                    },
                    {
                    key: "estado",
                    label: "Estado",
                    className: "font-semibold",
                    render: (metodo) => (
                        <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                            metodo.estado === 1
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                        >
                        {metodo.estado === 1 ? "Activo" : "Inactivo"}
                        </span>
                    ),
                    },
                    {
                    key: "acciones",
                    label: "Acciones",
                    className: "font-semibold text-right",
                    render: (metodo) => (
                        <div className="flex gap-2 justify-end mr-3">
                        {metodo.estado === 1 && (
                            <div
                             onClick={() => {
                                setMetodoToEdit(metodo);
                                setIsEditing(true);
                            }}
                            className="cursor-pointer hover:text-blue-600"
                            title="Edit"
                            >
                            <EditIcon size={18} />
                            </div>
                        )}
                        <div
                            onClick={() => onToggleEstado(metodo)}
                            className={`cursor-pointer ${
                            metodo.estado === 1
                                ? "text-red-500 hover:text-red-600"
                                : "text-green-500 hover:text-green-600"
                            }`}
                            title={metodo.estado === 1 ? "Disable" : "Enable"}
                        >
                            {metodo.estado === 1 ? <Ban size={18} /> : <CheckCircle2 size={18} />}
                        </div>
                        </div>
                    ),
                    },
                ]}

                />

            </div>

            <button onClick={() => setIsCreating(true)} className="font-semibold transition-all duration-300 hover:-translate-y-1 shadow-md px-4 py-2 ml-0 m-5 w-48 gap-1 inline-flex items-center bg-blood-100 text-white rounded-3xl hover:bg-blood-300"> <Plus size={'20'}/>Agregar Método</button>

        {/* Diálogo para crear */}
            <CreateMethod
                open={isCreating}
                onClose={() => setIsCreating(false)}
                onCreate={handleCreate}
                onToast={showToast}
            />

            {/* Diálogo para editar */}
            <EditMethod
                open={isEditing}
                onClose={() => {
                setIsEditing(false);
                setMetodoToEdit(null);
                }}
                onSave={handleEdit}
                initialData={metodoToEdit}
                onToast={showToast}
            />


        </div>

    );
};

export default MethodsTable;