import { ProductoDTO } from '../Producto/ProductoDTO';
import { InsumoDTO } from '../Insumo/InsumoDTO';

export interface DetallePromocionDTO {
    cantidad: number;
    producto: ProductoDTO;
    insumo: InsumoDTO;
}