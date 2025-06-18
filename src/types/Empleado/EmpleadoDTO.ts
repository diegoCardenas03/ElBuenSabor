import { UsuarioDTO } from '../Usuario/UsuarioDTO';
import { DomicilioDTO } from '../Domicilio/DomicilioDTO';

export interface EmpleadoDTO {
    id: number;
    nombreCompleto: string;
    telefono: string;
    usuario: UsuarioDTO;
    domicilio: DomicilioDTO;
}