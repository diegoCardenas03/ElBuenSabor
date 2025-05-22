import { ProductoDTO } from '../Producto/ProductoDTO';
import { InsumoDTO } from '../Insumo/InsumoDTO';

export interface DetallePedidoDTO {
  id: number;
  productoId?: number;
  insumo?: InsumoDTO[];
  cantidad: number;
}