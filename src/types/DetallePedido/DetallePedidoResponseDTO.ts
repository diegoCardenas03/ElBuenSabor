import { InsumoResponseDTO } from "../Insumo/InsumoResponseDTO";
import { ProductoResponseDTO } from "../Producto/ProductoResponseDTO";
import { PromocionResponseDTO } from "../Promocion/PromocionResponseDTO";

export interface DetallePedidoResponseDTO {
    id?: number;
    cantidad: number;
    subTotal: number;
    subTotalCosto: number;
    producto?: ProductoResponseDTO;
    insumo?: InsumoResponseDTO;
    promocion?: PromocionResponseDTO;
}