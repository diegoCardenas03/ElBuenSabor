import { ClienteResponseDTO } from "../Cliente/ClienteResponseDTO";
import { DetallePedidoResponseDTO } from "../DetallePedido/DetallePedidoResponseDTO";
import { DomicilioResponseDTO } from "../Domicilio/DomicilioResponseDTO";
import { Estado } from "../enums/Estado";
import { FormaPago } from "../enums/FormaPago";
import { TipoEnvio } from "../enums/TipoEnvio";
import { FacturaDTO } from "../Factura/FacturaDTO";

export interface ProductoResponseDTO {
    fecha: Date;
    hora: string;
    codigo: string;
    estado: Estado;
    horaEstimadaFin: string;
    tipoEnvio: TipoEnvio;
    totalVenta: number;
    totalCosto: number;
    formaPago: FormaPago;
    cliente: ClienteResponseDTO;
    domicilio: DomicilioResponseDTO;
    detallePedidos: DetallePedidoResponseDTO;
    factura: FacturaDTO;
}