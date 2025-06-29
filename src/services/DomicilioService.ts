import { DomicilioDTO } from "../types/Domicilio/DomicilioDTO";
import { DomicilioResponseDTO } from "../types/Domicilio/DomicilioResponseDTO";
import { BackendClient } from "./BackendClient"

export class DomicilioService extends BackendClient<DomicilioDTO, DomicilioResponseDTO>{
  constructor(){
    super("http://localhost:8080/api/domicilios"); 
  }

  async getByClienteId(clienteId: number): Promise<DomicilioResponseDTO[]> {
    const response = await fetch(`${this.baseUrl}/cliente/${clienteId}`);
    if (!response.ok) {
      throw new Error(`Error al obtener domicilios del cliente con ID ${clienteId}`);
    }
    const data = await response.json();
    return data as DomicilioResponseDTO[];
  }
}
