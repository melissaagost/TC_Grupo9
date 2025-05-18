import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../UI/Dialog";
import Toast from "../UI/Toast";
import { Plus, SquarePen} from "lucide-react";
import TableHeader from "../UI/TableHeader";
import { useTableLogic } from "../../hooks/useTableLogic";

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

          <table className="min-w-full  font-urbanist table-auto bg-white shadow-2xl rounded-xl">

            <TableHeader>
                <th className="py-2">Número</th>
                <th className="py-2">Capacidad</th>
                <th className="py-2">Descripción</th>
                <th className="py-2">Estado</th>
                <th className="py-2">Acciones</th>
                <th className="py-2">Pedido</th>
              </TableHeader>



            <tbody className="text-sm">
              {filteredMesas.map((mesa) => (
                <tr  className="border-t border-gray-100 hover:bg-gray-50" key={mesa.id_mesa}>

                  <td className="px-4 py-2 text-center">{mesa.numero}</td>
                  <td className="px-4 py-2 text-center">{mesa.capacidad}</td>
                  <td className="px-4 py-2 text-center">{mesa.descripcion}</td>

                  <td className="px-4 py-2 text-center">
                        {
                          mesa.estado === 0 ? (
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                              Libre
                            </span>
                          ) : mesa.estado === 1 ? (
                            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
                              Ocupado
                            </span>
                          ) : (
                            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
                              Reservado
                            </span>
                          )
                        }
                    </td>

                  {/*Si la mesa esta libre/reservada: renderiza boton agregar pedido */}
                  {/*Si la mesa esta ocupada: renderiza boton pagar y boton modif pedido */}


                  <td className="flex font-semibold justify-center  text-eggshell-whitedove gap-2 py-2">
                    <button  onClick={() => startEditingMesa(mesa)}
                    className="px-2 py-1 bg-blue-400 hover:text-blue-900 gap-1 inline-flex items-center transition-all duration-300 hover:-translate-y-1 shadow-md rounded-md  "><SquarePen/>Modificar</button>
                  </td>


                  <td className="px-4 py-2 text-center">


                      {(mesa.estado === 0 || mesa.estado === 2 ) ? (
                          <button className="px-2 py-1  transition-all text-white duration-300 font-semibold hover:-translate-y-1 shadow-md bg-gold-order hover:text-orange-700 gap-1 inline-flex items-center rounded-md">
                            <Plus/> Agregar Pedido
                          </button>

                      ) : (
                        <div className="gap-1 items-center font-semibold text-white inline-flex">
                          <button className="px-2 py-1 transition-all duration-300 hover:-translate-y-1 shadow-md bg-blood-pay hover:text-blood-300 gap-1 inline-flex items-center rounded-md">
                            Pagar
                          </button>
                          <button className="px-2 py-1 transition-all duration-300 hover:-translate-y-1 shadow-md bg-gold-modify hover:text-gray-200 gap-1 inline-flex items-center rounded-md">
                            Modificar Pedido
                          </button>
                        </div>
                      )}

                  </td>

                </tr>
              ))}

            </tbody>

          </table>
      </div>

      <button  onClick={() => setIsCreating(true)} className="font-semibold transition-all duration-300 hover:-translate-y-1 shadow-md px-4 py-2 m-5 w-50 gap-1 inline-flex items-center bg-green-500 text-white rounded-3xl hover:bg-green-600"> <Plus size={'20'}/> Agregar una Mesa</button>

      {/*abre formularios */}

        {/*form de creacion */}
        <Dialog open={isCreating} onClose={() => setIsCreating(false)}>

            <DialogContent>

                <DialogHeader><DialogTitle>Crear Nueva Mesa</DialogTitle></DialogHeader>

                <form onSubmit={handleCreateMesa}>

                    <label className="block text-md font-semibold text-gray-200 mt-2 mb-1">Número de Mesa</label>
                    <input
                        type="text"
                        placeholder="Número de Mesa"
                        value={numero}
                        onChange={(e) => setNumero(Number(e.target.value))}
                        className="mt-2 w-full shadow-sm border border-eggshell-creamy rounded-md px-3 py-2 text-sm text-gray-800 outline-none focus:ring-1 focus:ring-blood-300"

                        />

                    <label className="block text-md font-semibold text-gray-200 mt-2 mb-1">Capacidad</label>
                    <input
                        type="text"
                        placeholder="Capacidad"
                        value={capacidad}
                        onChange={(e) => setCapacidad(Number(e.target.value))}
                        className="mt-2 w-full shadow-sm border border-eggshell-creamy rounded-md px-3 py-2 text-sm text-gray-800 outline-none focus:ring-1 focus:ring-blood-300"

                    />

                    <label className="block text-md font-semibold text-gray-200 mt-2 mb-1">Ubicación</label>
                    <input
                        type="text"
                        placeholder="Descripción"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        className="mt-2 w-full shadow-sm border border-eggshell-creamy rounded-md px-3 py-2 text-sm text-gray-800 outline-none focus:ring-1 focus:ring-blood-300"

                    />


                      <div className="flex justify-end gap-2 mt-4">
                        <button type="submit" className="bg-blood-100 hover:bg-blood-300 text-white py-1 px-4 rounded-md">Guardar Cambios</button>
                      </div>

                </form>

            </DialogContent>

        </Dialog>



        {/*dialog patra editar mesa */}
        <Dialog open={!!editingMesa} onClose={() => setEditingMesa(null)}>

            <DialogContent>

                <DialogHeader><DialogTitle>Editar Mesa</DialogTitle></DialogHeader>

                <form onSubmit={handleUpdateMesa}>

                    <label className="block text-md font-semibold text-gray-200 mt-2 mb-1">Número de Mesa</label>
                    <input
                        type="text"
                        value={editNumero}
                        onChange={(e) => setEditNumero(Number(e.target.value))}
                        className="mt-2 w-full shadow-sm border border-eggshell-creamy rounded-md px-3 py-2 text-sm text-gray-800 outline-none focus:ring-1 focus:ring-blood-300"

                    />

                    <label className="block text-md font-semibold text-gray-200 mt-3 mb-1">Capacidad</label>
                    <input
                        type="text"
                        value={editCapacidad}
                        onChange={(e) => setEditCapacidad(Number(e.target.value))}
                        className="mt-2 w-full shadow-sm border border-eggshell-creamy rounded-md px-3 py-2 text-sm text-gray-800 outline-none focus:ring-1 focus:ring-blood-300"
                      />

                    <label className="block text-md font-semibold text-gray-200 mt-3  mb-1">Ubicación</label>
                    <input
                        type="text"
                        value={editDescripcion}
                        onChange={(e) => setEditDescripcion(e.target.value)}
                        className="mt-2 w-full shadow-sm border border-eggshell-creamy rounded-md px-3 py-2 text-sm text-gray-800 outline-none focus:ring-1 focus:ring-blood-300"
                      />

                      <div className="flex justify-end gap-2 mt-4">


                      <button type="submit" className="bg-blood-100 hover:bg-blood-300 text-white py-1 px-4 rounded-md">Guardar Cambios</button>

                      </div>

                </form>

            </DialogContent>

        </Dialog>



    </div>

  );

};

export default MesasTable;
