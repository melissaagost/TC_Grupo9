import { useState } from "react";
import { Button } from "../UI/Button";
import { Dialog } from "@headlessui/react";
import { Input } from "../UI/Input";
import { Label } from "../UI/Label";
import { TableStatus, Table } from "./types";

interface TablesHeaderProps {
  onCreate: (newTable: Omit<Table, "id">) => void;
}

const TablesHeader = ({ onCreate }: TablesHeaderProps) => {

  const [isOpen, setIsOpen] = useState(false);

  const [newTable, setNewTable] = useState<Omit<Table, "id">>({
    number: "",
    capacity: 2,
    status: "available",
  });

  const handleCreate = () => {

    if (!newTable.number ) return;

    onCreate(newTable);

      setNewTable({
        number: "",
        capacity: 2,
        status: "available",
      });

    setIsOpen(false);

  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">

      <div>
        <h1 className="text-3xl font-playfair font-bold text-charcoal-800">
          Administración de Mesas
        </h1>
        <p className="text-charcoal-400 font-raleway">Gestiona las mesas de tu restaurante</p>
      </div>

      {/* Botón Add New Table */}

      <Button
        onClick={() => setIsOpen(true)}
        className="bg-burgundy hover:bg-burgundy-700 text-white px-6 py-3 rounded-md">
        + Añadir Nueva Mesa
      </Button>


      {/* Dialog */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="fixed inset-0 font-raleway z-50 flex items-center justify-center">


        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md z-50 relative">
          <Dialog.Title className="text-2xl font-playfair font-bold mb-4">Añadir Nueva Mesa</Dialog.Title>

          <div className="space-y-4">
            <div>
              <Label htmlFor="number">Número de Mesa</Label>
              <Input
                id="number"
                value={newTable.number}
                onChange={(e) => setNewTable({ ...newTable, number: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="capacity">Capacidad</Label>
              <Input
                id="capacity"
                type="number"
                min="1"
                value={newTable.capacity}
                onChange={(e) =>
                  setNewTable({ ...newTable, capacity: parseInt(e.target.value) || 1 })
                }
              />
            </div>


            <div>
              <Label htmlFor="status">Estado</Label>
              <select
                id="status"
                value={newTable.status}
                onChange={(e) =>
                  setNewTable({ ...newTable, status: e.target.value as TableStatus })
                }
                className="w-full px-4 py-2 rounded bg-gray-100"
              >
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="reserved">Reserved</option>
              </select>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <Button onClick={() => setIsOpen(false)} className="bg-gray-300 hover:bg-gray-200 hover:text-white text-gray-700">
                Cancelar
              </Button>
              <Button onClick={handleCreate}>
                Crear Mesa
              </Button>
            </div>

          </div>

        </div>

      </Dialog>

    </div>

  );

};

export default TablesHeader;