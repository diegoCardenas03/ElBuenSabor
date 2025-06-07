import { Rol } from "../enums/Rol";

export interface UsuarioResponseDTO {
    id?: number;
    email: string;
    auth0Id: string;
    rol: Rol;
}