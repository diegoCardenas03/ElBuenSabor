import { ProductoResponseDTO } from '../Producto/ProductoResponseDTO';
import { InsumoResponseDTO } from '../Insumo/InsumoResponseDTO';

export type ProductoUnificado = ProductoResponseDTO | (InsumoResponseDTO & { tipo: 'insumo' });

export const isInsumo = (item: ProductoUnificado): item is InsumoResponseDTO & { tipo: 'insumo' } => {
  return 'tipo' in item && item.tipo === 'insumo';
};

export const isProducto = (item: ProductoUnificado): item is ProductoResponseDTO => {
  return !('tipo' in item);
};