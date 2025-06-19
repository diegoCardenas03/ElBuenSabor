import { ClienteDTO } from "../types/Cliente/ClienteDTO";
import { ClienteResponseDTO } from "../types/Cliente/ClienteResponseDTO";
import { BackendClient } from "./BackendClient"

export class ClientesService extends BackendClient<ClienteDTO, ClienteResponseDTO> {
  constructor(){
    super("http://localhost:8080/api/clientes"); 
  }

  //Exclusivos de cliente

  async getByEmail(email: string): Promise<ClienteResponseDTO | null> {
    return this.getByAny('email', email);
  }
}
