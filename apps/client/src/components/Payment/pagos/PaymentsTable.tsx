//no se edita ni crean pagos, solo se ven los q ya fueron concretados / cancelados
import { useState, useEffect } from "react";
import Search from "./Search";
import Toast from "../../UI/Toast";
import { usePaymentLogic } from "../../../hooks/usePaymentLogic";
import { TableLayout } from "../../UI/Table";
import { PagoRowDTO } from "../../../types/paymentTypes";
import { BanknoteX } from "lucide-react";
import { Pagination } from "../Pagination";

const PaymentsTable = () =>{

    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [toastType, setToastType] = useState<"success" | "error" | "info">("info");

    //botones de filtro
    const [estadoSeleccionado, setEstadoSeleccionado] = useState<number | null>(null);
    const [ordenCol, setOrdenCol] = useState("fecha");
    const [ordenDir, setOrdenDir] = useState<"ASC" | "DESC">("DESC");

    //paginacion
    const [pageIndex, setPageIndex] = useState(1); // empieza en 1
    const [pageSize, setPageSize] = useState(5);


    const showToast = (message: string, type: "success" | "error" | "info") => {
        setToastMessage(message);
        setToastType(type);
    };

    const {
        setBusqueda,
        pagosFiltrados,
        totalPagos,
        error,


        listarPagos,
        cancelarPago,
    } = usePaymentLogic();

    useEffect(() => {
        if (error) {
            showToast(error, "error");
        }
    }, [error]);

    useEffect(() => {
        listarPagos({ pageIndex, pageSize, estado: estadoSeleccionado, ordenCol, ordenDir,});
        //listarPagos({ pageIndex, pageSize, estado: estadoSeleccionado, ordenCol, ordenDir,});
    }, [estadoSeleccionado, ordenCol, ordenDir]);

    // cancelar pago
    const onToggleEstado = async (pago: PagoRowDTO) => {

        const result = await cancelarPago(pago.id_metodo);


        if (result.success) {
            showToast(result.message, "success");
        } else {
            showToast(result.message, "error");
        }

        // Recargar
        await listarPagos({ pageIndex, pageSize, estado: null, ordenCol, ordenDir });

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

            {/*filtros */}
            <div className="flex gap-2 font-urbanist">
            <select
                value={estadoSeleccionado ?? ""}
                onChange={(e) => {
                    const value = e.target.value;
                    setEstadoSeleccionado(value === "" ? null : parseInt(value));
                }}
                className="border px-3 py-2 rounded"
                >
                <option value="">Todos los Estados</option>
                <option value="0">Cancelado</option>
                <option value="1">Pagado</option>
                </select>


                    <button
                        onClick={() => {
                        if (ordenCol === "fecha") {
                            setOrdenDir(ordenDir === "ASC" ? "DESC" : "ASC");
                        } else {
                            setOrdenCol("fecha");
                            setOrdenDir("DESC");
                        }
                        }}
                        className={`px-3 py-1 border rounded ${
                        ordenCol === "fecha" ? "bg-gray-200 font-semibold" : ""
                        }`}
                    >
                        Date {ordenCol === "fecha" ? (ordenDir === "ASC" ? "↑" : "↓") : ""}
                    </button>

                    <button
                        onClick={() => {
                        if (ordenCol === "monto") {
                            setOrdenDir(ordenDir === "ASC" ? "DESC" : "ASC");
                        } else {
                            setOrdenCol("monto");
                            setOrdenDir("DESC");
                        }
                        }}
                        className={`px-3 py-1 border rounded ${
                        ordenCol === "monto" ? "bg-gray-200 font-semibold" : ""
                        }`}
                    >
                        Amount {ordenCol === "monto" ? (ordenDir === "ASC" ? "↑" : "↓") : ""}
                    </button>
                    </div>


              {/*tabla */}
              <div  className="overflow-x-auto w-full">
                <TableLayout
                    data={pagosFiltrados ?? []}
                    columns={[
                        {
                        key: "id_pago",
                        label: "N° de Pago",
                        className: "font-semibold",
                        render: (pago) => <p>#{pago.id_pago}</p>,
                        },
                        {
                        key: "fecha",
                        label: "Fecha",
                        render: (pago) => new Date(pago.fecha).toLocaleDateString()
                        },
                        {
                        key: "monto",
                        label: "Monto",
                        render: (pago) => <p>$ {pago.monto}</p>
                        },
                        {
                        key: "nombre_metodo",
                        label: "Método de Pago",
                        render: (pago) => pago.nombre_metodo,
                        },
                        {
                        key: "estado",
                        label: "Estado",
                        className: "font-semibold",
                        render: (pago) => (
                            <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                pago.estado === 1
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                            >
                            {pago.estado === 1 ? "Pagado" : "Cancelado"}
                            </span>
                        ),
                        },
                        {
                        key: "acciones",
                        label: "Acciones",
                        className: "font-semibold text-right",
                       render: (metodo) =>
                        metodo.estado === 1 && (
                            <div className="flex gap-2 justify-end mr-7">
                            <div
                                onClick={() => onToggleEstado(metodo)}
                                className="cursor-pointer text-red-500 hover:text-red-600"
                                title="Cancelar Pago"
                            >
                                <BanknoteX size={25} />
                            </div>
                            </div>
                        ),

                        },
                    ]}

                />

              </div>


        {/*paginacion */}
        <Pagination
            pageIndex={pageIndex}
            pageSize={pageSize}
            total={totalPagos}
            onPageChange={(newPage) => setPageIndex(newPage)}
            onPageSizeChange={(newSize) => setPageSize(newSize)}
            />


        </div>


    );
};

export default PaymentsTable;