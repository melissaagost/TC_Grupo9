import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import Item from "./Item";
import OrderSummary from "./OrderSummary";
import { useOrderLogic } from "../../../hooks/useOrderLogic";
import { itemService } from "../../../services/itemService";
import { ItemRowDTO } from "../../../types/itemTypes";
import { getAllMesas } from "../../../services/tableService";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const NewOrderModal = ({ isOpen, onClose }: Props) => {



const [search, setSearch] = useState("");
  const [items, setItems] = useState<ItemRowDTO[]>([]);
  const [mesas, setMesas] = useState<any[]>([]); // podés reemplazar `any` por tu tipo Mesa

  const {
    mesaSeleccionada,
    orden,
    addItem,
    removeItem,
    increaseItem,
    decreaseItem,
    setMesa,
    guardarOrden,
  } = useOrderLogic();

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
    const res = await guardarOrden();
    if (res.exito) {
      console.log("Pedido creado con éxito");
      onClose();
    } else {
      console.error("Error:", res.mensaje);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-6">
            <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-xl bg-eggshell-whitedove p-6 shadow-xl transition-all">
              <Dialog.Title className="text-xl font-playfair font-semibold mb-4">
                Nueva Orden
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
                  onClick={onClose}
                  className="bg-blood-100 hover:bg-blood-300 text-white py-1 px-4 rounded-md"
                >
                  Descartar Cambios
                </button>
                <button
                  onClick={handleGuardar}
                  className="bg-blood-100 hover:bg-blood-300 text-white py-2 px-4 rounded-md"
                >
                  Guardar Orden
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