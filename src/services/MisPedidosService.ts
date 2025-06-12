import { PedidoDTO } from "../types/Pedido/PedidoDTO"
import { PedidoResponseDTO } from "../types/Pedido/PedidoResponseDTO"
import { BackendClient } from "./BackendClient"

export class MisPedidosService extends BackendClient<PedidoDTO, PedidoResponseDTO> {
  constructor(){
    super("http://localhost:8080/api/pedidos"); 
  }
}
