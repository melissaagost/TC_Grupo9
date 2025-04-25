export interface UsuarioConTipo {
  id_usuario: number;
  nombre: string;
  correo: string;
  estado: number;
  id_tipousuario: number;
  tipo_usuario: string;
}

export interface UsuarioPerfil {
  id_usuario: number;
  nombre: string;
  correo: string;
  estado: number;
  tipo_usuario: string;
}
