import { useState } from "react";
import { Button } from "../UI/Button";
import { Plus } from "lucide-react";
import { Dialog } from "../UI/Dialog";
import { Input } from "../UI/Input";
import { Label } from "../UI/Label";

interface TablesActionsProps {
  onCreateTable: (data: {
    number: string;
    capacity: number;
    location: string;
  }) => void;
}

const TablesActions = ({ onCreateTable }: TablesActionsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Form State
  const [number, setNumber] = useState("");
  const [capacity, setCapacity] = useState(2);
  const [location, setLocation] = useState("");

  const handleCreate = () => {
    if (!number || !location) return; // opcional: validaciones básicas
    onCreateTable({ number, capacity, location });
    setIsOpen(false); // Cerrar el modal
    // Resetear campos
    setNumber("");
    setCapacity(2);
    setLocation("");
  };

  return (
    <div className="flex justify-end mb-6">
      {/* Botón para abrir el modal */}
      <Button
        className="flex items-center gap-2 bg-blood-100 hover:bg-blood-300"
        onClick={() => setIsOpen(true)}
      >
        <Plus size={16} />
        Add New Table
      </Button>

      {/* Dialog para crear nueva mesa */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold font-playfair mb-4 text-center">
            Add New Table
          </h2>

          <div className="space-y-2">
            <Label htmlFor="number">Table Number</Label>
            <Input
              id="number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity</Label>
            <Input
              id="capacity"
              type="number"
              min="1"
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Button
              onClick={() => setIsOpen(false)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800"
            >
              Cancel
            </Button>

            <Button
              onClick={handleCreate}
              className="bg-blood-100 hover:bg-blood-300 text-white"
            >
              Create
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default TablesActions;
