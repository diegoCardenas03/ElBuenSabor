import { DomicilioDTO } from "../types/Domicilio/DomicilioDTO";
import { DomicilioResponseDTO } from "../types/Domicilio/DomicilioResponseDTO";
import { BackendClient, buildHeaders } from "./BackendClient"

export class DomicilioService extends BackendClient<DomicilioDTO, DomicilioResponseDTO> {
  constructor() {
    super("http://localhost:8080/api/domicilios");
  }

  async getByClienteId(clienteId: number, token?: string): Promise<DomicilioResponseDTO[]> {
    const response = await fetch(`${this.baseUrl}/cliente/${clienteId}`, {
      headers: token ? { ...buildHeaders(token, undefined) } : undefined,
    });
    if (!response.ok) {
      throw new Error(`Error al obtener domicilios del cliente con ID ${clienteId}`);
    }
    const data = await response.json();
    return data as DomicilioResponseDTO[];
  }
}
