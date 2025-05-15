import { useState } from "react";
import { MenuDTO } from "../../../types/menuTypes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../UI/Dialog";
import * as Switch from "@radix-ui/react-switch";



interface CreateDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (newMenu: MenuDTO) => void;
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
      estado: estado ? 1 : 0,
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
               placeholder="Asigne un nombre al menú"
              className="w-full shadow-sm border border-eggshell-creamy rounded-md px-3 py-2 text-gray-800 outline-none focus:ring-1 focus:ring-blood-300"
              required
            />
          </div>


          <div>
            <label className="block  font-semibold text-gray-200 text-md  mb-1">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
               placeholder="Ingrese una descripción para el menú"
              className="w-full shadow-sm border border-eggshell-creamy rounded-md px-3 py-2 text-gray-700 resize-none focus:ring-1 focus:ring-blood-300"
              rows={3}
            />
          </div>



          <div>
            <label className="block  font-semibold text-gray-200 text-md  mb-1">Estado</label>

            <div className="flex items-center gap-2 p-3 border border-eggshell-creamy shadow-sm rounded-md">

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
                resetForm();
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
