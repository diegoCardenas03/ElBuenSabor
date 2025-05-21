import { ClienteDTO } from "../Cliente/ClienteDTO";
import { DetallePedidoDTO } from "../DetallePedido/DetallePedidoDTO";
import { DomicilioDTO } from "../Domicilio/DomicilioDTO";
import { Estado } from "../enums/Estado";
import { FormaPago } from "../enums/FormaPago";
import { TipoEnvio } from "../enums/TipoEnvio";
import { FacturaDTO } from "../Factura/FacturaDTO";

export interface PedidoResponseDTO {
    id?: number;
    fecha: string;           // LocalDate se convierte a string
    hora: string;           // LocalTime se convierte a string
    codigoOrden: string;
    estado: Estado;
    horaEstimadaFin: string; // LocalTime se convierte a string
    tipoEnvio: TipoEnvio;
    totalVenta: number;      // Double se convierte a number
    totalCosto: number;      // Double se convierte a number
    formaPago: FormaPago;
    cliente: ClienteDTO;
    domicilio: DomicilioDTO;
    detallePedido: DetallePedidoDTO[];
    factura: FacturaDTO;
}