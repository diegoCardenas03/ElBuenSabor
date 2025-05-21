import { ClienteDTO } from '../Cliente/ClienteDTO';
import { DomicilioDTO } from '../Domicilio/DomicilioDTO';

export interface DetalleDomicilioDTO {
    cliente: ClienteDTO;
    domicilio: DomicilioDTO;
}