import { PromocionResponseDTO } from "../types/Promocion/PromocionResponseDTO";
export function isPromocion(item: any): item is PromocionResponseDTO {
     return 'precioVenta' in item && 'detallePromociones' in item && 'descuento' in item;
}