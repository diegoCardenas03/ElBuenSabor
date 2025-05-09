import { Cliente } from './Cliente';
import { Domicilio } from './Domicilio';

export interface DetalleDomicilio {
    id?: number;
    cliente: Cliente;
    domicilio: Domicilio;
}