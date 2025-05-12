import { Pedido } from './Pedido';
import { Producto } from './Producto';
import { Insumo } from './Insumo';

export interface DetallePedido {
    id?: number;
    cantidad: number;
    subTotal: number;
    subTotalCosto: number;
    pedido: Pedido;
    producto: Producto;
    insumo: Insumo;
}