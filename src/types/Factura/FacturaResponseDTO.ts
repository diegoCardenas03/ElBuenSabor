import { FormaPago } from "../enums/FormaPago";

export interface FacturaResponseDTO {
    id?: number;
    fechaFacturacion: string;      // LocalDate como string
    horaFacturacion: string;       // LocalTime como string
    numeroComprobante: number;
    formaPago: FormaPago;
    totalVenta: string;
    montoDescuento: number;
    costoEnvio: number;
}