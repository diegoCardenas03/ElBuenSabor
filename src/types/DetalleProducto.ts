import { Producto } from './Producto';
import { Insumo } from './Insumo';

export interface DetalleProducto {
    id?: number;
    cantidad: number;
    producto: Producto;
    insumo: Insumo;
}