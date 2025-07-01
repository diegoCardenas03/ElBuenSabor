import { BackendClient } from "./BackendClient";
import { RubroInsumoDTO } from "../types/RubroInsumo/RubroInsumoDTO";
import { RubroInsumoResponseDTO } from "../types/RubroInsumo/RubroInsumoResponseDTO";

export class RubroInsumoService extends BackendClient<RubroInsumoDTO, RubroInsumoResponseDTO> {
  constructor() {
    super("http://localhost:8080/api/rubroinsumos");
  }

  async updateRubroInsumo(id: number, rubroInsumo: RubroInsumoDTO, token: string): Promise<RubroInsumoResponseDTO> {
    const response = await fetch(`${this.baseUrl}/update/${id}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rubroInsumo)
    });
    if (!response.ok) throw new Error('Error en PUT rubro insumo');
    return response.json();
  }
}