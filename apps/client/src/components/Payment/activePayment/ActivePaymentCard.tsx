import { useParams, useNavigate } from "react-router-dom";
import { usePaymentLogic } from "../../../hooks/usePaymentLogic";
import { useOrderLogic } from "../../../hooks/useOrderLogic";
import { useEffect, useState } from "react";
import axiosInstance from "../../../services/axiosInstance";

export default function PagoView() {
  const { idPedido } = useParams();
  const navigate = useNavigate();
  const { buscarMetodosPago, guardarPago, metodosPago, mensaje, error } = usePaymentLogic();
  const { cargarPedidoPorId } = useOrderLogic();

  const [metodoSeleccionado, setMetodoSeleccionado] = useState<number | null>(null);
  const [pedido, setPedido] = useState(null);

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


  // useEffect(() => {
  //   const fetchPedido = async () => {
  //     if (idPedido) {
  //       const res = await cargarPedidoPorId(Number(idPedido));
  //       setPedido(res.pedido);
  //       if (res.toast?.type === "error") {
  //         alert(res.toast.message);
  //       }
  //     }
  //   };
  //   fetchPedido();
  //   buscarMetodosPago({});
  // }, [idPedido]);

  const handlePagar = async () => {
    if (!metodoSeleccionado) return alert("Seleccioná un método de pago");
    const result = await guardarPago({
      id_pedido: parseInt(idPedido!),
      id_metodo: metodoSeleccionado,
      estado: "Pendiente",
    });
    if (result?.success) {
      navigate("/");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-2">
        Pago del Pedido #{pedido?.id_pedido}
      </h2>
      <p className="mb-4">Mesa: {pedido?.mesa?.numero}</p>
      <p className="mb-4">Total: ${pedido?.total}</p>

      <label className="block mb-2">Seleccioná un método de pago:</label>
      <select
        onChange={(e) => setMetodoSeleccionado(Number(e.target.value))}
        className="border rounded px-3 py-2 mb-4"
      >
        <option value="">-- Seleccionar --</option>
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
        <button onClick={() => navigate("/")} className="bg-gray-400 text-white px-4 py-2 rounded">
          Cancelar
        </button>
      </div>

      {mensaje && <p className="text-green-700 mt-4">{mensaje}</p>}
      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
}
