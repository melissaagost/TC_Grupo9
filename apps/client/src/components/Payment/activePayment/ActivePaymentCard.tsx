import { useParams, useNavigate } from "react-router-dom";
import { usePaymentLogic } from "../../../hooks/usePaymentLogic";
import { useEffect, useState } from "react";
import axiosInstance from "../../../services/axiosInstance";
import { PedidoRowDTO } from "../../../types/orderTypes";

export default function PagoView() {
  const { idPedido } = useParams();
  const navigate = useNavigate();
  const {  buscarMetodosPago, guardarPago, metodosPago, mensaje, error } = usePaymentLogic();


  const [metodoSeleccionado, setMetodoSeleccionado] = useState<number | null>(null);
   const [pedido, setPedido] = useState<PedidoRowDTO[] | null>(null);

   //carga metodos de pago en el dropdown
useEffect(() => {
  buscarMetodosPago({
    pageIndex: 1,
    pageSize: 100, // o el número que prefieras
    busqueda: "", // si este campo existe en tu tipo
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
      estado: 1,
    });
    if (result?.success) {
      navigate("/");
    }
  };

  return (
    <div className="p-6">

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
        <button onClick={() => navigate("/")} className="bg-gray-400 text-white px-4 py-2 rounded">
          Cancelar
        </button>
      </div>

      {mensaje && <p className="text-green-700 mt-4">{mensaje}</p>}
      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
}
