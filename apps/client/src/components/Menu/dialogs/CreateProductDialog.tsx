import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../UI/Dialog";
import * as Switch from "@radix-ui/react-switch";
import { ItemGuardarDTO } from "../../../types/itemTypes"; // definí este DTO si aún no existe

interface CreateItemDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (item: ItemGuardarDTO) => void;
  categorias: { id: number; nombre: string }[];
  id_menu: number;
}

export const CreateItemDialog = ({
  open,
  onClose,
  onCreate,
  categorias,
  id_menu,
}: CreateItemDialogProps) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [id_categoria, setIdCategoria] = useState<number>(0);
  const [estado, setEstado] = useState(true);

  const resetForm = () => {
    setNombre("");
    setDescripcion("");
    setPrecio(0);
    setStock(0);
    setIdCategoria(0);
    setEstado(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({
      nombre,
      descripcion,
      precio,
      stock,
      estado: estado ? 1 : 0,
      id_categoria,
      id_menu,
    });
    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={() => { resetForm(); onClose(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Producto</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">

          <div>
            <label className="font-semibold  text-gray-200 text-md mb-1 block">Nombre</label>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ingrese el nombre del producto"
              className="w-full shadow-sm border border-eggshell-creamy rounded-md px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="font-semibold  text-gray-200 text-md mb-1 block">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Ingrese una descripción para el producto"
              className="w-full shadow-sm border border-eggshell-creamy rounded-md px-3 py-2 resize-none"
              rows={3}
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-semibold text-gray-200 text-md mb-1">Precio</label>
              <input
                type="number"
                value={precio}
                onChange={(e) => setPrecio(parseFloat(e.target.value))}
                className="w-full shadow-sm border text-gray-200 border-eggshell-creamy rounded-md px-3 py-2"
              />
            </div>
            <div className="flex-1">
              <label className="block font-semibold text-gray-200 text-md mb-1">Stock</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(parseInt(e.target.value))}
                className="w-full shadow-sm border text-gray-200 border-eggshell-creamy rounded-md px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-200 text-md mb-1">Categoría</label>
            <select
              value={id_categoria}
              onChange={(e) => setIdCategoria(Number(e.target.value))}
              className="w-full shadow-sm border text-gray-200 border-eggshell-creamy rounded-md px-3 py-2"
              required
            >
              <option value={0} disabled>Seleccionar categoría</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold  text-gray-200 text-md mb-1">Estado</label>
            <div className="flex  shadow-sm items-center gap-2 p-3 border border-eggshell-creamy rounded-md">
              <span className="text-gray-200 text-sm">
                {estado ? "Activo" : "Inactivo"}
              </span>
              <Switch.Root
                checked={estado}
                onCheckedChange={setEstado}
                className="ml-auto  w-11 h-6 bg-gray-300 rounded-full relative data-[state=checked]:bg-blood-100 transition-colors"
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
              onClick={() => {resetForm(); onClose();}}
              className="bg-blood-100 hover:bg-blood-300 text-white py-1 px-4 rounded-md"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blood-100 hover:bg-blood-300 text-white px-4 py-2 rounded-md"
            >
              Agregar Producto
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
