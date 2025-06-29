import { DetallePromocionDTO } from '../DetallePromocion/DetallePromocionDTO';

export interface PromocionDTO {
    denominacion: string;
    urlImagen: string;
    fechaDesde: string;      // LocalDate como string
    fechaHasta: string;      // LocalDate como string
    descuento: number;       // Double como number
    descripcion: string;
    detallePromociones: DetallePromocionDTO[];
    activo: boolean;
}