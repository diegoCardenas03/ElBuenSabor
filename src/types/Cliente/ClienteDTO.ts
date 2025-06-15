import { UsuarioDTO } from "../Usuario/UsuarioDTO";

export interface ClienteDTO {
    id?: number;
    nombreCompleto: string;
    telefono: string;
    usuario: UsuarioDTO;
}