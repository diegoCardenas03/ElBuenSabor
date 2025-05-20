import { DetallePromocionDTO } from '../DetallePromocion/DetallePromocionDTO';

export interface Promocion {
    denominacion: string;
    urlImagen: string;
    fechaDesde: string;      // LocalDate como string
    fechaHasta: string;      // LocalDate como string
    descuento: number;       // Double como number
    detallePromociones: DetallePromocionDTO[];
}