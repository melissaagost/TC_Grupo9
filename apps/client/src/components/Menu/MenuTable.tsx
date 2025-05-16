import { useEffect, useState } from "react";
import { menuService } from "../../services/menuService";
import { itemService } from "../../services/itemService";
import { Menu, MenuDTO } from "../../types/menuTypes";
import { ItemRowDTO } from '../../types/itemTypes'


import Toast from "../UI/Toast";
import Search  from "../Menu/Search";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { EditDialog } from "../Menu/dialogs/EditDialog";
import { CreateDialog } from "../Menu/dialogs/CreateDialog";
import { Edit2, X, Check, MoreHorizontal, Plus } from "lucide-react";


const MenuTable = () => {

    //toast
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [toastType, setToastType] = useState<"success" | "error" | "info">("success");

    //menus
    const [menus, setMenus] = useState<Menu[]>([]);
    const [filteredMenus, setFilteredMenus] = useState<Menu[]>([]);

    //items para el conteo
    const [items, setItems] = useState<ItemRowDTO[]>([]);

    //form
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [estado, setEstado] = useState(false);


    //acciones
    const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
    //editar menu
    const [isEditing, setIsEditing] = useState(false);
    const [menuToEdit, setMenuToEdit] = useState<Menu | null>(null);
    //crear menu
    const [isCreating, setIsCreating] = useState(false);


    const token = localStorage.getItem("token") || "";

    //listar menus
    const fetchMenus = async () => {
    const data = await menuService.getAllMenus(token);
    setMenus(data);
    setFilteredMenus(data);
    };

    useEffect(() => {
    fetchMenus();
    }, []);

    //conteo items
    useEffect(() => {
    itemService.listarItems()
        .then((res) => setItems(res.data)) // ⬅️ acá está el fix
        .catch((err) => console.error("Error al listar items:", err));
    }, []);


    const handleSearch = (term: string) => {
    const lower = term.toLowerCase();
    const filtered = menus.filter((menu) =>
        menu.nombre.toLowerCase().includes(lower) ||
        menu.descripcion.toLowerCase().includes(lower)
    );
    setFilteredMenus(filtered);
    };



    //listar menus
    useEffect(() => {
    const fetchMenus = async () => {
        try {
        const data = await menuService.getAllMenus(token);
        setMenus(data);
        } catch (error) {
        console.error("Error al cargar menús", error);
        setToastMessage("Hubo un error al cargar los menús.");
        setToastType("error");
        }
    };

    fetchMenus();
    }, []);

    //crear
    const handleCreateMenu = async (newMenu: MenuDTO) => {
    await menuService.createMenu(newMenu, token);
    const refreshed = await menuService.getAllMenus(token);
    setMenus(refreshed);
    };
    //editar
    const openEditMenu = (menu: Menu) => {
    setMenuToEdit(menu);
    setIsEditing(true);
    };

    const handleSaveMenu = async (updatedMenu: MenuDTO) => {
    await menuService.updateMenu(menuToEdit!.id_menu, updatedMenu, token);
    const refreshed = await menuService.getAllMenus(token);
    setMenus(refreshed);
    };

    const resetForm = () => {
        setNombre("");
        setDescripcion("");
        setEstado(false);
    };


    //setear activo / inactivo
    const toggleEstadoMenu = async (menu: Menu) => {

        const token = localStorage.getItem("token") || "";

        try {
            if (menu.estado) {
            // si está activo, desactivarlo
            await menuService.disableMenu(menu.id_menu, token);
            setToastMessage("Menú desactivado correctamente");
            } else {
            //usando updateMenu y dejando los datos igual, solo cambiando estado
            await menuService.updateMenu(
                menu.id_menu,
                {
                nombre: menu.nombre,
                descripcion: menu.descripcion,
                estado: 1,
                },
                token
            );
            setToastMessage("Menú activado correctamente");
            }

            setToastType("success");

            // volver a cargar la lista de menús
            const nuevosMenus = await menuService.getAllMenus(token);
            setMenus(nuevosMenus);

        } catch (error) {
            console.error("Error al cambiar estado del menú", error);
            setToastMessage("Error al actualizar el estado del menú");
            setToastType("error");

        } finally {
            setActiveMenuId(null); // cerrar menú de opciones si estaba abierto
        }
    };



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

                <h3 className="text-2xl font-playfair text-gray-charcoal font-bold mb-4">Lista de Menús</h3>


                <table className="min-w-full  font-urbanist table-auto bg-white shadow-2xl rounded-xl">


                        <thead>
                            <tr className="text-left lg:text-lg sm:text-base text-gray-500">
                                <th className="px-4 font-semibold py-2">Nombre</th>
                                <th className="px-4 py-2">Descripción</th>
                                <th className="px-4 py-2">Estado</th>
                                <th className="px-4 py-2">Productos</th>
                                <th className="px-4 py-2">Acciones</th>

                            </tr>
                        </thead>


                    <tbody className="text-left text-sm">
                       {Array.isArray(menus) ? (

                            filteredMenus.map(menu => (

                                <tr className="hover:bg-gray-50 border-t-eggshell-200 border-t-1" key={menu.id_menu}>

                                    <td className="px-4 py-4 font-semibold">{menu.nombre}</td>
                                    <td className="px-4 py-4">{menu.descripcion}</td>
                                    <td className="px-4 py-4">{menu.estado ? (
                                        <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-semibold">Activo</span>
                                        ) : (
                                        <span className="bg-gray-100 text-gray-200 px-3 py-1 rounded-full text-xs font-semibold">Inactivo</span>
                                        )}
                                  </td>

                                    <td className="px-4 py-4">
                                        {items.filter((item) => item.id_menu === menu.id_menu).length || "Sin productos"}
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
                                                onClick={() => { resetForm(); openEditMenu(menu)}}
                                                className="flex items-center gap-2 px-4 py-2 text-gray-800 hover:bg-cream-100 w-full text-left cursor-pointer"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                                Editar
                                            </DropdownMenu.Item>

                                            <DropdownMenu.Item
                                                onClick={() => {
                                                toggleEstadoMenu(menu);
                                                }}
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
                                        </td>


                                </tr>
                            ))
                            ) : (
                            <tr>
                                <td colSpan={4} className="py-4 text-gray-500">
                                No hay menús para mostrar.
                                </td>
                            </tr>
                            )}


                    </tbody>

                </table>

            </div>


            <button    onClick={() => {resetForm(); setIsCreating(true);}} className="font-semibold transition-all duration-300 hover:-translate-y-1 shadow-md px-4 py-2 ml-0 m-5 w-40 gap-1 inline-flex items-center bg-blood-100 text-white rounded-3xl hover:bg-blood-300"> <Plus size={'20'}/>Crear Menú</button>

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
