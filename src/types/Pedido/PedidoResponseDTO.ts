import { ClienteResponseDTO } from "../Cliente/ClienteResponseDTO";
import { DetallePedidoResponseDTO } from "../DetallePedido/DetallePedidoResponseDTO";
import { DomicilioResponseDTO } from "../Domicilio/DomicilioResponseDTO";
import { Estado } from "../enums/Estado";
import { FormaPago } from "../enums/FormaPago";
import { TipoEnvio } from "../enums/TipoEnvio";
import { FacturaResponseDTO } from "../Factura/FacturaResponseDTO";

export interface PedidoResponseDTO {
    id?: number;
    fecha: string;           // LocalDate se convierte a string
    hora?: string;           // LocalTime se convierte a string
    codigo: string;
    estado: Estado;
    horaEstimadaFin?: string; // LocalTime se convierte a string
    tipoEnvio: TipoEnvio;
    totalVenta: number;      // Double se convierte a number
    totalCosto?: number;      // Double se convierte a number
    formaPago?: FormaPago;
    cliente?: ClienteResponseDTO;
    domicilio?: DomicilioResponseDTO;
    detallePedido?: DetallePedidoResponseDTO[];
    factura?: FacturaResponseDTO;
}