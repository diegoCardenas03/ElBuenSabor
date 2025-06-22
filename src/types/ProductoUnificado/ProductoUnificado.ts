import { ProductoResponseDTO } from '../Producto/ProductoResponseDTO';
import { InsumoResponseDTO } from '../Insumo/InsumoResponseDTO';
import { PromocionResponseDTO } from "../Promocion/PromocionResponseDTO";
export type ProductoUnificado = ProductoResponseDTO | (InsumoResponseDTO & { tipo: 'insumo' }) | PromocionResponseDTO;

export const isInsumo = (item: ProductoUnificado): item is InsumoResponseDTO & { tipo: 'insumo' } => {
  return 'tipo' in item && item.tipo === 'insumo';
};

export const isProducto = (item: ProductoUnificado): item is ProductoResponseDTO => {
  return !('tipo' in item);
};

export function isPromocion(item: ProductoUnificado): item is PromocionResponseDTO {
  return 'total' in item && 'denominacion' in item && 'id' in item;
}