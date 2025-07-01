import { BackendClient } from "./BackendClient";
import { RubroProductoDTO } from "../types/RubroProducto/RubroProductoDTO";
import { RubroProductoResponseDTO } from "../types/RubroProducto/RubroProductoResponseDTO";

export class RubroProductoService extends BackendClient<RubroProductoDTO, RubroProductoResponseDTO> {
  constructor() {
    super("http://localhost:8080/api/rubroproductos");
  }

  async updateRubroProducto(id: number, rubroProducto: RubroProductoDTO, token: string): Promise<RubroProductoResponseDTO> {
      const response = await fetch(`${this.baseUrl}/update/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rubroProducto)
      });
      if (!response.ok) throw new Error('Error en PUT rubro probucto');
      return response.json();
    }
}