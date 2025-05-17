import { Menu, MenuDTO } from "../../../types/menuTypes";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/UI/Dialog";


interface DialogEditMenuProps {
  open: boolean;
  onClose: () => void;
  onSave: (updatedMenu: MenuDTO) => void;
  initialData: Menu | null; // <-- ajustado aquí
}

export const EditDialog = ({
  open,
  onClose,
  onSave,
  initialData,
}: DialogEditMenuProps) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  useEffect(() => {
    if (initialData) {
      setNombre(initialData.nombre);
      setDescripcion(initialData.descripcion);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      nombre,
      descripcion,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Menú</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">

          <div>

            <label className="block text-md font-semibold text-gray-200  mb-1">Nombre</label>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full shadow-sm border border-eggshell-creamy rounded-md px-3 py-2 text-sm text-gray-800 outline-none focus:ring-1 focus:ring-blood-300"
              required
            />

          </div>

          <div>

            <label className="block font-semibold text-gray-200 text-md mb-1">Descripción</label>

            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full border shadow-sm border-eggshell-creamy rounded-md px-3 py-2 text-sm text-gray-700 resize-none focus:ring-1 focus:ring-blood-300"
              rows={3}
            />

          </div>



          <div className="flex justify-end gap-2 mt-4">

              <button
                type="button"
                onClick={() => {
                  onClose();
                }}
                className="bg-blood-100 hover:bg-blood-300 text-white py-1 px-4 rounded-md"
              >
                Cancelar
            </button>

            <button type="submit" className="bg-blood-100 hover:bg-blood-300 text-white py-1 px-4 rounded-md">Guardar Cambios</button>

            </div>

        </form>

      </DialogContent>
    </Dialog>
  );
};