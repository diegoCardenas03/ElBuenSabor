import { FormaPago } from './enums/FormaPago';

export interface Factura {
    id?: number;
    fechaFacturacion: string;      // LocalDate como string
    horaFacturacion: string;       // LocalTime como string
    numeroComprobante: number;
    formaPago: FormaPago;
    numeroTarjeta: string;
    totalVenta: string;
    montoDescuento: number;
    costoEnvio: number;
}