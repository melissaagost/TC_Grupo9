//implementa permisos definidos en permisos/roles
import { useAuth } from "../context/AuthContext";
import { permisosPorRol } from "../permisos/roles";

export function usePermisos() {
  const { userType } = useAuth();

  const tienePermiso = (permiso: string) => {
    const rol = userType;
    if (!rol) return false;

    if (rol === "administrador") return true;

    return permisosPorRol[rol]?.includes(permiso) ?? false;
  };

  return { tienePermiso };
}
