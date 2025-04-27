import { useState } from "react";
import { Button } from "../UI/Button";
import { Dialog } from "../UI/Dialog";
import { Input } from "../UI/Input";
import { Label } from "../UI/Label";
import { AlertDialog } from "../UI/AlertDialog";
import { Edit, Trash2 } from "lucide-react";


interface Table {
  id: number;
  number: string;
  capacity: number;
  status: string;
}

interface TableRowProps {
  table: Table;
  onEdit: (table: Table) => void;
  onDelete: (id: number) => void;
}

const TableRowComponent = ({ table, onEdit, onDelete }: TableRowProps) => {

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  //logica de guardado de cambios (actualizar a logica real)
  const handleSaveChanges = () => {
    console.log("Saving changes...");
    setIsEditOpen(false);
  };

  return (

    //filas
    <tr className="hover:bg-gray-100 transition-colors">

      <td className="text-center">{table.number}</td>

      <td className="text-center">{table.capacity} invitados</td>

      <td className="text-center">
        <span className="px-2 py-1 rounded-full text-xs bg-green-50 text-green-600">
          {table.status}
        </span>
      </td>

      <td className="text-center space-x-2">

        {/* Editar */}
        <Button
          className="bg-transparent text-gray-700 hover:bg-blood-100 hover:text-white p-1 rounded"
          onClick={() => setIsEditOpen(true)}
        >
          <Edit  size={16} />
        </Button>

        {/* dialogo */}
        <Dialog open={isEditOpen} onClose={() => setIsEditOpen(false)}>
          <div className="space-y-4 font-raleway">
            <h2 className="text-2xl font-playfair font-bold mb-4">Editar Mesa</h2>

            <div className="space-y-2">
              <Label>Número de Mesa</Label>
              <Input value={table.number} disabled />
            </div>

            <div className="space-y-2">
              <Label>Capacidad</Label>
              <Input value={table.capacity} disabled />
            </div>



            <div className="flex justify-end gap-4 mt-6">
              <Button onClick={() => setIsEditOpen(false)} className="bg-gray-300 hover:bg-gray-200 hover:text-white text-gray-700">
                Cancelar
              </Button>

              {/* guardar cambios */}
              <Button
                onClick={handleSaveChanges}
                className="bg-burgundy hover:bg-burgundy-700 text-white">
                Guardar Cambios
              </Button>

            </div>

          </div>

        </Dialog>

        {/* eliminar */}
        <Button
          className="bg-transparent hover:bg-red-500 hover:text-white text-red-600 p-1 rounded"
          onClick={() => setIsDeleteOpen(true)}>
          <Trash2 size={16} />
        </Button>

        {/* eliminar AlertDialog */}
        <AlertDialog open={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}>

          <div className="space-y-4 font-raleway">

            <h2 className="text-xl font-bold text-center">Eliminar Mesa</h2>

            <p className="text-center text-gray-600">
              Seguro que quieres eliminar la mesa {table.number}? Esta acción no puede ser revertida.
            </p>

            <div className="flex justify-center gap-4 mt-6">

              <Button
                className="bg-gray-300 hover:bg-gray-200 hover:text-white text-gray-700"
                onClick={() => setIsDeleteOpen(false)}>
                Cancelar
              </Button>

              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={() => {
                  onDelete(table.id);
                  setIsDeleteOpen(false);
                }}>
                Eliminar
              </Button>

            </div>

          </div>

        </AlertDialog>

      </td>

    </tr>
  );
};

export default TableRowComponent;
