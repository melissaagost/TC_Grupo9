import { useParams, useNavigate } from "react-router-dom";
import { usePaymentLogic } from "../../../hooks/usePaymentLogic";
import { useTableLogic } from "../../../hooks/useTableLogic";
import { useEffect, useState } from "react";
import axiosInstance from "../../../services/axiosInstance";
import { PedidoRowDTO } from "../../../types/orderTypes";
import Toast from "../../UI/Toast";
import { HandCoins, ArrowDownFromLine} from "lucide-react";
import html2pdf from "html2pdf.js"; //ignorar este error boludo

import { useRef } from "react";


export default function PagoView() {

    const { idPedido } = useParams();
    const navigate = useNavigate();

    const {marcarMesaLibre} = useTableLogic();
    const {  buscarMetodosPago, guardarPago, metodosPago} = usePaymentLogic();


    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [toastType, setToastType] = useState<"success" | "error" | "info">("info");
    const [metodoSeleccionado, setMetodoSeleccionado] = useState<number | null>(null);
    const [pedido, setPedido] = useState<PedidoRowDTO[] | null>(null);
    const [pagoExitoso, setPagoExitoso] = useState(false);



    //render de msj
    const showToast = (message: string, type: "success" | "error" | "info") => {
        setToastMessage(message);
        setToastType(type);
    };

   //carga metodos de pago en el dropdown
    useEffect(() => {
      buscarMetodosPago({
        pageIndex: 1,
        pageSize: 100,
        busqueda: "",
      });
    }, []);



    //trae datos del pedido
    useEffect(() => {
      const fetchPedido = async () => {
          if (idPedido !== null) {
          try {
              const response = await axiosInstance.get(`/pedido/buscar/${idPedido}`);
              setPedido(response.data);
          } catch (err) {
              console.error('No se pudieron cargar los detalles extendidos del pedido', err);
          }
          }
      };

      fetchPedido();
    }, [idPedido]);

  const handlePagar = async () => {
    if (!metodoSeleccionado) return showToast("Seleccioná un método de pago", "error");
    const result = await guardarPago({
      id_pedido: parseInt(idPedido!),
      id_metodo: metodoSeleccionado,
      estado: 1,
    });
    if (result?.success && pedido?.[0]?.id_mesa) {
        marcarMesaLibre.mutate(pedido[0].id_mesa); //libera la mesa cuando se guarda el pago
        showToast(result.message, "success");
        setPagoExitoso(true);
        //  setTimeout(() => {
        //   navigate('/payments-index/payments');
        // }, 4000);
    } else {
        //showToast(result.message, "error");
    }
  };

  const ticketRef = useRef<HTMLDivElement>(null);

  return (
    <div  className="flex justify-center items-center pb-6 pt-6">

        {toastMessage && (

                <Toast
                    message={toastMessage}
                    type={toastType}
                    onClose={() => setToastMessage(null)}
                />

            )}

        <div className="w-180 shadow-md rounded-2xl p-5">

              {Array.isArray(pedido) && pedido.length > 0 ? (

              <div ref={ticketRef} className="space-y-4  p-5 shadow-md  text-lg bg-[url(/assets/img/paper-texture.jpg)] font-typewritter text-black font-semibold">

                  <p className="uppercase"><strong>Pedido #</strong> {pedido[0].id_pedido}</p>
                  <p><strong>Fecha:</strong> {new Date(pedido[0].fecha).toLocaleDateString()}</p>
                  <p><strong>Estado:</strong> {pedido[0].estado_descripcion}</p>
                  <p><strong>Mesa:</strong> {pedido[0].numero_mesa} – {pedido[0].descripcion_mesa}</p>
                  <p><strong>A cargo de:</strong> {pedido[0].usuario_nombre}</p>

                  <p className="tracking-widest">
                      ------------------------------------------------------
                  </p>

                  <div className="mt-4">
                  <strong>Items:</strong>
                  <ul className=" list-inside">
                      {pedido.map((item, index) => (
                      <li key={index}>
                        <div className="inline-flex align-middle gap-3">
                          <p className="font-medium">{item.nombre_item}</p>
                          <p>
                          x{item.cantidad_item} –- ${item.subtotal_item}
                          </p>
                        </div>
                      </li>
                      ))}
                  </ul>
                  </div>

                     <p className="tracking-widest">
                      ------------------------------------------------------

                  </p>


                  <p className="text-right mt-2 font-bold">
                  Total: ${pedido.reduce((acc, item) => acc + Number(item.subtotal_item), 0).toFixed(2)}
                  </p>

                  {pagoExitoso && (
                    <div>
                       <img src="/assets/img/barcode.png" alt="barcode" className="w-1/3 max-w-[220px] mx-auto opacity-100" />
                  <p className="text-center text-xs uppercase">¡Gracias por tu visita!</p>
                    </div>
                  )}



              </div>
              ) : (
              <p className="text-sm text-gray-500">Cargando detalles del pedido...</p>
              )}

              <div className="flex justify-between items-end font-urbanist bg-blood-100/10 mt-4 rounded-b-xl  gap-4 p-4">


                  <div className="flex flex-col">

                    <label className="block mb-2">Seleccioná un método de pago:</label>
                    <select
                      onChange={(e) => setMetodoSeleccionado(Number(e.target.value))}
                      className="border border-blood-100/15 rounded px-3 py-2 mb-4">
                      <option value="">Seleccionar</option>
                      {metodosPago.map((m) => (
                        <option key={m.id_metodo} value={m.id_metodo}>
                          {m.nombre}
                        </option>
                      ))}
                    </select>

                  </div>



                      {!pagoExitoso &&
                      (
                      <div className="mb-4 flex gap-4">
                        <button onClick={handlePagar} className="bg-blood-100 inline-flex align-middle gap-1 hover:bg-blood-300 text-white py-2 px-4 rounded-md">
                          <HandCoins size={20}/>Pagar
                        </button>
                        <button onClick={() => navigate("/tables")} className="bg-blood-100 hover:bg-blood-300 text-white py-1 px-4 rounded-md">
                          Cancelar
                        </button>
                      </div>
                      )}

                      {pagoExitoso && (

                          <button
                             onClick={async () => {
                              if (ticketRef.current) {
                                await html2pdf().from(ticketRef.current).set({
                                  margin: 0.5,
                                  filename: `comprobante_pedido_${pedido?.[0].id_pedido}.pdf`,
                                  html2canvas: { scale: 2 },
                                  jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
                                }).save();

                                // Redirigir luego de la descarga
                                navigate("/payments-index/payments");
                              }
                            }}
                            className="bg-blood-100 mb-4 inline-flex align-middle gap-1 hover:bg-blood-300 text-white py-2 px-4 rounded-md"
                          >
                            <ArrowDownFromLine size={20}/>Descargar comprobante
                          </button>

                      )}


                    </div>
              </div>

      </div>


  );
}
