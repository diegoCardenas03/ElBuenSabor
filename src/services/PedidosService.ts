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
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      },
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

  async getPedidoByEstado(estado: Estado, token: string): Promise<PedidoResponseDTO[]> {
    const response = await fetch(`http://localhost:8080/api/pedidos/estado?estado=${estado}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },

    });
    if (!response.ok) throw new Error("No se pudo obtener el pedido por estado");
    return await response.json();
  };

    async agregarTiempo(pedidoId: number, token: string): Promise<PedidoResponseDTO> {
    const response = await fetch(
      `http://localhost:8080/api/pedidos/agregar-min/${pedidoId}?minutos=5`,
      {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      },
    );
    if (!response.ok) throw new Error("Error al agregar tiempo al pedido");
    return await response.json();
  }
}