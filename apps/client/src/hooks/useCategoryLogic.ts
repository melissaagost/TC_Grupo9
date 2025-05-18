// src/hooks/useCategoryLogic.ts
import { useState, useEffect } from "react";
import { categoryService } from "../services/categoryService";
import { itemService } from "../services/itemService";
import { CategoriaDTO, CategoriaCrearDTO, CategoriaActualizarDTO } from "../types/categoryTypes";
import { ItemRowDTO } from "../types/itemTypes";
import axios from "axios";

export const useCategoryLogic = () => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error" | "info">("success");

  const [categories, setCategories] = useState<CategoriaDTO[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<CategoriaDTO[]>([]);

  const [isEditing, setIsEditing] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<CategoriaDTO | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [items, setItems] = useState<ItemRowDTO[]>([]);

   //listar categorias
    const fetchCategories = async () => {
        const data = await categoryService.getAll();
        setCategories(data);
        setFilteredCategories(data);
    };


    //listar items
    const fetchItems = async () => {
        try {
        const res = await itemService.listarItems();
        setItems(res.data);
        } catch (err) {
        console.error("Error al listar items:", err);
        }
    };

  useEffect(() => {
    fetchCategories();
    fetchItems();
  }, []);

  const handleCreateCategory = async (newCategory: CategoriaCrearDTO) => {
    try {
      await categoryService.create(newCategory);
      const refreshed = await categoryService.getAll();
      setCategories(refreshed);
      setFilteredCategories(refreshed);
      setIsCreating(false);

      setToastType("success");
      setToastMessage("Categoría creada exitosamente.");
    } catch (error) {
      let msg = "Error inesperado al crear la categoría";
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          msg = "No autorizado. Iniciá sesión nuevamente.";
        } else {
          const rawMsg = error.response?.data?.message;
          msg = Array.isArray(rawMsg) ? rawMsg.join(" - ") : rawMsg || msg;
        }
      }
      setToastType("error");
      setToastMessage(msg);
    }
  };

  //editar
  const openEditCategory = (category: CategoriaDTO) => {
    setCategoryToEdit(category);
    setIsEditing(true);
  };

  const handleSaveCategory = async (updatedCategory: CategoriaActualizarDTO) => {
    if (
      updatedCategory.nombre.trim() === categoryToEdit?.nombre.trim() &&
      updatedCategory.descripcion.trim() === categoryToEdit?.descripcion.trim()
    ) {
      setToastType("info");
      setToastMessage("No hay cambios para guardar.");
      return;
    }

    if (!updatedCategory.nombre.trim() || !updatedCategory.descripcion.trim()) {
      setToastType("error");
      setToastMessage("Todos los campos son obligatorios.");
      return;
    }

    try {
      await categoryService.update(categoryToEdit!.id_categoria, updatedCategory);
      const refreshed = await categoryService.getAll();
      setCategories(refreshed);
      setFilteredCategories(refreshed);
      setIsEditing(false);
      setToastType("success");
      setToastMessage("Categoría modificada exitosamente.");
    } catch (error) {
      setToastType("error");
      setToastMessage("Error al modificar la categoría.");
    }
  };

  //cambair estado
  const toggleEstadoCategory = async (category: CategoriaDTO) => {
    try {
      if (category.estado === 1) {
        await categoryService.disable(category.id_categoria);
      } else {
        await categoryService.enable(category.id_categoria);
      }
      const newCategories = await categoryService.getAll();
      setCategories(newCategories);
      setFilteredCategories(newCategories);
      setToastType("success");
      setToastMessage(
        category.estado === 1
          ? "Categoría desactivada correctamente"
          : "Categoría activada correctamente"
      );
    } catch (error) {
      setToastType("error");
      setToastMessage("Error al actualizar el estado de la categoría");
    }
  };

  //busqueda
  const handleSearch = (term: string) => {
    const lower = term.toLowerCase();
    const filtered = categories.filter((category) =>
      category.nombre.toLowerCase().includes(lower) ||
      category.descripcion.toLowerCase().includes(lower)
    );
    setFilteredCategories(filtered);
  };

  return {
    toastMessage, setToastMessage,
    toastType, setToastType,
    categories,
    filteredCategories, setFilteredCategories,
    isEditing, setIsEditing,
    isCreating, setIsCreating,
    categoryToEdit, setCategoryToEdit,
    items,
    handleCreateCategory,
    openEditCategory,
    handleSaveCategory,
    toggleEstadoCategory,
    handleSearch,
    fetchCategories
  };
};
