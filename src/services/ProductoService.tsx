import { ProductoDTO } from "../types/Producto/ProductoDTO";
import { BackendClient } from "./BackendClient";
import { ProductoResponseDTO } from "../types/Producto/ProductoResponseDTO";

// Si tienes un ProductoResponseDTO, puedes importarlo y usarlo en vez de ProductoDTO en la respuesta
export class ProductoService extends BackendClient<ProductoDTO, ProductoResponseDTO> {
  constructor() {
    super("http://localhost:8080/api/productos"); // Cambia la URL si es necesario
  }

  // Si necesitas métodos adicionales, agrégalos aquí
}