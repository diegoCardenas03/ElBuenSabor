export interface FacturaDTO {
    fechaFacturacion: string;      // LocalDate como string
    horaFacturacion: string;       // LocalTime como string
    numeroComprobante: number;
    totalVenta: string;
    montoDescuento: number;
    costoEnvio: number;
}