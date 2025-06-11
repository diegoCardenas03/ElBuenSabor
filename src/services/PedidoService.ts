import { PedidoDTO } from "../types/Pedido/PedidoDTO";
import { BackendClient } from "./BackendClient";
import { PedidoResponseDTO } from "../types/Pedido/PedidoResponseDTO";
export class PedidoService extends BackendClient<PedidoDTO, PedidoResponseDTO> {
  constructor() {
    super("http://localhost:8080/api/pedidos"); 
  }


}