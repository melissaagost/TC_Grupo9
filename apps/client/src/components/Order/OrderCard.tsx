import { EyeIcon, CookingPot, Trash } from "lucide-react";
import  { usePermisos } from '../../hooks/usePermisos'
import { useOrderLogic } from "../../hooks/useOrderLogic";
import { useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";

interface OrderCardProps {
  showOrderActionToast: (message: string, type: "success" | "error" | "info") => void;
}

const OrderCard = ({ showOrderActionToast }: OrderCardProps) => {

  const { userType } = useAuth(); //"cocinero", "mozo", "gestor", etc.

  const { tienePermiso } = usePermisos();

    const {
        listarPedidos,
        pedidosAgrupados,
        actualizarEstado,
    } = useOrderLogic();

    const [estadoSeleccionado, setEstadoSeleccionado] = useState<number | null>(null); // null = todos

   const estados = [
    { id: null, label: "Todas las Mesas" },
    { id: 0, label: "Cancelado" },
    { id: 1, label: "Solicitado" },
    { id: 2, label: "Pagado" },
    { id: 3, label: "En Preparación" },
    { id: 5, label: "En Mesa" },
    ];

    const pedidosFiltrados = useMemo(() => {
    let pedidos = pedidosAgrupados;

    if (userType === "cocinero") {
        // cocineros no tienen acceso a filtros: ver solo pedidos "Solicitado" (estado_pedido 1)
        pedidos = pedidos.filter((p) => p.estado_pedido === 1);
    } else {
        // Usuarios con permiso (mozo y admin) pueden aplicar filtros
        if (estadoSeleccionado !== null) {
        pedidos = pedidos.filter((p) => p.estado_pedido === estadoSeleccionado);
        }
    }

    return pedidos;
    }, [userType, estadoSeleccionado, pedidosAgrupados]);

    const estadoClasses: Record<string, string> = {
    "cancelado": "bg-red-100 text-red-500 hover:bg-red-200",
    "solicitado": "bg-yellow-200 text-yellow-800 hover:bg-yellow-300",
    "pagado": "bg-gray-300 text-gray-700 hover:bg-gray-400",
    "preparando": "bg-blue-200 text-blue-800 hover:bg-blue-300",
    "en mesa": "bg-green-200 text-green-700 hover:bg-green-300",
    };

    const handleActualizarEstado = (id: number, nuevoEstado: number) => {
      if (isNaN(id)) {
        showOrderActionToast("ID de pedido inválido para actualizar.", "error");
        console.error("ID inválido:", id);
        return;
      }

      actualizarEstado.mutate({ id, data: { nuevo_estado: nuevoEstado } }, {
        onSuccess: (response) => {
          if (response.data.success) {
            showOrderActionToast(response.data.message || "Estado actualizado con éxito", "success");
          } else {
            showOrderActionToast(response.data.message || "No se pudo actualizar el estado", "error");
          }
        },
        onError: (error: any) => {
          showOrderActionToast(error?.response?.data?.message || error.message || "Error al actualizar el estado", "error");
        }
      });
    };

    if (listarPedidos.isLoading) return <div>Cargando pedidos...</div>;
    if (listarPedidos.isError) return <div>Error al cargar pedidos</div>;

return (
    <>
      {tienePermiso("filtrar_pedidos") &&
            <div  className="flex flex-wrap gap-4 mt-2 mb-2 bg-eggshell-greekvilla md:w-188 lg:w-188 text-gray-200 p-2 rounded-lg">
                    {estados.map((estado) => (
                        <button
                            key={estado.id ?? "todos"}
                            onClick={() => setEstadoSeleccionado(estado.id)}
                            className={`px-4 py-1 rounded-md text-sm font-semibold transition ${

                                    estadoSeleccionado === estado.id
                                        ? "bg-eggshell-whitedove text-charcoal-800 shadow"
                                        : "text-charcoal-400 hover:text-charcoal-600"

                                    }`}
                            >
                            {estado.label}
                        </button>
                    ))}
                </div>
        }
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

    {pedidosFiltrados.map((order) => {

        const estadoKey = order.estado.toLowerCase();


      const MAX_ITEMS_VISIBLE = 3;
      const visibleItems = order.items.slice(0, MAX_ITEMS_VISIBLE);
      const hiddenCount = order.items.length - MAX_ITEMS_VISIBLE;
      const showExtra = hiddenCount > 0;

      return (

        <div key={order.id_pedido} className="mb-12 md:mb-12 h-45">
          <div className="max-w-md h-full  w-full font-urbanist  flex flex-col justify-between bg-white shadow-md rounded-xl p-4 overflow-hidden">
            {/* Header */}
            <div className="border-b border-b-eggshell-creamy mb-3 pb-2">
              <div className="flex justify-between">
                <h4 className="font-playfair">Orden #{order.id_pedido}</h4>
                <span className="font-semibold">${order.precio_total}</span>
              </div>
              <span className="text-sm mt-1 block">Mesa {order.numero_mesa}</span>
            </div>

            {/* Items */}
            <div className="flex flex-col gap-2 overflow-hidden text-sm">
              <span className="font-medium">Artículos ({order.items.length})</span>
              {visibleItems.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>{item.nombre} x{item.cantidad}</span>
                  <span>${item.precio}</span>
                </div>
              ))}
              {showExtra && (
                <span className="text-sm text-gray-500 mt-1">+{order.items.length - MAX_ITEMS_VISIBLE} artículos más</span>
              )}
            </div>
          </div>

          {/* Acciones */}
          <div className="flex flex-wrap max-w-sm text-base items-center justify-between gap-2 font-urbanist pt-4">
                <button className="inline-flex items-center gap-2 hover:text-blood-100 hover:underline">
                <EyeIcon size={20} /> Detalles
                </button>

                {(tienePermiso("marcar_en_preparacion") && userType !== 'administrador') && (
                <button
                    onClick={() => handleActualizarEstado(order.id_pedido, 3)}
                    className="inline-flex items-center gap-2 hover:text-blood-100 hover:underline"
                >
                    <CookingPot size={20} /> Marcar En Preparación
                </button>
                )}

                {tienePermiso("eliminar_pedido_historial") && (
                <button className="inline-flex items-center gap-2 hover:text-blood-100 hover:underline">
                    <Trash size={20} /> Eliminar del Historial
                </button>
                )}

                <span className={`px-3 py-0.5 rounded-full font-medium ${estadoClasses[estadoKey] || "bg-gray-200 text-gray-700"}`}>
                    {order.estado}
                </span>

          </div>

        </div>
      );
    })}
  </div>

  </>
);

};

export default OrderCard;
