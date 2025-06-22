import React from "react";

interface TableFormProps {
  numero: number;
  capacidad: number;
  descripcion: string;
  onNumeroChange: (value: number) => void;
  onCapacidadChange: (value: number) => void;
  onDescripcionChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  submitLabel: string;
}

const TableForm = ({
  numero,
  capacidad,
  descripcion,
  onNumeroChange,
  onCapacidadChange,
  onDescripcionChange,
  onSubmit,
  onCancel,
  submitLabel,
}: TableFormProps) => {
  return (
    <form onSubmit={onSubmit}>
      <label className="block text-md font-semibold text-gray-200 mt-2 mb-1">Número de Mesa</label>
      <input
        type="text"
        value={numero}
        onChange={(e) => onNumeroChange(Number(e.target.value))}
        className="mt-2 w-full shadow-sm border border-eggshell-creamy rounded-md px-3 py-2 text-sm text-gray-800 outline-none focus:ring-1 focus:ring-blood-300"
      />

      <label className="block text-md font-semibold text-gray-200 mt-2 mb-1">Capacidad</label>
      <input
        type="text"
        value={capacidad}
        onChange={(e) => onCapacidadChange(Number(e.target.value))}
        className="mt-2 w-full shadow-sm border border-eggshell-creamy rounded-md px-3 py-2 text-sm text-gray-800 outline-none focus:ring-1 focus:ring-blood-300"
      />

      <label className="block text-md font-semibold text-gray-200 mt-2 mb-1">Ubicación</label>
      <input
        type="text"
        value={descripcion}
        onChange={(e) => onDescripcionChange(e.target.value)}
        className="mt-2 w-full shadow-sm border border-eggshell-creamy rounded-md px-3 py-2 text-sm text-gray-800 outline-none focus:ring-1 focus:ring-blood-300"
      />

      <div className="flex justify-end gap-2 mt-4">
        <button type="button" onClick={onCancel} className="bg-blood-100 hover:bg-blood-300 text-white py-1 px-4 rounded-md">
          Cancelar
        </button>
        <button type="submit" className="bg-blood-100 hover:bg-blood-300 text-white py-1 px-4 rounded-md">
          {submitLabel}
        </button>
      </div>
    </form>
  );
};

export default TableForm;
