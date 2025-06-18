import { DomicilioResponseDTO } from "../Domicilio/DomicilioResponseDTO";
import { UsuarioResponseDTO } from "../Usuario/UsuarioResponseDTO";

export interface EmpleadoResponseDTO {
    id: number;
    nombreCompleto: string;
    telefono: string;
    activo: boolean;
    usuario: UsuarioResponseDTO;
    domicilio: DomicilioResponseDTO;
}