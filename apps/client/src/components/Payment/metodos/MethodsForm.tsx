//form que se usa en create y edit
import { useState } from "react";
import { MetodoPagoGuardarDTO } from "../../../types/paymentTypes";

interface MethodsFormProps {
  initialValues?: MetodoPagoGuardarDTO;
  onSubmit: (data: MetodoPagoGuardarDTO) => void;
  mode: "create" | "edit";
  onToast: (message: string, type: "success" | "error" | "info") => void;
}

const MethodsForm = ({ initialValues, onSubmit, mode, onToast }: MethodsFormProps) => {


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

    if (!form.nombre.trim()) {
    onToast('El campo nombre es obligatorio.', 'error');
    return;
    }


    if (form.estado !== 0 && form.estado !== 1) {
        onToast("El estado debe ser activo o inactivo", "error");
        return;
    }

    onSubmit(form);
    };


  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 mt-4 font-urbanist"

    >
      <div>
        <label className="font-semibold text-gray-200 text-md mb-1 block">Nombre</label>
        <input
          name="nombre"
          type="text"
          value={form.nombre}
          onChange={handleChange}
          required
          className="w-full shadow-md border border-gray-300 rounded-md px-3 py-2"
        />
      </div>

      <div>
        <label className="font-semibold text-gray-200 text-md mb-1 block">Estado</label>
        <select
          name="estado"
          value={form.estado}
          onChange={handleChange}
          className="w-full shadow-md border font-urbanist border-gray-300 rounded-md px-3 py-2"
        >
          <option value={1}>Activo</option>
          <option value={0}>Inactivo</option>
        </select>
      </div>

      <button
        type="submit"
        className="bg-blood-100 hover:bg-blood-300 text-white px-4 py-2 rounded-md"
      >
        {mode === "create" ? "Agregar método" : "Guardar cambios"}
      </button>


    </form>
  );
};

export default MethodsForm;
