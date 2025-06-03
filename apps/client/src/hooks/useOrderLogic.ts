//maneja logica de datos para order table y new order
import { groupBy } from "lodash";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orderService } from "../services/orderService";
import {
  PedidoCompletoGuardarDTO,
  PedidoRowDTO,
  ActualizarEstadoDTO,
} from "../types/orderTypes";
import { useAuth } from "../context/AuthContext";
import { useState, useMemo } from "react";

type ItemOrden = {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
};


export const useOrderLogic = () => {
  const queryClient = useQueryClient();
  const { idUsuario } = useAuth();

  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | "">("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">("success");
  const [mesaSeleccionada, setMesaSeleccionada] = useState("");
  const [orden, setOrden] = useState<ItemOrden[]>([]);
  const [pedidoExistente, setPedidoExistente] = useState<PedidoRowDTO | null>(null);


  // LISTAR PEDIDOS
   const listarPedidos = useQuery({
    queryKey: ["pedidos"],
    queryFn: () => orderService.listar().then((res) => res.data),
  });

  const pedidosAgrupados = useMemo(() => {
  if (!listarPedidos.data?.data) return [];

  const agrupados = groupBy(listarPedidos.data.data, 'id_pedido');

  return Object.values(agrupados).map((grupo) => {
    const base = grupo[0];

    return {
      id_pedido: base.id_pedido,
      numero_mesa: base.numero_mesa,
      precio_total: base.precio_total,
      estado: base.estado_descripcion,
      estado_pedido: base.estado_pedido,
      items: grupo.map((item) => ({
        nombre: item.nombre_item,
        cantidad: item.cantidad_item,
        precio: item.subtotal_item,
      })),
    };
  });
}, [listarPedidos.data]);

  //LISTAR PEDIDOS EN LA VISTA MESAS
  // Devuelve los datos crudos del pedido agrupados por id
  const getPedidoItemsRaw = (id: number): PedidoRowDTO[] => {
    if (!listarPedidos.data?.data) return [];
    return listarPedidos.data.data.filter(p => p.id_pedido === id);
  };


  // ACTUALIZAR ESTADO
  const actualizarEstado = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ActualizarEstadoDTO }) =>
    orderService.actualizarEstado({ id, data }),
    onSuccess: (response) => {
      if (response.data.success) {
        setToastMessage(response.data.message || "Estado actualizado");
        setToastType('success');
        queryClient.invalidateQueries({ queryKey: ["pedidos"] });
      } else {
        setToastMessage(response.data.message || "No se pudo actualizar el estado");
        setToastType('error')
      }
    },
    onError: () => {
      setToastMessage("Error al actualizar el estado");
      setToastType('error');
    },
  });

  // CANCELAR PEDIDO
  const cancelarPedido = useMutation({
    mutationFn: (id: number) => orderService.cancelar(id),
    onSuccess: (response) => {
      if (response.data.success) {
        setToastMessage(response.data.message || "Pedido cancelado");
        setToastType('success')
        queryClient.invalidateQueries({ queryKey: ["pedidos"] });
      } else {
        setToastMessage(response.data.message || "No se pudo cancelar el pedido");
        setToastType('error');
      }
    },
    onError: () => {
      setToastMessage("Error al cancelar el pedido");
      setToastType('error')
    },
  });

  //NEW ORDER MODAL actions
    const addItem = (item: { id: string; precio: number; nombre: string }) => {
    setOrden((prev) => {
      const found = prev.find((i) => i.id === item.id);
      if (found) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, cantidad: i.cantidad + 1 } : i
        );
      }
      return [...prev, { id: item.id, nombre: item.nombre, precio: item.precio, cantidad: 1 }];
    });
  };

  const increaseItem = (id: string) => {
    setOrden((prev) =>
      prev.map((i) => (i.id === id ? { ...i, cantidad: i.cantidad + 1 } : i))
    );
  };

  const decreaseItem = (id: string) => {
    setOrden((prev) =>
      prev
        .map((i) =>
          i.id === id ? { ...i, cantidad: i.cantidad - 1 } : i
        )
        .filter((i) => i.cantidad > 0)
    );
  };

  const removeItem = (id: string) => {
    setOrden((prev) => prev.filter((i) => i.id !== id));
  };

  const setMesa = (id: string) => {
    setMesaSeleccionada(id);
  };

  //obtener pedido existente
  const cargarPedidoPorId = async (id_pedido: number): Promise<PedidoCompletoGuardarDTO | null> => {
    try {
      const pedido = await orderService.getById(id_pedido);
      return pedido;
    } catch (error) {
      setToastMessage("Error al cargar el pedido.");
      setToastType("error");
      return null;
    }
  };

  //crear / modificar pedido
  const guardarOrden = async (onPedidoGuardado?: () => void) => {

    if (isSaving) return;

    try {
      setIsSaving(true);

      if (!mesaSeleccionada || orden.length === 0) {
        throw new Error("Debe seleccionar una mesa y agregar al menos un producto.");
      }

      if (idUsuario == null) {
        throw new Error("Usuario no autenticado.");
      }

      for (const item of orden) {
        if (!item.id || isNaN(parseInt(item.id))) {
          throw new Error("Uno de los ítems no tiene un ID válido.");
        }
        if (!item.cantidad || item.cantidad <= 0) {
          throw new Error(`Cantidad inválida para el producto: ${item.nombre}`);
        }
      }

      const esEdicion = pedidoExistente && pedidoExistente.id_pedido;

      const payload: PedidoCompletoGuardarDTO = {
        ...(esEdicion ? { id_pedido: pedidoExistente.id_pedido } : {}),
        id_mesa: parseInt(mesaSeleccionada),
        id_usuario: idUsuario,
        items: orden.map((item) => ({
          id_item: parseInt(item.id),
          cantidad: item.cantidad,
        })),
      };

      const response = await orderService.guardar(payload);
      const { success, message, id } = response.data;

      if (!success) {
        setToastMessage(message || "No se pudo guardar el pedido.");
        setToastType("error");
        return;
      }


      setToastMessage(message || (esEdicion ? "Pedido modificado con éxito" : ""));
      setToastType("success");

      onPedidoGuardado?.();

      return response.data;

    } catch (error: any) {
      setToastMessage(
        error?.response?.data?.mensaje || error.message || "Error inesperado al guardar el pedido."
      );
      setToastType("error");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    //crearPedido,
    pedidoExistente, setPedidoExistente,
    cargarPedidoPorId,
    listarPedidos,
    getPedidoItemsRaw,
    pedidosAgrupados,
    actualizarEstado,
    cancelarPedido,
    toastMessage, setToastMessage,
    toastType, setToastType,
    mesaSeleccionada, setMesaSeleccionada,
    orden, setOrden,
    addItem,
    increaseItem,
    decreaseItem,
    removeItem,
    setMesa,
     isSaving,
    guardarOrden
  };
  {

}

};
