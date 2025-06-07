import { UsuarioDTO } from "../Usuario/UsuarioDTO";

export interface ClienteDTO {
    nombreCompleto: string;
    telefono: string;
    usuario: UsuarioDTO;
}