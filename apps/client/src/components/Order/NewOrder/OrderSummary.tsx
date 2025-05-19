import React from "react";
import { Trash, Plus, Minus } from "lucide-react";

type OrderItem = {
  id: string;
  nombre: string;
  precio?: number; // puede ser opcional si no se está usando
  cantidad: number;
};

type Mesa = {
  id: string;
  descripcion: string;
};

type Props = {
  mesaSeleccionada: string;
  mesasDisponibles: Mesa[];
  items: OrderItem[];
  onMesaChange: (id: string) => void;
  onRemoveItem: (id: string) => void;
  onAdd: (id: string) => void;
  onSubstract: (id: string) => void;
};

const OrderSummary: React.FC<Props> = ({
  mesaSeleccionada,
  mesasDisponibles,
  items,
  onMesaChange,
  onRemoveItem,
  onAdd,
  onSubstract,
}) => {
  const total = items.reduce((acc, item) => {
    if (item.precio != null) {
      return acc + item.precio * item.cantidad;
    }
    return acc;
  }, 0);

  console.log("Mesas disponibles:", mesasDisponibles);

  return (
    <div className="space-y-4 font-urbanist rounded">
      {/* Selector de mesa */}
      <select
        value={mesaSeleccionada}
        onChange={(e) => onMesaChange(e.target.value)}
        className="w-full text-gray-200 border-eggshell-creamy bg-eggshell-greekvilla border p-2 rounded"
      >
        <option disabled value="">
          Seleccionar mesa
        </option>
        {mesasDisponibles.map((mesa) => (
          <option key={mesa.id} value={mesa.id}>
            {mesa.descripcion}
          </option>
        ))}
      </select>

      {/* Lista de items */}
      <div className="space-y-3 h-[350px] overflow-y-auto pr-1">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center bg-eggshell-greekvilla border border-eggshell-creamy rounded p-4"
          >
            {/* Info del item */}
            <div className="flex flex-col">
              <span className="font-semibold text-gray-800">{item.nombre}</span>
              {item.precio != null && (
                <span className="text-sm text-gray-600">
                  ${item.precio} × {item.cantidad}
                </span>
              )}
            </div>

            {/* Controles */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onSubstract(item.id)}
                className="w-8 h-8 flex items-center text-gray-200 border-eggshell-creamy justify-center border rounded-md hover:bg-yellow-600"
              >
                <Minus size={16} />
              </button>

              <span className="w-6 text-center font-medium">{item.cantidad}</span>

              <button
                onClick={() => onAdd(item.id)}
                className="w-8 h-8 flex text-gray-200 items-center justify-center border-eggshell-creamy border rounded-md hover:bg-yellow-600"
              >
                <Plus size={16} />
              </button>

              <button
                onClick={() => onRemoveItem(item.id)}
                className="w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-700 rounded-md hover:text-white"
              >
                <Trash size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      {items.length > 0 && (
        <div className="flex justify-between items-center font-bold pb-2">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;

