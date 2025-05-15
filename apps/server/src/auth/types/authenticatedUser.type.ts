export type AuthenticatedUser = {
  id_usuario: number;
  correo: string;
  password: string;
  estado: number;
  id_restaurante: number | null; // 👈 este campo
  tipoUsuario: {
    descripcion: string;
  };
};

export enum Role {
  Administrador = 'administrador',
  Usuario = 'usuario',
  Mozo = 'mozo',
}
