import React from "react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../UI/Dialog";
import * as Switch from "@radix-ui/react-switch";
import { ItemGuardarDTO, ItemRowDTO } from "../../../types/itemTypes";

  interface EditItemDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (updatedItem: ItemGuardarDTO) => void;
    initialData: ItemRowDTO | null;
    categorias: { id: number; nombre: string }[];
  }

  export const EditItemDialog = ({
    open,
    onClose,
    onSave,
    initialData,
    categorias,
  }:
  EditItemDialogProps) => {
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [precio, setPrecio] = useState<number>(0);
    const [stock, setStock] = useState<number>(0);
    const [id_categoria, setIdCategoria] = useState<number>(0);
    const [estado, setEstado] = useState(true);

    useEffect(() => {
      if (initialData) {
        setNombre(initialData.nombre);
        setDescripcion(initialData.descripcion);
        setPrecio(initialData.precio);
        setStock(initialData.stock);
        const categoriaMatch = categorias.find(
          (cat) => cat.nombre === initialData.nombre_categoria
        );
        setIdCategoria(categoriaMatch?.id || 0);
        setEstado(initialData.estado === 1);
      }
    }, [initialData]);


    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!initialData) return;
      onSave({
            id_item: initialData.id_item,
            nombre,
            descripcion,
            precio,
            stock,
            estado: estado ? 1 : 0,
            id_categoria,
            id_menu: initialData.id_menu,
            //total_rows: initialData.total_rows
          });

        };

    return (
      <Dialog open={open} onClose={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Producto</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
            <div>
              <label className="block font-semibold text-gray-200 text-md mb-1">Nombre</label>
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full shadow-md border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-200 text-md mb-1">Descripción</label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full shadow-md border border-gray-300 rounded-md px-3 py-2 resize-none"
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
                  className="w-full shadow-md border text-gray-200  border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div className="flex-1">
                <label className="block font-semibold text-gray-200 text-md mb-1">Stock</label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(parseInt(e.target.value))}
                  className="w-full shadow-md border text-gray-200  border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-200 text-md mb-1">Categoría</label>
              <select
                value={id_categoria}
                onChange={(e) => setIdCategoria(Number(e.target.value))}
                className="w-full shadow-md border text-gray-200  border-gray-300 rounded-md px-3 py-2"
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
              <label className="block font-semibold text-gray-200 mb-1">Estado</label>
              <div className="flex items-center  shadow-md gap-2 p-3 border border-gray-300 rounded-md">
                <span className="text-gray-200 text-sm">{estado ? "Activo" : "Inactivo"}</span>
                <Switch.Root
                  checked={estado}
                  onCheckedChange={setEstado}
                  className="ml-auto w-11 h-6 bg-gray-200 rounded-full relative data-[state=checked]:bg-blood-100 transition-colors"
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
                onClick={() => {onClose();}}
                className="bg-blood-100 hover:bg-blood-300 text-white py-1 px-4 rounded-md"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-blood-100 hover:bg-blood-300 text-white px-4 py-2 rounded-md"
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  };
