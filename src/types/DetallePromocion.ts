import { Promocion } from './Promocion';
import { Producto } from './Producto';
import { Insumo } from './Insumo';

export interface DetallePromocion {
    id?: number;
    cantidad: number;
    promocion: Promocion;
    producto: Producto;
    insumo: Insumo;
}