import { RubroProducto } from './RubroProducto';
import { DetalleProducto } from './DetalleProducto';

export interface Producto{
    id?: number;
    denominacion: string;
    descripcion: string;
    tiempoEstimadoPreparacion: number;
    precioVenta: number;
    precioCosto: number;
    urlImagen: string;
    activo: boolean;
    rubro: RubroProducto;
    detalleProductos: DetalleProducto[];
}