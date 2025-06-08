//form que se usa en create y edit
import { useState } from "react";
import { MetodoPagoGuardarDTO } from "../../../types/paymentTypes";
import clsx from "clsx";

interface MethodsFormProps {
  initialValues?: MetodoPagoGuardarDTO;
  onSubmit: (data: MetodoPagoGuardarDTO) => void;
  mode: "create" | "edit";
}

const MethodsForm = ({ initialValues, onSubmit, mode }: MethodsFormProps) => {
  const [form, setForm] = useState<MetodoPagoGuardarDTO>({
    id_metodo: initialValues?.id_metodo,
    nombre: initialValues?.nombre ?? "",
    estado: initialValues?.estado ?? 1,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "estado" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={clsx(
        "space-y-4 p-4 rounded-xl shadow-md",
        mode === "create" ? "bg-green-50" : "bg-blue-50"
      )}
    >
      <div>
        <label className="block text-sm font-medium text-gray-700">Nombre</label>
        <input
          name="nombre"
          type="text"
          value={form.nombre}
          onChange={handleChange}
          required
          className="w-full mt-1 px-3 py-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Estado</label>
        <select
          name="estado"
          value={form.estado}
          onChange={handleChange}
          className="w-full mt-1 px-3 py-2 border rounded"
        >
          <option value={1}>Activo</option>
          <option value={0}>Inactivo</option>
        </select>
      </div>

      <button
        type="submit"
        className={clsx(
          "px-4 py-2 rounded font-semibold",
          mode === "create"
            ? "bg-green-500 text-white hover:bg-green-600"
            : "bg-blue-500 text-white hover:bg-blue-600"
        )}
      >
        {mode === "create" ? "Crear método" : "Guardar cambios"}
      </button>
    </form>
  );
};

export default MethodsForm;
