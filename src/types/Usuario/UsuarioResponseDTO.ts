import { RolResponseDTO } from "../Rol/RolResponseDTO";

export interface UsuarioResponseDTO {
    id?: number;
    email: string;
    auth0Id: string;
    roles: RolResponseDTO[];
}