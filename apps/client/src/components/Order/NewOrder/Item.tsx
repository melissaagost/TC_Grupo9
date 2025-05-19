import React from "react";
import { Plus } from "lucide-react";
import { ItemRowDTO } from "../../../types/itemTypes";

type Props = {
  item: ItemRowDTO;
  onAdd: (item: { id: string; precio: number; nombre: string }) => void;
};
const Item: React.FC<Props> = ({ item, onAdd }) => {
  return (
    <div className="flex bg-eggshell-greekvilla justify-between font-urbanist items-center p-4 border border-eggshell-creamy shadow-sm rounded mb-2">
      <div>
        <h4 className="text-md font-playfair font-semibold">{item.nombre}</h4>
        <p className="text-sm text-gray-600">{item.descripcion}</p>
        <span className="text-sm font-bold mt-1 block">${item.precio}</span>
      </div>

      <button
        onClick={() => onAdd({ id: item.id_item.toString(), nombre: item.nombre, precio: item.precio })}
        className="text-gray-200 border border-eggshell-creamy hover:bg-gray-300 p-2 rounded"
      >
        <Plus />
      </button>
    </div>
  );
};

export default Item;
