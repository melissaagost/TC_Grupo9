//maneja logica de datos para order table y new order
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orderService } from "../services/orderService";
import {
  PedidoCompletoGuardarDTO,
  PedidoRowDTO,
  ActualizarEstadoDTO,
} from "../types/orderTypes";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

type ItemOrden = {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
};


export const useOrderLogic = () => {
  const queryClient = useQueryClient();
  const { idUsuario } = useAuth();

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error" | "info">("success");
  const [mesaSeleccionada, setMesaSeleccionada] = useState("");
  const [orden, setOrden] = useState<ItemOrden[]>([]);


  // 🚀 CREAR PEDIDO
  const crearPedido = useMutation({
    mutationFn: (nuevoPedido: PedidoCompletoGuardarDTO) =>
      orderService.crear(nuevoPedido),
    onSuccess: (response) => {
      if (response.data.exito) {
        setToastMessage(response.data.mensaje || "Pedido creado exitosamente");
        setToastType('success');
        queryClient.invalidateQueries({ queryKey: ["pedidos"] });
      } else {
        setToastMessage(response.data.mensaje || "Error al crear pedido");
        setToastType('error');
      }
    },
    onError: () => {
      setToastMessage("Error en la conexión con el servidor");
      setToastType('error');
    },
  });

  // 📄 LISTAR PEDIDOS
  const listarPedidos = useQuery({
    queryKey: ["pedidos"],
    queryFn: () => orderService.listar().then(res => res.data),
  });

  // 🔄 ACTUALIZAR ESTADO
  const actualizarEstado = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ActualizarEstadoDTO }) =>
      orderService.actualizarEstado(id, data),
    onSuccess: (response) => {
      if (response.data.exito) {
        setToastMessage(response.data.mensaje || "Estado actualizado");
        setToastType('success');
        queryClient.invalidateQueries({ queryKey: ["pedidos"] });
      } else {
        setToastMessage(response.data.mensaje || "No se pudo actualizar el estado");
        setToastType('error')
      }
    },
    onError: () => {
      setToastMessage("Error al actualizar el estado");
      setToastType('error');
    },
  });

  // ❌ CANCELAR PEDIDO
  const cancelarPedido = useMutation({
    mutationFn: (id: number) => orderService.cancelar(id),
    onSuccess: (response) => {
      if (response.data.exito) {
        setToastMessage(response.data.mensaje || "Pedido cancelado");
        setToastType('success')
        queryClient.invalidateQueries({ queryKey: ["pedidos"] });
      } else {
        setToastMessage(response.data.mensaje || "No se pudo cancelar el pedido");
        setToastType('error');
      }
    },
    onError: () => {
      setToastMessage("Error al cancelar el pedido");
      setToastType('error')
    },
  });

  //NEW ORDER MODAL
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

  const guardarOrden = async () => {

     if (!mesaSeleccionada || orden.length === 0) {
       throw new Error("Debe seleccionar una mesa y agregar al menos un producto");
     }


    if (idUsuario == null) {
      throw new Error("Usuario no autenticado.");
    }

      const payload: PedidoCompletoGuardarDTO = {
        id_mesa: parseInt(mesaSeleccionada),
        id_usuario: idUsuario!,
        items: orden.map((item) => ({
          id_item: parseInt(item.id),
          cantidad: item.cantidad,
        })),
      };

      const response = await orderService.crear(payload);
      return response.data;
  };



  return {
    crearPedido,
    listarPedidos,
    actualizarEstado,
    cancelarPedido,
    toastMessage,
    toastType,
    mesaSeleccionada,
    orden,
    addItem,
    increaseItem,
    decreaseItem,
    removeItem,
    setMesa,
    guardarOrden,
  };
  {

}

};
