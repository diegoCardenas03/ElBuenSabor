import { DetalleDomicilioResponseDTO } from "../DetalleDomicilio/DetalleDomicilioResponseDTO";
import { UsuarioResponseDTO } from "../Usuario/UsuarioResponseDTO";

export interface ClienteResponseDTO{
    id: number;
    nombreCompleto: string;
    telefono: string;
    activo: boolean;
    usuario: UsuarioResponseDTO;
    detalleDomicilios: DetalleDomicilioResponseDTO;
}