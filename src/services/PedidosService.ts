import { Estado } from "../types/enums/Estado";
import { PedidoDTO } from "../types/Pedido/PedidoDTO"
import { PedidoResponseDTO } from "../types/Pedido/PedidoResponseDTO"
import { BackendClient } from "./BackendClient"

export class PedidosService extends BackendClient<PedidoDTO, PedidoResponseDTO> {
  constructor() {
    super("http://localhost:8080/api/pedidos");
  }

  async updateEstadoPedido(pedidoId: number, nuevoEstado: Estado): Promise<PedidoResponseDTO> {
    const response = await fetch(
      `http://localhost:8080/api/pedidos/actualizar-estado/${pedidoId}?estado=${nuevoEstado}`,
      { method: "PUT" }
    );
    if (!response.ok) throw new Error("Error al actualizar estado del pedido");
    return await response.json();
  }

  async getPedidoByCodigo(codigo: string): Promise<PedidoResponseDTO> {
    const response = await fetch(`http://localhost:8080/api/pedidos/codigo/${codigo}`);
    if (!response.ok) throw new Error("No se pudo obtener el pedido por código");
    return await response.json();
  };

  async getPedidosByUsuario(clienteId: number): Promise<PedidoResponseDTO[]> {
    const response = await fetch(`http://localhost:8080/api/pedidos/cliente/${clienteId}`);
    if (!response.ok) throw new Error("No se pudieron obtener los pedidos del usuario");
    return await response.json();
  }
}