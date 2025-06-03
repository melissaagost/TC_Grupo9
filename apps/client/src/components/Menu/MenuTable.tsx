import { useMenuLogic } from "../../hooks/useMenuLogic";
import { usePermisos } from "../../hooks/usePermisos";
import { Menu } from "../../types/menuTypes"

import Toast from "../UI/Toast";
import Search  from "../Menu/Search";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { EditDialog } from "../Menu/dialogs/EditDialog";
import { CreateDialog } from "../Menu/dialogs/CreateDialog";
import { Edit2, X, Check, MoreHorizontal, Plus } from "lucide-react";
import { TableLayout } from "../UI/Table";
const MenuTable = () => {

    const { tienePermiso } = usePermisos();

   const {
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
    } = useMenuLogic();


    return (
        <div className=" font-raleway flex flex-col lg:px-10 lg:py-0  py-10 px-0">

            {toastMessage && (
                <Toast
                    message={toastMessage}
                    type={toastType}
                    onClose={() => setToastMessage(null)}
                />
            )}

            {/*busqueda y filtro */}
            <Search onSearch={handleSearch} />

            {/*tabla*/}

            <div  className="overflow-x-auto w-full">

                 <TableLayout
                    title="Lista de Menús"
                    data={filteredMenus}
                    columns={[
                    {
                        key: "nombre",
                        label: "Nombre",
                        className: "font-semibold",
                    },
                    {
                        key: "descripcion",
                        label: "Descripción",
                    },
                    {
                        key: "estado",
                        label: "Estado",
                        render: (menu) =>
                        menu.estado ? (
                            <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-semibold">Activo</span>
                        ) : (
                            <span className="bg-gray-100 text-gray-400 px-3 py-1 rounded-full text-xs font-semibold">Inactivo</span>
                        ),
                    },
                    {
                        key: "productos",
                        label: "Productos",
                        render: (menu) => (
                        <span className="bg-eggshell-greekvilla px-3 py-1 rounded-full text-xs font-semibold">
                            {items.filter((item) => item.id_menu === menu.id_menu).length || "Sin productos"}
                        </span>
                        ),
                    },
                   ...(tienePermiso("editar_menu") ? [ {
                        key: "acciones",
                        label: "Acciones",
                        render: (menu: Menu) => (
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
                                onClick={() => {
                                resetForm();
                                openEditMenu(menu);
                                }}
                                className="flex items-center gap-2 px-4 py-2 text-gray-800 hover:bg-cream-100 w-full text-left cursor-pointer"
                            >
                                <Edit2 className="w-4 h-4" />
                                Editar
                            </DropdownMenu.Item>
                            <DropdownMenu.Item
                                onClick={() => toggleEstadoMenu(menu)}
                                className="flex items-center gap-2 px-4 py-2 w-full text-left cursor-pointer hover:bg-cream-100"
                            >
                                {menu.estado ? (
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
                        ),
                    },
                     ] : [])
                 ]}
            />

            </div>


            {tienePermiso("crear_menu") &&
                <button    onClick={() => {resetForm(); setIsCreating(true);}} className="font-semibold transition-all duration-300 hover:-translate-y-1 shadow-md px-4 py-2 ml-0 m-5 w-40 gap-1 inline-flex items-center bg-blood-100 text-white rounded-3xl hover:bg-blood-300"> <Plus size={'20'}/>Crear Menú</button>
            }

            {/*dialogo para crear */}
            <CreateDialog
                open={isCreating}
                onClose={() => setIsCreating(false)}
                onCreate={handleCreateMenu}
                />

            {/*dialogo para editar */}
            <EditDialog
            open={isEditing}
            onClose={() => setIsEditing(false)}
            onSave={handleSaveMenu}
            initialData={menuToEdit}
            />


        </div>
    );
};

export default MenuTable;
