import { useCategoryLogic } from "../../hooks/useCategoryLogic";

import Toast from "../UI/Toast";
import Search  from "../ItemCategory/Search";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { EditDialog } from "../ItemCategory/EditDialog";
import { CreateDialog } from "../ItemCategory/CreateDialog";
import { Edit2, X, Check, MoreHorizontal, Plus } from "lucide-react";
import { TableLayout } from '../UI/Table'

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

               <TableLayout
                title="Lista de Categorías"
                data={filteredCategories}
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
                    render: (category) => (
                        category.estado ? (
                        <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-semibold">Activo</span>
                        ) : (
                        <span className="bg-gray-100 text-gray-400 px-3 py-1 rounded-full text-xs font-semibold">Inactivo</span>
                        )
                    ),
                    },
                    {
                    key: "productos",
                    label: "Productos",
                    render: (category) => (
                        <span className="bg-eggshell-greekvilla px-3 py-1 rounded-full text-xs font-semibold">
                        {items.filter((item) => item.id_categoria === category.id_categoria).length || "Sin productos"}
                        </span>
                    ),
                    },
                    {
                    key: "acciones",
                    label: "Acciones",
                    render: (category) => (
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
                            onClick={() => openEditCategory(category)}
                            className="flex items-center gap-2 px-4 py-2 text-gray-800 hover:bg-cream-100 w-full text-left cursor-pointer"
                            >
                            <Edit2 className="w-4 h-4" />
                            Editar
                            </DropdownMenu.Item>
                            <DropdownMenu.Item
                            onClick={() => toggleEstadoCategory(category)}
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
                    ),
                    },
                ]}
                />

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