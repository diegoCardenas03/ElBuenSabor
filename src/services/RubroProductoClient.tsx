import { BackendClient } from "./BackendClient";
import { RubroProductoDTO } from "../types/RubroProducto/RubroProductoDTO";

export class RubroProductoClient extends BackendClient<RubroProductoDTO, RubroProductoDTO> {
  constructor() {
    super("http://localhost:8080/api/rubroproductos");
  }
}