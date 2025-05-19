import { useEffect, useState } from "react";
import userService from "../services/userService";
import axios from "axios";

interface Usuario {
  id_usuario: number;
  nombre: string;
  correo: string;
  id_tipousuario: number;
  tipo_usuario: string;
  estado: number;
}

export const useUserLogic = () => {
  const [users, setUsers] = useState<Usuario[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState("all");

  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error" | "info">("success");

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [tipoUsuarioId, setTipoUsuarioId] = useState<number>(0);
  const [estado, setEstado] = useState<number>(1);

  const token = localStorage.getItem("token") || "";

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = (pass: string) => /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(pass);

  const tiposUsuario = [
    { id: 1, nombre: "Administrador" },
    { id: 2, nombre: "Cocinero" },
    { id: 3, nombre: "Mozo" },
  ];

  const fetchUsers = async () => {
    try {
      const data = await userService.getAllUsers(token);
      setUsers(data);
    } catch (err) {
       if (axios.isAxiosError(error) && error.response?.status === 401) {
        setToastType("error");
        setToastMessage("Sesión expirada. Por favor, iniciá sesión nuevamente.");
      }
      console.error("Error fetching users:", err);
      setError("No se pudieron obtener los usuarios.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

useEffect(() => {
    if (editingUser) {
    setNombre(editingUser.nombre);
    setCorreo(editingUser.correo);
    setTipoUsuarioId(editingUser.id_tipousuario);
    setEstado(editingUser.estado);
    }
}, [editingUser]);


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

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    if (tipoUsuarioId === 0) {
      setToastMessage("Debés seleccionar un tipo de usuario.");
      setToastType("error");
      return;
    }

    const updateData = { nombre, correo, tipoUsuarioId, estado };

    if (
      nombre === editingUser.nombre &&
      correo === editingUser.correo &&
      tipoUsuarioId === editingUser.id_tipousuario &&
      estado === editingUser.estado
    ) {
      setToastMessage("No hay cambios para guardar.");
      setToastType("info");
      return;
    }

    try {
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

  return {
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
    filteredUsers,
  };
};
