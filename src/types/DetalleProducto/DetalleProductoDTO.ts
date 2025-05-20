import { InsumoDTO } from '../Insumo/InsumoDTO';

export interface DetalleProductoDTO {
    cantidad: number;
    insumo: InsumoDTO;
}