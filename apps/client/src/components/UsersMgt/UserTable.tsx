import { useUserLogic } from '../../hooks/useUserLogic'

import { Plus, PenBox, Archive, MoreHorizontal } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../UI/Dialog'
import Toast from '../UI/Toast'
import * as Switch from '@radix-ui/react-switch'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { TableLayout } from '../UI/Table'

const UserTable = () => {
  const {
    users,
    setUsers,
    searchTerm,
    setSearchTerm,
    userTypeFilter,
    setUserTypeFilter,
    error,
    setError,
    isCreating,
    setIsCreating,
    editingUser,
    setEditingUser,
    toastMessage,
    setToastMessage,
    toastType,
    setToastType,
    nombre,
    setNombre,
    correo,
    setCorreo,
    password,
    setPassword,
    tipoUsuarioId,
    setTipoUsuarioId,
    estado,
    setEstado,
    tiposUsuario,
    fetchUsers,
    handleCreateUser,
    handleUpdateUser,
    handleDeactivateUser,
    handleEdit,
    resetForm,
    filteredUsers,
  } = useUserLogic()

  return (
    <div className=" font-raleway flex flex-col lg:px-10 lg:py-0  py-10 px-0">
      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage(null)} />
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

        <div className="flex flex-wrap gap-4 mb-4 bg-eggshell-greekvilla lg:w-102 text-gray-200 p-2 rounded-lg">
          {[
            { label: 'Todos', value: 'all' },
            { label: 'Empleados', value: 'Cocinero' },
            { label: 'Admins', value: 'Administrador' },
            { label: 'Mozos', value: 'Mozo' },
            { label: 'Inactivos', value: 'inactive' },
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setUserTypeFilter(filter.value)}
              className={`px-4 py-1 rounded-md text-sm font-semibold transition ${
                userTypeFilter === filter.value
                  ? 'bg-eggshell-whitedove text-charcoal-800 shadow'
                  : 'text-charcoal-400 hover:text-charcoal-600'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => {
            resetForm()
            setIsCreating(true)
          }}
          className="font-semibold transition-all duration-300 hover:-translate-y-1 shadow-md px-4 py-2 mt-5 w-53 gap-1 inline-flex items-center bg-blood-100 text-white rounded-3xl hover:bg-blood-300"
        >
          {' '}
          <Plus size={'20'} /> Agregar un Usuario
        </button>
      </div>

      {/*table de gestion */}
      <div className="overflow-x-auto w-full">
        <TableLayout
          title="Lista de Usuarios"
          data={filteredUsers}
          columns={[
            {
              key: 'index',
              label: 'Número',
              render: (_, index) => <span>{index + 1}</span>,
            },
            { key: 'nombre', label: 'Nombre' },
            { key: 'correo', label: 'E-mail' },
            {
              key: 'tipo_usuario',
              label: 'Tipo',
              render: (user) =>
                tiposUsuario.find(
                  (t) => t.nombre.toLowerCase() === user.tipo_usuario?.toLowerCase()
                )?.nombre ?? 'Desconocido',
            },
            {
              key: 'estado',
              label: 'Estado',
              render: (user) =>
                user.estado ? (
                  <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-semibold">
                    Activo
                  </span>
                ) : (
                  <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-semibold">
                    Inactivo
                  </span>
                ),
            },
            {
              key: 'acciones',
              label: 'Acciones',
              render: (user) => (
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <button className="w-8 h-8 flex lg:ml-5 items-center justify-center rounded-full bg-white text-burgundy hover:bg-cream-100">
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
                        resetForm()
                        handleEdit(user)
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-800 hover:bg-cream-100 cursor-pointer"
                    >
                      <PenBox className="w-4 h-4" />
                      Editar
                    </DropdownMenu.Item>

                    {user.estado === 1 && (
                      <DropdownMenu.Item
                        onClick={() => handleDeactivateUser(user.id_usuario)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-800 hover:bg-cream-100 cursor-pointer"
                      >
                        <Archive className="w-4 h-4 text-yellow-600" />
                        <span className="text-yellow-600">Desactivar</span>
                      </DropdownMenu.Item>
                    )}
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              ),
            },
          ]}
        />
      </div>

      {/*dialogos */}

      {/*dialogo de creacion */}
      <Dialog open={isCreating} onClose={() => setIsCreating(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear un Nuevo Usuario</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateUser} className="flex flex-col gap-3">
            <input
              className="border-eggshell-creamy border-1 shadow-sm bg-pink-100 text-gray-500  p-2 rounded-md w-full mt-2 mb-2"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            <input
              className="border-eggshell-creamy border-1 shadow-sm bg-pink-100 text-gray-500  p-2 rounded-md w-full mt-2 mb-2"
              placeholder="Email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
            <input
              className="border-eggshell-creamy border-1 shadow-sm bg-pink-100 text-gray-500  p-2 rounded-md w-full mt-2 mb-2"
              placeholder="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <select
              value={tipoUsuarioId}
              onChange={(e) => setTipoUsuarioId(Number(e.target.value))}
              className="border-eggshell-creamy border-1 shadow-sm bg-pink-100 text-gray-500 p-2 rounded-md w-full mt-2 mb-2"
            >
              <option value={0} disabled>
                Seleccioná un tipo de usuario
              </option>
              {tiposUsuario.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nombre}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => {
                  resetForm()
                  setIsCreating(false)
                }}
                className="bg-blood-100 hover:bg-blood-300 text-white py-1 px-4 rounded-md"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="bg-blood-100 hover:bg-blood-300 text-white py-1 px-4 rounded-md"
              >
                Crear Usuario
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/*dialogo de update */}
      <Dialog open={!!editingUser} onClose={() => setEditingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleUpdateUser} className="flex flex-col gap-3">
            <input
              className="border-eggshell-creamy border-1 shadow-sm bg-pink-100 text-gray-500  p-2 rounded-md w-full mt-2 mb-2"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            <input
              className="border-eggshell-creamy border-1 shadow-sm bg-pink-100 text-gray-500  p-2 rounded-md w-full mt-2 mb-2"
              placeholder="Email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />

            <select
              value={tipoUsuarioId || 0}
              onChange={(e) => setTipoUsuarioId(Number(e.target.value))}
              className="border-eggshell-creamy border-1 bg-pink-100 text-gray-500 p-2 rounded-md w-full mt-2 mb-2"
            >
              <option value={0} disabled>
                Seleccioná un tipo
              </option>
              {tiposUsuario.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nombre}
                </option>
              ))}
            </select>

            {editingUser?.estado === 0 && (
              <label className="flex items-center gap-2">
                <Switch.Root
                  className="w-10 h-6 bg-gray-300 rounded-full relative data-[state=checked]:bg-blood-300 transition-colors"
                  checked={estado === 1}
                  onCheckedChange={(checked) => setEstado(checked ? 1 : 0)}
                >
                  <Switch.Thumb className="block w-4 h-4 bg-white rounded-full shadow-sm transition-transform translate-x-1 data-[state=checked]:translate-x-5" />
                </Switch.Root>
                Usuario activo
              </label>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => {
                  resetForm()
                  setEditingUser(null)
                }}
                className="bg-blood-100 hover:bg-blood-300 text-white py-1 px-4 rounded-md"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="bg-blood-100 hover:bg-blood-300 text-white py-1 px-4 rounded-md"
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default UserTable
