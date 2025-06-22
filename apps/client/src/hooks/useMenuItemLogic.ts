// src/hooks/useMenuItemLogic.ts
import { useEffect, useMemo, useState } from "react";
import { itemService } from "../services/itemService";
import { menuService } from "../services/menuService";
import { categoryService } from "../services/categoryService";
import { ItemRowDTO, ItemGuardarDTO } from "../types/itemTypes";
import { CategoriaDTO } from "../types/categoryTypes";
import { Menu } from "../types/menuTypes";
import axios from "axios";

export const useMenuItemLogic = () => {
  const token = localStorage.getItem("token") || "";

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error" | "info">("success");

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const [menus, setMenus] = useState<Menu[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);

  const [items, setItems] = useState<ItemRowDTO[]>([]);
  const [itemToEdit, setItemToEdit] = useState<ItemRowDTO | null>(null);
  const [filteredItems, setFilteredItems] = useState<ItemRowDTO[]>([]);
  const [mostrarInactivos, setMostrarInactivos] = useState(false);

  const [categories, setCategories] = useState<CategoriaDTO[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<CategoriaDTO[]>([]);

  //listar menus
  useEffect(() => {
    const fetchMenus = async () => {
      const data = await menuService.getAllMenus(token);
      setMenus(data);
      setActiveMenuId(data[0]?.id_menu || null);
    };
    fetchMenus();
  }, [token]);

  //listar items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const estado = mostrarInactivos ? 0 : 1;
        const res = await itemService.listarItems({ estado });
        setItems(res.data);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
        setToastType("error");
        setToastMessage("Sesión expirada. Por favor, iniciá sesión nuevamente.");
      }
        console.error("Error al listar items:", err);
      }
    };
    fetchItems();
  }, [mostrarInactivos]);

  //recargar items
  const refreshItems = async () => {
    try {
      const estado = mostrarInactivos ? 0 : 1;
      const res = await itemService.listarItems({ estado });
      setItems(res.data);
      setFilteredItems(res.data);
    } catch (error) {
      console.error("Error al refrescar items:", error);
    }
  };

  //listar categorias
  const fetchCategories = async () => {
    const data = await categoryService.getAll();
    setCategories(data);
    setFilteredCategories(data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  //editar items
  const openEditItem = (item: ItemRowDTO) => {
    setItemToEdit(item);
    setShowEditDialog(true);
  };

  //crear item
  const handleCreateItem = async (item: ItemGuardarDTO) => {
    try {
      await itemService.guardar(item);
      await refreshItems();
      setShowCreateDialog(false);
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Error al crear el producto.";
      setToastType("error");
      setToastMessage(msg);
    }
  };

  //cambiar estado item
  const toggleEstadoItem = async (item: ItemRowDTO) => {
    try {
      if (item.estado) {
        await itemService.deshabilitar(item.id_item);
        await refreshItems();
        setToastMessage("Item desactivado correctamente");
      } else {
        await itemService.habilitar(item.id_item);
        await refreshItems();
        setToastMessage("Menú activado correctamente");
      }
      setToastType("success");
    } catch (error) {
      const msg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Error al actualizar el estado del ítem";
      setToastMessage(msg);
      setToastType("error");
      console.error("Error al cambiar estado del ítem:", error);
    }
  };

  //muestra productos segun menu
  const productosFiltrados = useMemo(() => {
    if (activeMenuId === null) return [];
    return items.filter(item => item.id_menu === activeMenuId);
  }, [items, activeMenuId]);

  return {
    token,
    toastMessage, setToastMessage,
    toastType, setToastType,
    showCreateDialog, setShowCreateDialog,
    showEditDialog, setShowEditDialog,
    menus, activeMenuId, setActiveMenuId,
    items, itemToEdit, setItemToEdit,
    filteredItems, setFilteredItems,
    mostrarInactivos, setMostrarInactivos,
    categories, filteredCategories,
    openEditItem,
    handleCreateItem,
    toggleEstadoItem,
    refreshItems,
    productosFiltrados
  };
};