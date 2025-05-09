import { Cliente } from './Cliente';
import { Domicilio } from './Domicilio';
import { DetallePedido } from './DetallePedido';
import { Factura } from './Factura';
import { Estado } from './enums/Estado';
import { TipoEnvio } from './enums/TipoEnvio';
import { FormaPago } from './enums/FormaPago';

export interface Pedido {
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
    cliente: Cliente;
    domicilio: Domicilio;
    detallePedidos: DetallePedido[];
    factura: Factura;
}