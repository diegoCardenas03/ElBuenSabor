import { Rol } from "../enums/Rol";

export interface UsuarioDTO {
    email: string;
    contraseña: string;
    rol: Rol;
}