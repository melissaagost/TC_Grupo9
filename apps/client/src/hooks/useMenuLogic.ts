// src/hooks/useMenuLogic.ts
import { useEffect, useState } from "react";
import { menuService } from "../services/menuService";
import { itemService } from "../services/itemService";
import { Menu, MenuDTO } from "../types/menuTypes";
import { ItemRowDTO } from "../types/itemTypes";
import axios from "axios";

export const useMenuLogic = () => {
  const token = localStorage.getItem("token") || "";

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error" | "info">("success");

  const [menus, setMenus] = useState<Menu[]>([]);
  const [filteredMenus, setFilteredMenus] = useState<Menu[]>([]);
  const [items, setItems] = useState<ItemRowDTO[]>([]);

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [estado, setEstado] = useState(false);

  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [menuToEdit, setMenuToEdit] = useState<Menu | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  //listar menus
  const fetchMenus = async () => {
    try {
      const data = await menuService.getAllMenus(token);
      setMenus(data);
      setFilteredMenus(data);
    } catch (error) {
      console.error("Error al cargar menús", error);
      setToastMessage("Hubo un error al cargar los menús.");
      setToastType("error");
    }
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
    fetchMenus();
    fetchItems();
  }, []);


  //bsuqueda
  const handleSearch = (term: string) => {
    const lower = term.toLowerCase();
    const filtered = menus.filter((menu) =>
      menu.nombre.toLowerCase().includes(lower) ||
      menu.descripcion.toLowerCase().includes(lower)
    );
    setFilteredMenus(filtered);
  };

  //crear menu
  const handleCreateMenu = async (newMenu: MenuDTO) => {
    if (!newMenu.nombre.trim() || !newMenu.descripcion.trim()) {
      setToastType("error");
      setToastMessage("Todos los campos son obligatorios.");
      return;
    }

    try {
      await menuService.createMenu(newMenu, token);
      const refreshed = await menuService.getAllMenus(token);
      setMenus(refreshed);
      setFilteredMenus(refreshed);
      setToastType("success");
      setToastMessage("Menú creado exitosamente.");
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setToastType("error");
        setToastMessage("Sesión expirada. Por favor, iniciá sesión nuevamente.");
      } else {
        const msg = error?.response?.data?.message || "Error al crear el menú.";
        setToastType("error");
        setToastMessage(msg);
      }
    }
  };

  //editar menu
  const openEditMenu = (menu: Menu) => {
    setMenuToEdit(menu);
    setIsEditing(true);
  };

  const handleSaveMenu = async (updatedMenu: MenuDTO) => {
    if (!updatedMenu.nombre.trim() || !updatedMenu.descripcion.trim()) {
      setToastType("error");
      setToastMessage("Todos los campos son obligatorios.");
      return;
    }

    if (
      updatedMenu.nombre.trim() === menuToEdit?.nombre.trim() &&
      updatedMenu.descripcion.trim() === menuToEdit?.descripcion.trim()
    ) {
      setToastType("info");
      setToastMessage("No hay cambios para guardar.");
      return;
    }

    try {
      await menuService.updateMenu(menuToEdit!.id_menu, updatedMenu, token);
      const refreshed = await menuService.getAllMenus(token);
      setMenus(refreshed);
      setFilteredMenus(refreshed);
      setToastType("success");
      setToastMessage("Menú actualizado correctamente.");
    } catch (error) {
      setToastType("error");
      setToastMessage("Ocurrió un error al guardar los cambios.");
    }
  };

  const resetForm = () => {
    setNombre("");
    setDescripcion("");
    setEstado(false);
  };

  //cambiar estado
  const toggleEstadoMenu = async (menu: Menu) => {
    try {
      if (menu.estado) {
        await menuService.disableMenu(menu.id_menu, token);
        setToastMessage("Menú desactivado correctamente");
      } else {
        await menuService.enableMenu(menu.id_menu, token);
        setToastMessage("Menú activado correctamente");
      }
      setToastType("success");
      const nuevosMenus = await menuService.getAllMenus(token);
      setMenus(nuevosMenus);
      setFilteredMenus(nuevosMenus);
    } catch (error) {
      console.error("Error al cambiar estado del menú", error);
      setToastMessage("Error al actualizar el estado del menú");
      setToastType("error");
    } finally {
      setActiveMenuId(null);
    }
  };

  return {
    token,
    toastMessage, setToastMessage,
    toastType, setToastType,
    menus, setMenus,
    filteredMenus, setFilteredMenus,
    items, setItems,
    nombre, setNombre,
    descripcion, setDescripcion,
    estado, setEstado,
    activeMenuId, setActiveMenuId,
    isEditing, setIsEditing,
    menuToEdit, setMenuToEdit,
    isCreating, setIsCreating,
    handleSearch,
    handleCreateMenu,
    openEditMenu,
    handleSaveMenu,
    resetForm,
    toggleEstadoMenu
  };
};
