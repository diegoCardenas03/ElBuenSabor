import { RubroProductoDTO } from '../RubroProducto/RubroProductoDTO';
import { DetalleProductoDTO } from '../DetalleProducto/DetalleProductoDTO';

export interface ProductoDTO {
    denominacion: string;
    descripcion: string;
    tiempoEstimadoPreparacion: number;
    precioVenta: number;
    urlImagen: string;
    activo: boolean;
    rubro: RubroProductoDTO[];
    detalleProductos: DetalleProductoDTO[];
}