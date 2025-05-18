// src/hooks/useTableLogic.ts
import { useEffect, useState } from "react";
import { getAllMesas, updateMesa, createMesa } from "../services/tableService";
import axios from "axios";

export const useTableLogic = () => {
  const [mesas, setMesas] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [numero, setNumero] = useState<number>(0);
  const [capacidad, setCapacidad] = useState<number>(0);
  const [descripcion, setDescripcion] = useState<string>("");
  const [idRestaurante, setIdRestaurante] = useState<number>(1);

  const [editingMesa, setEditingMesa] = useState<any | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editNumero, setEditNumero] = useState<number>(0);
  const [editCapacidad, setEditCapacidad] = useState<number>(0);
  const [editDescripcion, setEditDescripcion] = useState<string>("");

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error" | "info">("success");

  const fetchMesas = async () => {
    try {
      const data = await getAllMesas();
      setMesas(data);
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
        setToastType("error");
        setToastMessage("Sesión expirada. Por favor, iniciá sesión nuevamente.");
      }
      console.error("Error fetching mesas:", error);
    }
  };

  useEffect(() => {
    fetchMesas();
  }, []);

  const handleCreateMesa = async (e: React.FormEvent) => {
    e.preventDefault();

    if (numero <= 0 || capacidad <= 0 || descripcion.trim() === "") {
      setToastMessage("Por favor completa todos los campos antes de crear");
      setToastType("info");
      return;
    }

    try {
      await createMesa({ numero, capacidad, descripcion, id_restaurante: idRestaurante });
      setIsCreating(false);
      fetchMesas();
      setNumero(0);
      setCapacidad(0);
      setDescripcion("");
      setToastMessage("Mesa creada exitosamente");
      setToastType("success");
    } catch (error) {
      console.error("Error al crear mesa", error);
      setToastMessage("Error al crear mesa");
      setToastType("error");
    }
  };

  const handleUpdateMesa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMesa) return;

    if (
      editingMesa.numero === editNumero &&
      editingMesa.capacidad === editCapacidad &&
      editingMesa.descripcion === editDescripcion
    ) {
      setToastMessage("No hay cambios para guardar");
      setToastType("info");
      return;
    }

    try {
      await updateMesa(editingMesa.id_mesa, {
        numero: editNumero,
        capacidad: editCapacidad,
        descripcion: editDescripcion,
        id_restaurante: 1,
      });

      setToastMessage("Mesa actualizada correctamente");
      setToastType("success");
      fetchMesas();
      setEditingMesa(null);
    } catch (error) {
      console.error("Error al actualizar mesa", error);
      setToastMessage("Error al actualizar mesa");
      setToastType("error");
    }
  };

  const startEditingMesa = (mesa: any) => {
    setEditingMesa(mesa);
    setEditNumero(mesa.numero);
    setEditCapacidad(mesa.capacidad);
    setEditDescripcion(mesa.descripcion);
  };

  const filteredMesas = mesas.filter((mesa) => {
    const search = searchTerm.toLowerCase();
    const numero = mesa.numero.toString();
    const descripcion = mesa.descripcion.toLowerCase();
    const estado =
      mesa.estado === 0 ? "libre" :
      mesa.estado === 1 ? "ocupado" :
      mesa.estado === 2 ? "reservado" : "desconocido";

    return (
      numero.includes(search) ||
      descripcion.includes(search) ||
      estado.includes(search)
    );
  });

  return {
    mesas, setMesas,
    searchTerm, setSearchTerm,
    numero, setNumero,
    capacidad, setCapacidad,
    descripcion, setDescripcion,
    idRestaurante, setIdRestaurante,
    editingMesa, setEditingMesa,
    isCreating, setIsCreating,
    editNumero, setEditNumero,
    editCapacidad, setEditCapacidad,
    editDescripcion, setEditDescripcion,
    toastMessage, setToastMessage,
    toastType, setToastType,
    fetchMesas,
    handleCreateMesa,
    handleUpdateMesa,
    startEditingMesa,
    filteredMesas
  };
};
