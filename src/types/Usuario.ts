import { Rol } from "./enums/Rol";

export interface Usuario {
    id?: number;
    email: string;
    contraseña: string;
    auth0Id: string;
    rol: Rol;
}