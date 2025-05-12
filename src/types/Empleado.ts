import { Usuario } from './Usuario';
import { Domicilio } from './Domicilio';

export interface Empleado {
    id?: number;
    nombreCompleto: string;
    telefono: string;
    activo: boolean;
    usuario: Usuario;
    domicilio: Domicilio;
}