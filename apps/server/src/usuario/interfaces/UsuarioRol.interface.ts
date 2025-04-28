export interface UsuarioWithRol {
  id_usuario: number;
  correo: string;
  password: string;
  estado: number;
  tipoUsuario: {
    descripcion: string;
  };
}
