import { useState } from "react";
import { CategoriaCrearDTO } from "../../types/categoryTypes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../UI/Dialog";



interface CreateDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (newCategory: CategoriaCrearDTO) => void;
}

export const CreateDialog = ({
  open,
  onClose,
  onCreate,
}: CreateDialogProps) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [estado, setEstado] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({
      nombre,
      descripcion,
    });
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setNombre("");
    setDescripcion("");
    setEstado(false);
  };

  return (
    <Dialog open={open} onClose={() => { resetForm(); onClose(); }}>

      <DialogContent>

        <DialogHeader>
          <DialogTitle>Crear Menú</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">


          <div>
            <label className="block  font-semibold text-gray-200 text-md mb-1">Nombre</label>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
               placeholder="Asigne un nombre a la categoría"
              className="w-full shadow-sm border border-eggshell-creamy rounded-md px-3 py-2 text-gray-800 outline-none focus:ring-1 focus:ring-blood-300"
              required
            />
          </div>


          <div>
            <label className="block  font-semibold text-gray-200 text-md  mb-1">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
               placeholder="Ingrese una descripción para la categoría"
              className="w-full shadow-sm border border-eggshell-creamy rounded-md px-3 py-2 text-gray-700 resize-none focus:ring-1 focus:ring-blood-300"
              rows={3}
            />
          </div>


          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="bg-blood-100 hover:bg-blood-300 text-white py-1 px-4 rounded-md"
            >
              Cancelar
            </button>

            <button type="submit" className="bg-blood-100 hover:bg-blood-300 text-white py-1 px-4 rounded-md">Crear Categoría</button>

          </div>

        </form>

      </DialogContent>

    </Dialog>
  );
};
