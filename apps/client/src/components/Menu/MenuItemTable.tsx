import { ItemRowDTO, ItemGuardarDTO } from '../../types/itemTypes'
import { useMenuItemLogic } from "../../hooks/useMenuItemLogic";
import { itemService } from '../../services/itemService'
import { usePermisos } from "../../hooks/usePermisos";

import Toast from "../UI/Toast";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { X, Check, Edit2, MoreHorizontal, Plus, LucideEdit } from 'lucide-react'
import { EditItemDialog } from "./dialogs/EditProductDialog";
import { CreateItemDialog } from './dialogs/CreateProductDialog';
import { Link } from "react-router-dom";
import * as Switch from "@radix-ui/react-switch";
import { TableLayout } from "../UI/Table";



const MenuItemTable = () => {

    const { tienePermiso } = usePermisos();

    const {
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
    } = useMenuItemLogic();

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
            <div className="overflow-x-auto w-full">

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
                    <Switch.Thumb className="block w-5 h-5 bg-white rounded-full shadow-md transition-transform translate-x-1 data-[state=checked]:translate-x-6" />
                </Switch.Root>
                </div>

                <TableLayout
                data={productosFiltrados}
                emptyMessage="No hay productos en este menú"
                columns={[
                    { key: "nombre", label: "Nombre", className: "font-semibold" },
                    { key: "descripcion", label: "Descripción" },
                    {
                    key: "precio",
                    label: "Precio",
                    render: (item) => `$${item.precio}`
                    },
                    { key: "stock", label: "Stock" },
                    { key: "nombre_categoria", label: "Categoría" },
                    {
                    key: "estado",
                    label: "Estado",
                    render: (item) => (
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${item.estado ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                        {item.estado ? "Activo" : "Inactivo"}
                        </span>
                    )
                    },
                    {
                    key: "acciones",
                    label: "Acciones",
                    render: (item) => (
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
                            {tienePermiso("editar_producto") &&
                            <DropdownMenu.Item
                            onClick={() => openEditItem(item)}
                            className="flex items-center gap-2 px-4 py-2 text-gray-800 hover:bg-cream-100 w-full text-left cursor-pointer"
                            >
                            <Edit2 className="w-4 h-4" />
                            Editar
                            </DropdownMenu.Item>
                            }
                            <DropdownMenu.Item
                            onClick={() => toggleEstadoItem(item)}
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
                    )
                    }
                ]}
                />
            </div>
            )}


        {tienePermiso("añadir_producto") &&
        <div className='lg:inline-flex gap-1'>
            <button onClick={() => setShowCreateDialog(true)} className="font-semibold transition-all duration-300 hover:-translate-y-1 shadow-md px-4 py-2 ml-0 m-5 w-50 gap-1 inline-flex items-center bg-blood-100 text-white rounded-3xl hover:bg-blood-300"> <Plus size={'20'}/>Agregar Producto</button>
           <Link to="/categories">
                <button onClick={() => setShowCreateDialog(true)} className="font-semibold  transition-all duration-300 hover:-translate-y-1 shadow-md px-4 py-2 ml-0 m-5 w-58 gap-2 inline-flex items-center bg-blood-100 text-white rounded-3xl hover:bg-blood-300"><LucideEdit size={'20'}/>Gestionar Categorías</button>
           </Link>
        </div>
        }
            <CreateItemDialog
                open={showCreateDialog}
                onClose={() => setShowCreateDialog(false)}
                onCreate={handleCreateItem}
                categorias={categories.map(cat => ({
                id: cat.id_categoria,
                nombre: cat.nombre,
                }))}
                menus={menus.map(menu => ({
                    id: menu.id_menu,
                    nombre: menu.nombre,
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
                menus={menus.map(menu => ({
                    id: menu.id_menu,
                    nombre: menu.nombre,
                }))}
                setToastMessage={setToastMessage}
                setToastType={setToastType}
                />



        </div>

    );

};

export default MenuItemTable;