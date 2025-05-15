import { useEffect, useState } from "react";
import userService from '../../services/userService';

import { Plus, PenBox, Archive } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../UI/Dialog";
import TableHeader from "../UI/TableHeader";

import Toast from "../UI/Toast";


interface Usuario {
    id_usuario: number;
    nombre: string;
    correo: string;
    id_tipousuario: number;
    tipo_usuario: string;
    estado: number;
  }


const UserTable = () => {

      const [users, setUsers] = useState<Usuario[]>([]);

      //buscador y filtros
      const [searchTerm, setSearchTerm] = useState("");
      const [userTypeFilter, setUserTypeFilter] = useState("all");

      //forms
      const [error, setError] = useState<string | null>(null);
      const [isCreating, setIsCreating] = useState(false);
      const [editingUser, setEditingUser] = useState<Usuario | null>(null);

      //toast
      const [toastMessage, setToastMessage] = useState<string | null>(null);
      const [toastType, setToastType] = useState<"success" | "error" | "info">("success");

      // campos del formulario
      const [nombre, setNombre] = useState("");
      const [correo, setCorreo] = useState("");
      const [password, setPassword] = useState(""); // solo para crear
      const [tipoUsuarioId, setTipoUsuarioId] = useState<number>(0);


      const [estado, setEstado] = useState<number>(1);

      const token = localStorage.getItem("token") || "";


      const isValidEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      };

      const isValidPassword = (password: string): boolean => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
        return passwordRegex.test(password);
      };


      useEffect(() => {
        fetchUsers();
      }, []);

      const fetchUsers = async () => {
        try {
          const data = await userService.getAllUsers(token);
          setUsers(data);
        } catch (err) {
          console.error("Error fetching users:", err);
          setError("No se pudieron obtener los usuarios.");
        }
      };



      const handleCreateUser = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!nombre.trim() || !correo.trim() || !password.trim()) {
        setToastMessage("Todos los campos son obligatorios.");
        setToastType("error");
        return;
      }

      if (!isValidEmail(correo)) {
        setToastMessage("El correo no tiene un formato válido.");
        setToastType("error");
        return;
      }

      if (!isValidPassword(password)) {
        setToastMessage("La contraseña debe tener al menos 8 caracteres, una letra mayúscula y un número.");
        setToastType("error");
        return;
      }

      if (tipoUsuarioId === 0) {
        setToastMessage("Debés seleccionar un tipo de usuario.");
        setToastType("error");
        return;
      }

      const newUser = { nombre, correo, password, tipoUsuarioId };

      try {
        await userService.createUser(newUser, token);
        fetchUsers();
        setToastMessage("Usuario creado correctamente.");
        setToastType("success");
        setIsCreating(false);
        resetForm();
      } catch (err) {
        console.error("Error al crear usuario:", err);
        setToastMessage("No se pudo crear el usuario.");
        setToastType("error");
      }
    };


      useEffect(() => {
        if (editingUser) {
          setNombre(editingUser.nombre);
          setCorreo(editingUser.correo);
          setTipoUsuarioId(editingUser.id_tipousuario);
          setEstado(editingUser.estado);
        }
      }, [editingUser]);

      const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;

        if (tipoUsuarioId === 0) {
          setToastMessage("Debés seleccionar un tipo de usuario.");
          setToastType("error");
          return;
        }

        const updateData = { nombre, correo, tipoUsuarioId, estado };

        try {
          if (
            editingUser &&
            nombre === editingUser.nombre &&
            correo === editingUser.correo &&
            tipoUsuarioId === editingUser.id_tipousuario &&
            estado === editingUser.estado
          ) {
            setToastMessage("No hay cambios para guardar.");
            setToastType("info");
            return;
          }

          await userService.updateUser(editingUser.id_usuario, updateData, token);
          fetchUsers();
          setEditingUser(null);
          resetForm();

          setToastMessage("Usuario actualizado correctamente.");
          setToastType("success");
        } catch (err) {
          console.error("Error al actualizar usuario:", err);
          setError("No se pudo actualizar el usuario.");
        }
      };

      const handleDeactivateUser = async (id: number) => {
        try {
          await userService.setUserInactive(id, token);
          fetchUsers();
           setToastMessage("Usuario dado de baja con éxito.");
            setToastType("success");
        } catch (err) {
          console.error("Error al desactivar usuario:", err);
          setError("No se pudo desactivar el usuario.");
        }
      };



      const handleEdit = (user: Usuario) => {
        setEditingUser(user);
        setNombre(user.nombre);
        setCorreo(user.correo);
        setTipoUsuarioId(user.id_tipousuario);

      };

      //tipo de users
      const tiposUsuario = [
        { id: 1, nombre: "Administrador" },
        { id: 2, nombre: "Usuario" },

      ];

      const resetForm = () => {
        setNombre("");
        setCorreo("");
        setPassword("");
        setTipoUsuarioId(0);
        setEstado(1);
      };


      const filteredUsers = users.filter((user) => {
        const name = user.nombre.toLowerCase();
        const email = user.correo.toLowerCase();
        const term = searchTerm.toLowerCase();

        const matchesSearch = name.includes(term) || email.includes(term);
        const isInactive = user.estado === 0;

        const typeMatch =

          userTypeFilter === "all"
            ? true
            : userTypeFilter === "inactive"
            ? isInactive
            : user.tipo_usuario?.toLowerCase() === userTypeFilter.toLowerCase();

        return matchesSearch && typeMatch;
      });


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