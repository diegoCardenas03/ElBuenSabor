import { InsumoResponseDTO } from "../Insumo/InsumoResponseDTO";
import { ProductoResponseDTO } from "../Producto/ProductoResponseDTO";

export interface DetallePromocionResponseDTO {
    id?: number;
    cantidad: number;
    producto: ProductoResponseDTO;
    insumo: InsumoResponseDTO;
}