import { ProductoDTO } from "../types/Producto/ProductoDTO";
import { BackendClient } from "./BackendClient";
import { ProductoResponseDTO } from "../types/Producto/ProductoResponseDTO";

export class ProductoService extends BackendClient<ProductoDTO, ProductoResponseDTO> {
  constructor() {
    super("http://localhost:8080/api/productos"); 
  }

}