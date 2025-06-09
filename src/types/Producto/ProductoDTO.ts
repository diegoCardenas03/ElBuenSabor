import { DetalleProductoDTO } from '../DetalleProducto/DetalleProductoDTO';

export interface ProductoDTO {
    id: number;
    denominacion: string;
    descripcion: string;
    tiempoEstimadoPreparacion: number;
    precioVenta: number;
    urlImagen: string;
    activo: boolean;
    rubroId: number;
    detalleProductos: DetalleProductoDTO[];
}