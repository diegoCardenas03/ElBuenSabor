import { InsumoResponseDTO } from "../Insumo/InsumoResponseDTO";

export interface DetalleProductoResponseDTO{
    id?: number;
    cantidad: number;
    insumo: InsumoResponseDTO;
}