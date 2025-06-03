import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import Item from "./Item";
import OrderSummary from "./OrderSummary";
import { useOrderLogic } from "../../../hooks/useOrderLogic";
import { itemService } from "../../../services/itemService";
import { ItemRowDTO } from "../../../types/itemTypes";
import { getAllMesas } from "../../../services/tableService";
import { PedidoCompletoGuardarDTO } from "../../../types/orderTypes";
// import Toast from "../../UI/Toast"; // Toast will be displayed by Mesas.tsx

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onPedidoGuardado?: () => void;
  pedidoExistente?: PedidoCompletoGuardarDTO | null;
  showOrderToast: (message: string, type: "success" | "error" | "info") => void; // Added prop
};

 const NewOrderModal = ({ isOpen, onClose, onPedidoGuardado: onPedidoGuardadoProp, pedidoExistente: pedidoExistenteProp, showOrderToast }: Props) => {


  const [search, setSearch] = useState("");
  const [items, setItems] = useState<ItemRowDTO[]>([]);
  const [mesas, setMesas] = useState<any[]>([]);


  const {
    mesaSeleccionada, setMesaSeleccionada,
    orden, setOrden,
    addItem,
    removeItem,
    increaseItem,
    decreaseItem,
    setMesa,
    isSaving,
    guardarOrden, // This now returns { success, message, type }
    pedidoExistente, setPedidoExistente, // from useOrderLogic, will be initialized by prop
    // toastMessage, setToastMessage, // No longer using local toast state for rendering here
    // toastType,
  } = useOrderLogic();

  //cargar pedido existente que viene de las props
   useEffect(() => {
    if (pedidoExistenteProp && items.length > 0) { // Ensure menu items (this.items) are loaded
      setMesaSeleccionada(pedidoExistenteProp.id_mesa.toString());
      const ordenItems = pedidoExistenteProp.items.map(pedidoItem => {
        const menuItem = items.find(i => i.id_item === pedidoItem.id_item);
        return {
          id: pedidoItem.id_item.toString(),
          cantidad: pedidoItem.cantidad,
          nombre: menuItem?.nombre || "Ítem no encontrado", // Fallback
          precio: menuItem?.precio || 0, // Fallback
        };
      });
      setOrden(ordenItems);
      setPedidoExistente(pedidoExistenteProp); // Set the hook's state
    } else if (!pedidoExistenteProp) { // Handles nullifying if prop becomes null (e.g. closing and reopening for new)
      setMesaSeleccionada("");
      setOrden([]);
      setPedidoExistente(null);
    }
  }, [pedidoExistenteProp, items, setMesaSeleccionada, setOrden, setPedidoExistente]); // Added items to dependency array

  //Cargar ítems activos
  useEffect(() => {
    const fetchItems = async () => {
      const res = await itemService.listarItems();
      setItems(res.data);
    };
    fetchItems();
  }, []);

  // Cargar mesas
    useEffect(() => {
    const fetchMesas = async () => {
    try {
        const res = await getAllMesas?.();
        console.log("Respuesta cruda de getAllMesas:", res);

        const mesasBackend = res ?? [];

        const mesasFormateadas = mesasBackend.map((m: any) => ({
        id: m.id_mesa?.toString(),
        descripcion: `Mesa ${m.numero}`,
        }));

        console.log("Mesas formateadas:", mesasFormateadas);
        setMesas(mesasFormateadas);
    } catch (e) {
        console.error("Error al traer mesas:", e);
    }
    };
    fetchMesas();
    }, []);


  const filteredItems = items.filter(
    (item) =>
      item.nombre.toLowerCase().includes(search.toLowerCase()) ||
      item.descripcion.toLowerCase().includes(search.toLowerCase())
  );

  const handleGuardar = async () => {
    const res = await guardarOrden(onPedidoGuardadoProp);

    if (res?.message && res?.type) {
      showOrderToast(res.message, res.type);
    }

    if (res?.success) {
      // Reset local state for next time modal opens clean for a NEW order
      // If it was an edit, onClose might be enough if parent fetches fresh data.
      // However, if user reopens to create new after edit, local state should be clean.
      setMesaSeleccionada("");
      setOrden([]);
      setPedidoExistente(null); // Clear the hook's pedidoExistente state
      onClose(); // Close modal
    }
    // If !res.success, the toast is shown, and the modal remains open for corrections.
  };

  //para que al 'descartar cambios' se borre el pedido existente
  const handleDescartarCambios = () => {
    setMesaSeleccionada("");
    setOrden([]);
    setPedidoExistente(null);
    onClose();
  };


  return (
    <Transition appear show={isOpen} as={Fragment}>

        {/* {toastMessage && ( // Removed: Toast is now handled by Mesas.tsx
          <Toast type={toastType} message={toastMessage} onClose={() => setToastMessage("")} />
        )} */}

      <Dialog as="div" className="relative z-10" open={isOpen} onClose={onClose}>
        <div className="fixed inset-0" /> {/* bg-black/25 backdrop-blur-sm */}
        <div className="fixed inset-0 overflow-y-auto">


          <div className="flex min-h-full items-center justify-center p-6">
            <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-xl bg-eggshell-whitedove p-6 shadow-xl transition-all">
              <Dialog.Title className="text-xl font-playfair font-semibold mb-4">
                {pedidoExistenteProp ? `Editar Pedido #${pedidoExistenteProp.id_pedido}` : "Nueva Orden"}
              </Dialog.Title>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Menú */}
                <div>
                  <h3 className="text-base font-playfair mb-4">Artículos del Menú</h3>
                  <input
                    type="text"
                    placeholder="Buscar platos..."
                    className="w-full border font-urbanist border-eggshell-creamy bg-eggshell-greekvilla p-2 rounded mb-4"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <div className="h-[400px] overflow-y-auto pr-1">
                    {filteredItems.map((item) => (
                      <Item
                        key={item.id_item}
                        item={item}
                        onAdd={() => addItem({ id: item.id_item.toString(), precio: item.precio, nombre: item.nombre })}
                    />
                    ))}
                  </div>
                </div>

                {/* Resumen */}
                <div>
                  <h3 className="text-base font-playfair mb-4">Resumen de la Orden</h3>
                  <OrderSummary
                    mesaSeleccionada={mesaSeleccionada}
                    mesasDisponibles={mesas}
                    items={orden}
                    onMesaChange={setMesa}
                    onRemoveItem={removeItem}
                    onAdd={increaseItem}
                    onSubstract={decreaseItem}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="mt-4 flex justify-end space-x-2 border-t font-urbanist border-t-eggshell-creamy pt-4">
                <button
                  onClick={handleDescartarCambios}
                  className="bg-blood-100 hover:bg-blood-300 text-white py-1 px-4 rounded-md"
                >
                  Descartar Cambios
                </button>
                <button
                  onClick={handleGuardar}
                  disabled={isSaving}
                  className={`bg-blood-100 hover:bg-blood-300 text-white py-2 px-4 rounded-md transition ${
                    isSaving ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSaving ? "Guardando..." : "Guardar Orden"}
                </button>

              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default NewOrderModal;