import { ItemRowDTO, ItemGuardarDTO } from '../../types/itemTypes'
import { itemService } from '../../services/itemService'
import { useState, useEffect, useMemo } from 'react';
import { Menu } from "../../types/menuTypes";
import { menuService } from "../../services/menuService";
import { categoryService } from "../../services/categoryService";
import { CategoriaDTO} from "../../types/categoryTypes";
import axios from "axios";


import Toast from "../UI/Toast";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { X, Check, Edit2, MoreHorizontal, Plus, LucideEdit } from 'lucide-react'
import { EditItemDialog } from "./dialogs/EditProductDialog";
import { CreateItemDialog } from './dialogs/CreateProductDialog';
import { Link } from "react-router-dom";
import * as Switch from "@radix-ui/react-switch";



const MenuItemTable = () => {

    const token = localStorage.getItem("token") || "";

    //toast
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [toastType, setToastType] = useState<"success" | "error" | "info">("success");

    //dialogs
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);

    //menus
    const [menus, setMenus] = useState<Menu[]>([]);
    const [activeMenuId, setActiveMenuId] = useState<number | null>(null);

    //items
    const [items, setItems] = useState<ItemRowDTO[]>([]);
    const [itemToEdit, setItemToEdit] = useState<ItemRowDTO | null>(null);
    const [filteredItems, setFilteredItems] = useState<ItemRowDTO[]>([]);
    const [mostrarInactivos, setMostrarInactivos] = useState(false);


    //categoria
    const [categories, setCategories] = useState<CategoriaDTO[]>([]);
    const [filteredCategories, setFilteredCategories] = useState<CategoriaDTO[]>([]);


    //listar menus
    useEffect(() => {
    const fetchMenus = async () => {
        const data = await menuService.getAllMenus(token);
        setMenus(data);
        setActiveMenuId(data[0]?.id_menu || null); // selecciona el primero por defecto
    };

    fetchMenus();
    }, []);

    //listar items
    useEffect(() => {
    const fetchItems = async () => {
        try {
        const estado = mostrarInactivos ? 0 : 1; // 👈 clave: cuando está activado, pedimos los inactivos
        const res = await itemService.listarItems({ estado });
        setItems(res.data); // o res.data.data si tu respuesta está paginada
        } catch (err) {
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

    //setear activo / inactivo
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


        }catch (error) {
        const msg =
            axios.isAxiosError(error) && error.response?.data?.message
            ? error.response.data.message
            : "Error al actualizar el estado del ítem";

            setToastMessage(msg);
            setToastType("error");
            console.error("Error al cambiar estado del ítem:", error);
        }
    };

    //filtra prod/items activos segun boton selec
    const productosFiltrados = useMemo(() => {
    if (activeMenuId === null) return [];
    return items.filter(item => item.id_menu === activeMenuId);
    }, [items, activeMenuId]);



    return (
        <div className=" font-raleway flex flex-col lg:px-10 lg:py-0  py-10 px-0">

            {/*msjs */}

            {toastMessage && (
                <Toast
                    message={toastMessage}
                    type={toastType}
                    onClose={() => setToastMessage(null)}
                />
            )}


            {/*filtro de menu */}
            <div className="flex flex-wrap gap-4 mb-6 bg-eggshell-greekvilla lg:w-120 text-gray-200 p-2 rounded-lg">

                {menus.map((menu) => (
                    <button
                    key={menu.id_menu}
                    onClick={() => setActiveMenuId(menu.id_menu)}
                    className={`px-4 py-1 rounded-md text-sm font-semibold transition ${
                        activeMenuId === menu.id_menu ? "bg-eggshell-whitedove text-charcoal-800 shadow" : "text-charcoal-400 hover:text-charcoal-600"
                    }`}
                    >
                    {menu.nombre}
                    </button>
                ))}

            </div>

                {/*tabla */}
                {activeMenuId !== null && (

                    <div  className="overflow-x-auto w-full">

                        <h3 className="text-xl font-playfair text-gray-charcoal font-semibold mt-4 mb-2">
                            Productos del {menus.find((m) => m.id_menu === activeMenuId)?.nombre}
                        </h3>


                       <div className="flex items-center gap-4 mb-4">
                        <span className="text-sm text-gray-600">Mostrar inactivos</span>
                        <Switch.Root
                            checked={mostrarInactivos}
                            onCheckedChange={setMostrarInactivos}
                            className="w-11 h-6 bg-gray-300 rounded-full relative data-[state=checked]:bg-blood-100 transition-colors"
                        >
                            <Switch.Thumb
                            className="block w-5 h-5 bg-white rounded-full shadow-md transition-transform translate-x-1 data-[state=checked]:translate-x-6"
                            />
                        </Switch.Root>
                        </div>



                        <table className="w-full bg-white font-urbanist rounded-xl shadow">
                            <thead>
                                <tr className="text-left lg:text-lg sm:text-base text-gray-500">
                                    <th className="px-4 py-2">Nombre</th>
                                    <th className="px-4 py-2">Descripción</th>
                                    <th className="px-4 py-2">Precio</th>
                                    <th className="px-4 py-2">Stock</th>
                                    <th className="px-4 py-2">Categoría</th>
                                    <th className="px-4 py-2">Estado</th>
                                    <th className="px-4 py-2">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">

                            {productosFiltrados.length > 0 ? ( productosFiltrados.map((item) => (

                                <tr key={item.id_item} className="border-t border-gray-100 hover:bg-gray-50">
                                    <td className="px-4 py-4 font-semibold">{item.nombre}</td>
                                    <td className="px-4 py-4">{item.descripcion}</td>
                                    <td className="px-4 py-4">${item.precio}</td>
                                    <td className="px-4 py-4">{item.stock}</td>
                                    <td className="px-4 py-4">{item.nombre_categoria}</td>
                                    <td className="px-4 py-2">
                                        <span
                                            className={`px-3 py-1 text-xs font-medium rounded-full ${
                                            item.estado
                                                ? "bg-green-100 text-green-600"
                                                : "bg-gray-100 text-gray-400"
                                            }`}
                                        >
                                            {item.estado ? "Activo" : "Inactivo"}
                                        </span>
                                    </td>

                                    {/*acciones*/}
                                    <td className="px-4 py-4 relative">
                                <DropdownMenu.Root>
                                    <DropdownMenu.Trigger asChild>
                                    <button className="ml-6 w-8 h-8 flex items-center justify-center rounded-4xl bg-white text-burgundy hover:bg-cream-100">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                    </DropdownMenu.Trigger>

                                    <DropdownMenu.Content
                                    align="end"
                                    sideOffset={8}
                                    className="z-50 bg-white border border-eggshell-creamy rounded-md shadow-md animate-fade-in"
                                    >
                                    <DropdownMenu.Item
                                            onClick={() => openEditItem(item)}
                                        className="flex items-center gap-2 px-4 py-2 text-gray-800 hover:bg-cream-100 w-full text-left cursor-pointer"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        Editar
                                    </DropdownMenu.Item>

                                    <DropdownMenu.Item
                                        onClick={() => {toggleEstadoItem(item);}}
                                        className="flex items-center gap-2 px-4 py-2 w-full text-left cursor-pointer hover:bg-cream-100"
                                    >

                                        {item.estado ? (
                                        <>
                                            <X className="w-4 h-4 text-red-500" />
                                            <span className="text-red-500">Desactivar</span>
                                        </>
                                        ) : (
                                        <>
                                            <Check className="w-4 h-4 text-green-600" />
                                            <span className="text-green-600">Activar</span>
                                        </>
                                        )}
                                    </DropdownMenu.Item>
                                    </DropdownMenu.Content>
                                </DropdownMenu.Root>
                                </td>

                                </tr>))

                                ) : (

                                    <tr>
                                        <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                                            No hay productos en este menú
                                        </td>
                                    </tr>

                                )}

                            </tbody>

                        </table>

                    </div>

                )}

        <div className='lg:inline-flex gap-1'>
            <button onClick={() => setShowCreateDialog(true)} className="font-semibold transition-all duration-300 hover:-translate-y-1 shadow-md px-4 py-2 ml-0 m-5 w-50 gap-1 inline-flex items-center bg-blood-100 text-white rounded-3xl hover:bg-blood-300"> <Plus size={'20'}/>Agregar Producto</button>
           <Link to="/categories">
                <button onClick={() => setShowCreateDialog(true)} className="font-semibold  transition-all duration-300 hover:-translate-y-1 shadow-md px-4 py-2 ml-0 m-5 w-58 gap-2 inline-flex items-center bg-blood-100 text-white rounded-3xl hover:bg-blood-300"><LucideEdit size={'20'}/>Gestionar Categorías</button>
           </Link>
        </div>

            <CreateItemDialog
                open={showCreateDialog}
                onClose={() => setShowCreateDialog(false)}
                onCreate={handleCreateItem}
                categorias={categories.map(cat => ({
                id: cat.id_categoria,
                nombre: cat.nombre,
                }))}
                id_menu={activeMenuId ?? 1}
                setToastType={setToastType}
                setToastMessage={setToastMessage}
            />


            <EditItemDialog
                open={showEditDialog}
                onClose={() => setShowEditDialog(false)}
                onSave={async (item: ItemGuardarDTO) => {
                    try {
                    await itemService.guardar(item);
                    await refreshItems();
                    } catch (error) {
                    console.error("Error al guardar", error);
                    } finally {
                    setShowEditDialog(false);
                    }
                }}
                initialData={itemToEdit}
                categorias={categories.map(cat => ({
                    id: cat.id_categoria,
                    nombre: cat.nombre
                }))}
                setToastMessage={setToastMessage}
                setToastType={setToastType}
                />



        </div>

    );

};

export default MenuItemTable;