import { useCategoryLogic } from "../../hooks/useCategoryLogic";

import Toast from "../UI/Toast";
import Search  from "../ItemCategory/Search";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { EditDialog } from "../ItemCategory/EditDialog";
import { CreateDialog } from "../ItemCategory/CreateDialog";
import { Edit2, X, Check, MoreHorizontal, Plus } from "lucide-react";

const CategoryTable = () => {

    const {
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
    handleSearch
    } = useCategoryLogic();


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

            {/*tabla */}
            <div  className="overflow-x-auto w-full">

                <h3 className="text-2xl font-playfair text-gray-charcoal font-bold mb-4">Lista de Categorías</h3>

                <table  className="min-w-full  font-urbanist table-auto bg-white shadow-2xl rounded-xl">

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

                        {filteredCategories.length > 0 ? (
                        filteredCategories.map(category => (

                            <tr className="hover:bg-gray-50 border-t-eggshell-200 border-t-1" key={category.id_categoria}>

                                <td className="px-4 py-4 font-semibold">{category.nombre}</td>
                                <td className="px-4 py-4">{category.descripcion}</td>
                                <td className="px-4 py-4">{category.estado ? (
                                    <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-semibold">Activo</span>
                                    ) : (
                                    <span className="bg-gray-100 text-gray-200 px-3 py-1 rounded-full text-xs font-semibold">Inactivo</span>
                                    )}
                                </td>

                                <td className="px-4 py-">
                                    <span className=" bg-eggshell-greekvilla px-3 py-1 rounded-full text-xs font-semibold">
                                    {items.filter((item) => item.id_categoria === category.id_categoria).length || "Sin productos"}
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
                                            onClick={() => { openEditCategory(category)}}
                                            className="flex items-center gap-2 px-4 py-2 text-gray-800 hover:bg-cream-100 w-full text-left cursor-pointer"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                            Editar
                                        </DropdownMenu.Item>

                                        <DropdownMenu.Item
                                            onClick={() => {
                                            toggleEstadoCategory(category);
                                            }}
                                            className="flex items-center gap-2 px-4 py-2 w-full text-left cursor-pointer hover:bg-cream-100"
                                        >
                                            {category.estado ? (
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
                            <td colSpan={5} className="py-4 text-gray-500 text-center">
                            No hay categorías para mostrar.
                            </td>
                        </tr>
                        )}


                    </tbody>

                </table>

            </div>

            <button  onClick={() => {setIsCreating(true);}} className="font-semibold transition-all duration-300 hover:-translate-y-1 shadow-md px-4 py-2 ml-0 m-5 w-48 gap-1 inline-flex items-center bg-blood-100 text-white rounded-3xl hover:bg-blood-300"> <Plus size={'20'}/>Nueva Categoría</button>

            {/*dialogo para crear */}
            <CreateDialog
                open={isCreating}
                onClose={() => setIsCreating(false)}
                onCreate={handleCreateCategory}
            />

            {/*dialogo para editar */}
            <EditDialog
            open={isEditing}
            onClose={() => setIsEditing(false)}
            onSave={handleSaveCategory}
            initialData={categoryToEdit}
            />

        </div>

    );
};

export default CategoryTable;