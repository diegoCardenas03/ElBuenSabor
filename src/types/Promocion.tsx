import { DetallePromocion } from './DetallePromocion';

export interface Promocion {
    id?: number;
    denominacion: string;
    urlImagen: string;
    fechaDesde: string;      // LocalDate como string
    fechaHasta: string;      // LocalDate como string
    descuento: number;       // Double como number
    detallePromociones: DetallePromocion[];
}