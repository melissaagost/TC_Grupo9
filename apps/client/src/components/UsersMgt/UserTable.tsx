import { useUserLogic } from "../../hooks/useUserLogic";

import { Plus, PenBox, Archive } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../UI/Dialog";
import TableHeader from "../UI/TableHeader";
import Toast from "../UI/Toast";

const UserTable = () => {

     const {
      users, setUsers,
      searchTerm, setSearchTerm,
      userTypeFilter, setUserTypeFilter,
      error, setError,
      isCreating, setIsCreating,
      editingUser, setEditingUser,
      toastMessage, setToastMessage,
      toastType, setToastType,
      nombre, setNombre,
      correo, setCorreo,
      password, setPassword,
      tipoUsuarioId, setTipoUsuarioId,
      estado, setEstado,
      tiposUsuario,
      fetchUsers,
      handleCreateUser,
      handleUpdateUser,
      handleDeactivateUser,
      handleEdit,
      resetForm,
      filteredUsers
    } = useUserLogic();

    return (

        <div className=" font-raleway flex flex-col lg:px-10 lg:py-0  py-10 px-0">

          {toastMessage && (
            <Toast
                message={toastMessage}
                type={toastType}
                onClose={() => setToastMessage(null)}
            />
          )}


            {/*buscador */}
            <div className="mb-4 font-urbanist">

                <input
                    type="text"
                    placeholder="Buscar usuario..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className=" md:w-90 lg:w-102 border  bg-white border-gray-300  rounded-xl p-2 w-full mb-6 focus:outline-none focus:ring-2 focus:ring-blood-100"
                />

                    <div className="flex flex-wrap gap-4 mb-6 bg-eggshell-greekvilla lg:w-102 text-gray-200 p-2 rounded-lg">
                      {[
                        { label: "Todos", value: "all" },
                        { label: "Empleados", value: "Usuario" },
                        { label: "Admins", value: "Administrador" },
                        { label: "Mozos", value: "Mozo" },
                        { label: "Inactivos", value: "inactive" },
                      ].map((filter) => (

                        <button
                          key={filter.value}

                          onClick={() => setUserTypeFilter(filter.value)}

                          className={`px-4 py-1 rounded-md text-sm font-semibold transition ${

                            userTypeFilter === filter.value
                              ? "bg-eggshell-whitedove text-charcoal-800 shadow"
                              : "text-charcoal-400 hover:text-charcoal-600"

                          }`}>

                          {filter.label}

                        </button>

                      ))}
                    </div>

            </div>

            {/*table de gestion */}
            <div className="overflow-x-auto w-full">

              <table className="min-w-full  font-urbanist table-auto bg-white shadow-2xl rounded-xl">

                      <TableHeader>
                        <th className="py-2">Número</th>
                        <th className="py-2">Nombre</th>
                        <th className="py-2">E-mail</th>
                        <th className="py-2">Tipo</th>
                        <th className="py-2">Estado</th>
                        <th className="py-2">Acciones</th>
                      </TableHeader>


                  <tbody className="text-center text-sm">

                      {filteredUsers.map((user, index) => (

                          <tr key={user.id_usuario} className="border-t border-gray-100 hover:bg-gray-100">

                              <td className="py-2">{index + 1}</td>
                              <td className="py-2">{user.nombre}</td>
                              <td className="py-2">{user.correo}</td>
                              <td className="py-2">
                                {
                                  tiposUsuario.find(t => t.nombre.toLowerCase() === user.tipo_usuario?.toLowerCase())?.nombre ?? "Desconocido"
                                }
                              </td>



                              <td className="py-2">
                                  {user.estado ? (
                                  <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-semibold">Activo</span>
                                  ) : (
                                  <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-semibold">Inactivo</span>
                                  )}
                              </td>

                              <td className="py-2 space-x-2">

                                  <div className="relative group inline-block">
                                    <button
                                    onClick={() => {resetForm(); handleEdit(user)}}
                                    className="text-white hover:text-blue-950 bg-blue-600 px-2 py-1 transition-all duration-300 hover:-translate-y-1 shadow-md rounded-md"
                                    >
                                    <PenBox />
                                    </button>
                                      <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        Editar
                                      </span>
                                  </div>


                                  {user.estado === 1 && (
                                    <div className="relative group inline-block">
                                      <button
                                        onClick={() => handleDeactivateUser(user.id_usuario)}
                                        className="text-white hover:text-yellow-950 bg-yellow-600 px-2 py-1 transition-all duration-300 hover:-translate-y-1 shadow-md rounded-md"
                                      >
                                        <Archive/>
                                      </button>

                                        <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                          Desactivar
                                        </span>
                                    </div>
                                  ) }

                              </td>

                          </tr>

                      ))}

                  </tbody>

              </table>

            </div>

            <button    onClick={() => {resetForm(); setIsCreating(true);}} className="font-semibold transition-all duration-300 hover:-translate-y-1 shadow-md px-4 py-2 m-5 w-55 gap-1 inline-flex items-center bg-green-500 text-white rounded-3xl hover:bg-green-600"> <Plus size={'20'}/> Agregar un Usuario</button>

            {/*dialogos */}

            {/*dialogo de creacion */}
            <Dialog open={isCreating} onClose={() => setIsCreating(false)}>

                    <DialogContent>

                        <DialogHeader><DialogTitle>Crear un Nuevo Usuario</DialogTitle></DialogHeader>

                        <form onSubmit={handleCreateUser} className="flex flex-col gap-3">
                            <input className="border-eggshell-creamy border-1 bg-pink-100 text-gray-500  p-2 rounded-md w-full mt-2 mb-2" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                            <input className="border-eggshell-creamy border-1 bg-pink-100 text-gray-500  p-2 rounded-md w-full mt-2 mb-2" placeholder="Email" value={correo} onChange={(e) => setCorreo(e.target.value)} />
                            <input className="border-eggshell-creamy border-1 bg-pink-100 text-gray-500  p-2 rounded-md w-full mt-2 mb-2" placeholder="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

                              <select
                                value={tipoUsuarioId}
                                onChange={(e) => setTipoUsuarioId(Number(e.target.value))}
                                className="border-eggshell-creamy border-1 bg-pink-100 text-gray-500 p-2 rounded-md w-full mt-2 mb-2"
                              >
                                <option value={0} disabled>Seleccioná un tipo de usuario</option>
                                {tiposUsuario.map((tipo) => (
                                  <option key={tipo.id} value={tipo.id}>
                                    {tipo.nombre}
                                  </option>
                                ))}
                              </select>


                            <button type="submit" className="bg-blue-600 hover:bg-blue-800 text-white py-1 px-4 rounded-md">Crear</button>
                        </form>

                    </DialogContent>

            </Dialog>

            {/*dialogo de update */}
            <Dialog open={!!editingUser} onClose={() => setEditingUser(null)}>

                    <DialogContent>

                        <DialogHeader><DialogTitle>Editar Usuario</DialogTitle></DialogHeader>

                        <form onSubmit={handleUpdateUser} className="flex flex-col gap-3">
                            <input className="border-eggshell-creamy border-1 bg-pink-100 text-gray-500  p-2 rounded-md w-full mt-2 mb-2" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                            <input className="border-eggshell-creamy border-1 bg-pink-100 text-gray-500  p-2 rounded-md w-full mt-2 mb-2" placeholder="Email" value={correo} onChange={(e) => setCorreo(e.target.value)} />

                              <select

                                value={tipoUsuarioId || 0}
                                onChange={(e) => setTipoUsuarioId(Number(e.target.value))}
                                className="border-eggshell-creamy border-1 bg-pink-100 text-gray-500 p-2 rounded-md w-full mt-2 mb-2">

                                <option value={0} disabled>Seleccioná un tipo</option>
                                {tiposUsuario.map((tipo) => (
                                  <option key={tipo.id} value={tipo.id}>
                                    {tipo.nombre}
                                  </option>
                                ))}

                              </select>



                              {editingUser?.estado === 0 &&(
                              <label className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={estado === 1}
                                  onChange={(e) => setEstado(e.target.checked ? 1 : 0)}
                                />
                                Usuario activo
                              </label>
                              )}

                            <button type="submit" className="bg-blue-600 hover:bg-blue-800 text-white py-1 px-4 rounded-md">Actualizar</button>
                        </form>

                    </DialogContent>

            </Dialog>

        </div>

    );

};

export default UserTable;