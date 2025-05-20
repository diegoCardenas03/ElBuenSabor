import { ProductoDTO } from '../Producto/ProductoDTO';
import { InsumoDTO } from '../Insumo/InsumoDTO';

export interface DetallePedidoDTO {
  producto: ProductoDTO[];
  insumo: InsumoDTO;
  cantidad: number;
}