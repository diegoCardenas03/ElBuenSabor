import { DetalleProductoResponseDTO } from "../DetalleProducto/DetalleProductoResponseDTO";
import { RubroProductoResponseDTO } from "../RubroProducto/RubroProductoResponseDTO";

export interface ProductoResponseDTO {
    id: number;
    denominacion: string;
    descripcion: string;
    tiempoEstimadoPreparacion: number;
    precioVenta: number;
    precioCosto: number;
    urlImagen: string;
    activo: boolean;
    rubro: RubroProductoResponseDTO;
    detalleProductos: DetalleProductoResponseDTO[];
}