import { UsuarioDTO } from '../Usuario/UsuarioDTO';
import { DomicilioDTO } from '../Domicilio/DomicilioDTO';

export interface EmpleadoDTO {
    nombreCompleto: string;
    telefono: string;
    usuario: UsuarioDTO;
    domicilio: DomicilioDTO;
    activo: boolean;
}