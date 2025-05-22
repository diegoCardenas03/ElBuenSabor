import { InsumoDTO } from '../Insumo/InsumoDTO';

export interface DetalleProductoDTO {
    id?: number;
    cantidad: number;
    insumo: InsumoDTO[];
}