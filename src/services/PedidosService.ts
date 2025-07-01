import { Estado } from "../types/enums/Estado";
import { PedidoDTO } from "../types/Pedido/PedidoDTO"
import { PedidoResponseDTO } from "../types/Pedido/PedidoResponseDTO"
import { BackendClient } from "./BackendClient"

export class PedidosService extends BackendClient<PedidoDTO, PedidoResponseDTO> {
  constructor() {
    super("http://localhost:8080/api/pedidos");
  }

  async updateEstadoPedido(pedidoId: number, nuevoEstado: Estado, token: string): Promise<PedidoResponseDTO> {
    const response = await fetch(
      `http://localhost:8080/api/pedidos/actualizar-estado/${pedidoId}?estado=${nuevoEstado}`,
      {
        method: "PUT", // o "POST", "PUT", etc.
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json", // si envías JSON
          // otros headers si necesitas
        }
      }, // o "POST", "PUT", etc.

    );
    if (!response.ok) throw new Error("Error al actualizar estado del pedido");
    return await response.json();
  }

  async getPedidoByCodigo(codigo: string, token: string): Promise<PedidoResponseDTO> {
    const response = await fetch(`http://localhost:8080/api/pedidos/codigo/${codigo}`, {
      method: "GET", 
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json", 
      },
     
    });
    if (!response.ok) throw new Error("No se pudo obtener el pedido por código");
    return await response.json();
  };

  async getPedidosByUsuario(clienteId: number, token: string): Promise<PedidoResponseDTO[]> {
    const response = await fetch(`http://localhost:8080/api/pedidos/cliente/${clienteId}`, {
      method: "GET", 
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json", 
      },
     
    });
    if (!response.ok) throw new Error("No se pudieron obtener los pedidos del usuario");
    return await response.json();
  }
}