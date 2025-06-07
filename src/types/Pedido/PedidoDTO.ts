import { DetallePedidoDTO } from '../DetallePedido/DetallePedidoDTO';
import { Estado } from '../enums/Estado';
import { TipoEnvio } from '../enums/TipoEnvio';
import { FormaPago } from '../enums/FormaPago';

export interface PedidoDTO {        
    estado: Estado;
    tipoEnvio: TipoEnvio;
    formaPago: FormaPago;
    clienteId: number;
    domicilioId: number;
    detallePedido: DetallePedidoDTO[];
}