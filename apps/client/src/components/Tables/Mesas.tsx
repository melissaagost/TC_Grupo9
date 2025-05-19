import CreateDialog from "./CreateDialog";
import EditDialog from "./EditDialog";
import Toast from "../UI/Toast";
import { Plus, SquarePen} from "lucide-react";
import TableHeader from "../UI/TableHeader";
import { useTableLogic } from "../../hooks/useTableLogic";
import { TableLayout } from "../UI/Table";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { MoreHorizontal, Edit2, CreditCard, Utensils, Check, X } from "lucide-react";


const MesasTable = () => {

  const {
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
} = useTableLogic();


  return (
    <div className=" font-raleway flex flex-col lg:px-10 lg:py-0  py-10 px-0">

        {toastMessage && (
        <Toast
            message={toastMessage}
            type={toastType}
            onClose={() => setToastMessage(null)}
        />
        )}

      <h1 className="text-4xl font-playfair text-blood-100 font-bold mb-4">Gestión de Mesas</h1>
      <h3 className="text-lg font-urbanist  text-gray-700 font-light mb-4">Administra las mesas de tu restaurante</h3>

      <div className="mb-4">

            <input
                type="text"
                placeholder="Buscar mesa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className=" md:w-90 border  bg-white border-gray-300  rounded-xl p-2 w-full mb-6 focus:outline-none focus:ring-2 focus:ring-blood-200"
            />
        </div>

        <div className="overflow-x-auto w-full">

         <TableLayout
            title="Listado de Mesas"
            data={filteredMesas}
            columns={[
              {
                key: "numero",
                label: "Número",
                className: "text-center",
                render: (mesa) => <div >{mesa.numero}</div>,
              },
              {
                key: "capacidad",
                label: "Capacidad",
                className: "text-center",
                render: (mesa) => <div >{mesa.capacidad} personas</div>,
              },
              {
                key: "descripcion",
                label: "Descripción",
                className: "text-center",
                render: (mesa) => <div >{mesa.descripcion}</div>,
              },
              {
                key: "estado",
                label: "Estado",
                className: "text-center",
                render: (mesa) => (
                  <div>
                    {mesa.estado === 0 ? (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">Libre</span>
                    ) : mesa.estado === 1 ? (
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">Ocupado</span>
                    ) : (
                      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">Reservado</span>
                    )}
                  </div>
                ),
              },
              {
                key: "acciones",
                label: "Acciones",
                className: "text-center",
                render: (mesa) => (
                  <div className="flex justify-center py-2  text-eggshell-whitedove font-semibold">
                    <button
                      onClick={() => startEditingMesa(mesa)}
                      className="px-2 py-1 bg-blue-400 hover:text-blue-900 gap-1 inline-flex items-center transition-all duration-300 hover:-translate-y-1 shadow-md rounded-md"
                    >
                      <SquarePen /> Modificar
                    </button>
                  </div>
                ),
              },
              {
                key: "pedido",
                label: "Pedido",
                className: "text-center",
                render: (mesa) => {
                  const estadoMesa = mesa.estado;
                  const pedido = mesa.pedido;
                  const estadoPedido = pedido?.estado;

                  if (estadoMesa === 2) {
                    // Mesa reservada
                    return (
                      <div className="flex flex-col items-center gap-2">
                        <button
                          onClick={() => console.log("Ocupar mesa")}
                          className="bg-yellow-300 text-white px-2 py-1 rounded-md"
                        >
                          Ocupar Mesa
                        </button>
                        <button
                          onClick={() => console.log("Liberar mesa")}
                          className="bg-green-400 text-white px-2 py-1 rounded-md"
                        >
                          Liberar Mesa
                        </button>
                      </div>
                    );
                  }

                  if (estadoMesa === 1) {
                    // Mesa ocupada
                    if (!pedido) {
                      return (
                        <button
                          onClick={() => console.log("Agregar pedido")}
                          className="px-2 py-1 text-white font-semibold transition-all duration-300 hover:-translate-y-1 shadow-md bg-gold-order hover:text-orange-700 gap-1 inline-flex items-center rounded-md"
                        >
                          <Plus /> Agregar Pedido
                        </button>
                      );
                    }

                    // Con pedido solicitado
                    console.log("Estado de pedido:", estadoPedido);

                  if (estadoPedido === 1) {
                    return (
                      <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                          <button className="w-8 h-8 ml-30 flex items-center justify-center rounded-full bg-white text-burgundy hover:bg-cream-100">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content
                          align="end"
                          sideOffset={8}
                          className="z-50 bg-white border border-eggshell-creamy rounded-md shadow-md animate-fade-in"
                        >
                          <DropdownMenu.Item
                            onClick={() => console.log("Modificar pedido")}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-800 hover:bg-cream-100 cursor-pointer"
                          >
                            <Edit2 /> Modificar Pedido
                          </DropdownMenu.Item>
                          <DropdownMenu.Item
                            onClick={() => console.log("Cancelar pedido")}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-cream-100 cursor-pointer"
                          >
                            <X/> Cancelar Pedido
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Root>
                    );
                  }

                    // Con pedido en preparación
                    if (estadoPedido === 3) {
                      return (
                        <DropdownMenu.Root>
                          <DropdownMenu.Trigger asChild>
                            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-burgundy hover:bg-cream-100">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </DropdownMenu.Trigger>
                          <DropdownMenu.Content
                            align="end"
                            sideOffset={8}
                            className="z-50 bg-white border border-eggshell-creamy rounded-md shadow-md animate-fade-in"
                          >
                            <DropdownMenu.Item
                              onClick={() => console.log("Marcar En Mesa")}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-800 hover:bg-cream-100 cursor-pointer"
                            >
                              <Check /> Marcar En Mesa
                            </DropdownMenu.Item>
                            <DropdownMenu.Item
                              onClick={() => console.log("Modificar pedido")}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-800 hover:bg-cream-100 cursor-pointer"
                            >
                              <Edit2 /> Modificar Pedido
                            </DropdownMenu.Item>
                          </DropdownMenu.Content>
                        </DropdownMenu.Root>
                      );
                    }

                    // Con pedido en mesa
                    if (estadoPedido === 5) {
                      return (
                        <DropdownMenu.Root>
                          <DropdownMenu.Trigger asChild>
                            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-burgundy hover:bg-cream-100">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </DropdownMenu.Trigger>
                          <DropdownMenu.Content
                            align="end"
                            sideOffset={8}
                            className="z-50 bg-white border border-eggshell-creamy rounded-md shadow-md animate-fade-in"
                          >
                            <DropdownMenu.Item
                              onClick={() => console.log("Pagar")}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-800 hover:bg-cream-100 cursor-pointer"
                            >
                              <CreditCard/> Pagar
                            </DropdownMenu.Item>
                            <DropdownMenu.Item
                              onClick={() => console.log("Modificar pedido")}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-800 hover:bg-cream-100 cursor-pointer"
                            >
                              <Edit2 /> Modificar Pedido
                            </DropdownMenu.Item>
                          </DropdownMenu.Content>
                        </DropdownMenu.Root>
                      );
                    }
                  }

                  // Mesa libre u otros casos
                  return (
                    <button
                      onClick={() => console.log("Agregar pedido")}
                      className="px-2 py-1 text-white font-semibold transition-all duration-300 hover:-translate-y-1 shadow-md bg-gold-order hover:text-orange-700 gap-1 inline-flex items-center rounded-md"
                    >
                      <Plus /> Agregar Pedido
                    </button>
                  );
                }
              }

            ]}
          />
      </div>

      <button  onClick={() => setIsCreating(true)} className="font-semibold transition-all duration-300 hover:-translate-y-1 shadow-md px-4 py-2 mt-5 w-50 gap-1 inline-flex items-center bg-blood-100 text-white rounded-3xl hover:bg-blood-300"> <Plus size={'20'}/> Agregar una Mesa</button>

      <CreateDialog
        open={isCreating}
        numero={numero}
        capacidad={capacidad}
        descripcion={descripcion}
        setNumero={setNumero}
        setCapacidad={setCapacidad}
        setDescripcion={setDescripcion}
        onClose={() => setIsCreating(false)}
        onSubmit={handleCreateMesa}
      />

      <EditDialog
        open={!!editingMesa}
        editNumero={editNumero}
        editCapacidad={editCapacidad}
        editDescripcion={editDescripcion}
        setEditNumero={setEditNumero}
        setEditCapacidad={setEditCapacidad}
        setEditDescripcion={setEditDescripcion}
        onClose={() => setEditingMesa(null)}
        onSubmit={handleUpdateMesa}
      />

    </div>

  );

};

export default MesasTable;



  //si esta reservado(mesa estado 2) -> opciones ocupar(mesa estado 1)/liberar(mesa estado 0) */}
  //si esta ocupado(mesa estado 1) -> agregar pedido(pedido estado 1)  y modificar -> si el pedido esta "en preparacoion" entonces ofrecer opcion marcar en pedido mesa(pedido estado 5) */}
  //si esta "en mesa"(pedido estado 5) ofrecer opcion de pago y modificar. condicion: mesa ocupada(mesa estado 1) && pedido "en mesa"(pedido estado 5)