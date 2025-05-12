import { Usuario } from './Usuario';
import { DetalleDomicilio } from './DetalleDomicilios';

export interface Cliente {
    id?: number;
    nombreCompleto: string;
    telefono: string;
    activo: boolean;
    usuario: Usuario;
    detalleDomicilios: DetalleDomicilio[];
}