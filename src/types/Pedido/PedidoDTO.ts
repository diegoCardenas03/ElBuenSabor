import { DetallePedidoDTO } from '../DetallePedido/DetallePedidoDTO';
import { TipoEnvio } from '../enums/TipoEnvio';
import { FormaPago } from '../enums/FormaPago';

export interface PedidoDTO {        
    tipoEnvio: TipoEnvio;
    formaPago: FormaPago;
    clienteId: number;
    domicilioId?: number;
    comentario?: string;
    detallePedidos: DetallePedidoDTO[];
}