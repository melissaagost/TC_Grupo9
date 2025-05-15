import { Menu, MenuDTO } from "../../../types/menuTypes";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/UI/Dialog";
import * as Switch from "@radix-ui/react-switch";


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
  const [estado, setEstado] = useState(false);

  useEffect(() => {
    if (initialData) {
      setNombre(initialData.nombre);
      setDescripcion(initialData.descripcion);
      setEstado(initialData.estado === 1 || initialData.estado === 0);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      nombre,
      descripcion,
      estado: estado ? 1 : 0,
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

          <div>

            <label className="block font-semibold text-gray-200 text-md mb-1">Estado</label>

            <div className="flex items-center gap-2 p-3 border border-eggshell-creamy shadow-md rounded-md">

              <span className="text-gray-500 text-sm">
                {estado ? "Activo" : "Inactivo"}
              </span>

              <Switch.Root
                checked={estado}
                onCheckedChange={setEstado}
                className="ml-auto w-11 h-6 bg-gray-300 rounded-full relative data-[state=checked]:bg-blood-100 transition-colors"
              >
                <Switch.Thumb
                  className="block w-5 h-5 bg-white rounded-full shadow-md transition-transform translate-x-1 data-[state=checked]:translate-x-6"
                />
              </Switch.Root>


            </div>

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

            <button type="submit" className="bg-blood-100 hover:bg-blood-300 text-white py-1 px-4 rounded-md">Crear Menú</button>

            </div>

        </form>

      </DialogContent>
    </Dialog>
  );
};