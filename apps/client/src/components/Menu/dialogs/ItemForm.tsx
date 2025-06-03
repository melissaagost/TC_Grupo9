
import React, { useState, useEffect } from "react";
import { ItemGuardarDTO, ItemRowDTO } from "../../../types/itemTypes";
import axios from "axios";


interface Props {
  initialValues?: ItemRowDTO;
  categorias: { id: number; nombre: string }[];
  id_menu: number;
  onSubmit: (item: ItemGuardarDTO) => Promise<void>;
  onCancel: () => void;
  setToastType: (type: "success" | "error" | "info") => void;
  setToastMessage: (msg: string) => void;
  mode: "create" | "edit";
}

export const ItemForm: React.FC<Props> = ({
  initialValues,
  categorias,
  id_menu,
  onSubmit,
  onCancel,
  setToastType,
  setToastMessage,
  mode,
}) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [id_categoria, setIdCategoria] = useState<number>(0);
  const [estado, setEstado] = useState(true);

  useEffect(() => {
    if (initialValues) {
      setNombre(initialValues.nombre);
      setDescripcion(initialValues.descripcion);
      setPrecio(initialValues.precio);
      setStock(initialValues.stock);
      setIdCategoria(initialValues.id_categoria);
      setEstado(initialValues.estado === 1);
    } else {
      resetForm();
    }
  }, [initialValues]);

  const resetForm = () => {
    setNombre("");
    setDescripcion("");
    setPrecio(0);
    setStock(0);
    setIdCategoria(0);
    setEstado(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

        if (!nombre.trim() || !descripcion.trim()) {
            setToastType("error");
            setToastMessage("Todos los campos son obligatorios.");
            return;
        }

        if (isNaN(precio) || precio <= 0) {
            setToastType("error");
            setToastMessage("El precio debe ser un número mayor a 0.");
            return;
        }

        if (isNaN(stock) || stock < 0) {
            setToastType("error");
            setToastMessage("El stock no puede ser negativo.");
            return;
        }

        if (id_categoria === 0) {
            setToastType("error");
            setToastMessage("Seleccioná una categoría válida.");
            return;
        }
       const nuevoItem: ItemGuardarDTO = {
        ...(mode === "edit" && initialValues?.id_item
            ? { id_item: initialValues.id_item }
            : {}),
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        precio: Number(precio),
        stock: Number(stock),
        estado: estado ? 1 : 0,
        id_categoria: Number(id_categoria),
        id_menu: Number(id_menu),
        };


    // Solo para editar: evitar guardar si no hay cambios
    if (mode === "edit" && initialValues) {
      const sinCambios =
        nombre.trim() === initialValues.nombre &&
        descripcion.trim() === initialValues.descripcion &&
        precio === initialValues.precio &&
        stock === initialValues.stock &&
        estado === (initialValues.estado === 1) &&
        id_categoria === initialValues.id_categoria;

      if (sinCambios) {
        setToastType("info");
        setToastMessage("No hay cambios para guardar.");
        return;
      }
    }

   try {
        await onSubmit(nuevoItem);
        setToastType("success");
        setToastMessage(
            mode === "edit"
            ? "Producto actualizado correctamente."
            : "Producto creado correctamente."
        );
        resetForm();
        onCancel();
        } catch (error: any) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                setToastType("error");
                setToastMessage("Sesión expirada. Por favor, iniciá sesión nuevamente.");
                window.location.href = "/login";
                return;
            }

            const msg = error?.response?.data?.message || "Error al guardar.";
            setToastType("error");
            setToastMessage(Array.isArray(msg) ? msg.join(" ") : msg);
            }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
      {/* Nombre */}
      <div>
        <label className="font-semibold text-gray-200 text-md mb-1 block">Nombre</label>
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full shadow-md border border-gray-300 rounded-md px-3 py-2"
          required
        />
      </div>

      {/* Descripción */}
      <div>
        <label className="font-semibold text-gray-200 text-md mb-1 block">Descripción</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="w-full shadow-md border border-gray-300 rounded-md px-3 py-2 resize-none"
          rows={3}
          required
        />
      </div>

      {/* Precio y Stock */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block font-semibold text-gray-200 text-md mb-1">Precio</label>
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={precio}
            onChange={(e) => {const value = e.target.value; setPrecio(value === "" ? 0 : Number(value));}}
            className="w-full shadow-md border text-gray-200 border-gray-300 rounded-md px-3 py-2"
            required
          />
        </div>
        <div className="flex-1">
          <label className="block font-semibold text-gray-200 text-md mb-1">Stock</label>
          <input
            type="number"
            min="0"
            value={stock}
            onChange={(e) => setStock(parseInt(e.target.value))}
            className="w-full shadow-md border text-gray-200 border-gray-300 rounded-md px-3 py-2"
            required
          />
        </div>
      </div>

      {/* Categoría */}
      <div>
        <label className="block font-semibold text-gray-200 text-md mb-1">Categoría</label>
        <select
          value={id_categoria}
          onChange={(e) => setIdCategoria(Number(e.target.value))}
          className="w-full shadow-md border text-gray-200 border-gray-300 rounded-md px-3 py-2"
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

      {/* Botones */}
      <div className="flex justify-end gap-2 mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="bg-blood-100 hover:bg-blood-300 text-white py-1 px-4 rounded-md"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="bg-blood-100 hover:bg-blood-300 text-white px-4 py-2 rounded-md"
        >
          {mode === "edit" ? "Guardar Cambios" : "Agregar Producto"}
        </button>
      </div>
    </form>
  );
};
