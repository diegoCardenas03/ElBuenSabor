import { ClienteDTO } from '../Cliente/ClienteDTO';
import { DomicilioDTO } from '../Domicilio/DomicilioDTO';
import { DetallePedidoDTO } from '../DetallePedido/DetallePedidoDTO';
import { Estado } from '../enums/Estado';
import { TipoEnvio } from '../enums/TipoEnvio';

export interface PedidoDTO {        
    estado: Estado;
    tipoEnvio: TipoEnvio;
    cliente: ClienteDTO;
    domicilio: DomicilioDTO;
    detallePedido: DetallePedidoDTO[];
}