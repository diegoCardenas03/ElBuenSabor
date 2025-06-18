import { DetallePromocionResponseDTO } from '../DetallePromocion/DetallePromocionResponseDTO';

export interface PromocionResponseDTO {
    id?: number;
    denominacion: string;
    urlImagen: string;
    fechaDesde: string;      // LocalDate como string
    fechaHasta: string;      // LocalDate como string
    descuento: number;       // Double como number
    precioVenta: number;
    precioCosto: number; 
    detallePromociones: DetallePromocionResponseDTO[];
}