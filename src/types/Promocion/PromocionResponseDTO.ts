import { DetallePromocionDTO } from '../DetallePromocion/DetallePromocionDTO';

export interface DetallePromocionResponseDTO {
    id?: number;
    denominacion: string;
    urlImagen: string;
    fechaDesde: string;      // LocalDate como string
    fechaHasta: string;      // LocalDate como string
    descuento: number;       // Double como number
    detallePromociones: DetallePromocionDTO[];
}