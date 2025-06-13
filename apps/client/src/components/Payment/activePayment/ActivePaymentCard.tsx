import { useParams, useNavigate } from "react-router-dom";
import { usePaymentLogic } from "../../../hooks/usePaymentLogic";
import { useTableLogic } from "../../../hooks/useTableLogic";
import { useEffect, useState } from "react";
import axiosInstance from "../../../services/axiosInstance";
import { PedidoRowDTO } from "../../../types/orderTypes";
import Toast from "../../UI/Toast";

export default function PagoView() {

    const { idPedido } = useParams();
    const navigate = useNavigate();

    const {marcarMesaLibre} = useTableLogic();
    const {  buscarMetodosPago, guardarPago, metodosPago} = usePaymentLogic();


    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [toastType, setToastType] = useState<"success" | "error" | "info">("info");
    const [metodoSeleccionado, setMetodoSeleccionado] = useState<number | null>(null);
    const [pedido, setPedido] = useState<PedidoRowDTO[] | null>(null);



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
         setTimeout(() => {
          navigate('/payments-index/payments');
        }, 4000);
    } else {
        //showToast(result.message, "error");
    }
  };

  return (
    <div className="p-6">

        {toastMessage && (

                <Toast
                    message={toastMessage}
                    type={toastType}
                    onClose={() => setToastMessage(null)}
                />

            )}

      {Array.isArray(pedido) && pedido.length > 0 ? (

      <div className="space-y-2 text-sm text-gray-700">

          <p><strong>Pedido N°:</strong> {pedido[0].id_pedido}</p>
          <p><strong>Fecha:</strong> {new Date(pedido[0].fecha).toLocaleDateString()}</p>
          <p><strong>Estado:</strong> {pedido[0].estado_descripcion}</p>
          <p><strong>Mesa:</strong> {pedido[0].numero_mesa} – {pedido[0].descripcion_mesa}</p>
          <p><strong>A cargo de:</strong> {pedido[0].usuario_nombre}</p>

          <div className="mt-4">
          <strong>Items:</strong>
          <ul className="list-disc list-inside">
              {pedido.map((item, index) => (
              <li key={index}>
                  <p className="font-medium">{item.nombre_item}</p>
                  <p>
                  Cantidad: {item.cantidad_item} – Subtotal: ${item.subtotal_item}
                  </p>
              </li>
              ))}
          </ul>
          </div>

          <p className="text-right mt-2 font-bold">
          Total: ${pedido.reduce((acc, item) => acc + Number(item.subtotal_item), 0).toFixed(2)}
          </p>
      </div>
      ) : (
      <p className="text-sm text-gray-500">Cargando detalles del pedido...</p>
      )}


      <label className="block mb-2">Seleccioná un método de pago:</label>
      <select
        onChange={(e) => setMetodoSeleccionado(Number(e.target.value))}
        className="border rounded px-3 py-2 mb-4"
      >
        <option value="">Seleccionar</option>
        {metodosPago.map((m) => (
          <option key={m.id_metodo} value={m.id_metodo}>
            {m.nombre}
          </option>
        ))}
      </select>

      <div className="flex gap-4">
        <button onClick={handlePagar} className="bg-green-600 text-white px-4 py-2 rounded">
          Pagar
        </button>
        <button onClick={() => navigate("/tables")} className="bg-gray-400 text-white px-4 py-2 rounded">
          Cancelar
        </button>
      </div>

    </div>
  );
}
