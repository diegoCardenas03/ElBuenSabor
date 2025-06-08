import { DetalleProductoDTO } from '../DetalleProducto/DetalleProductoDTO';
import { RubroProductoDTO } from '../RubroProducto/RubroProductoDTO';

export interface ProductoDTO {
    id: number;
    denominacion: string;
    descripcion: string;
    tiempoEstimadoPreparacion: number;
    precioVenta: number;
    urlImagen: string;
    activo: boolean;
    rubro: RubroProductoDTO;
    detalleProductos: DetalleProductoDTO[];
}