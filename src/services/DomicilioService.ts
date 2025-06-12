import { DomicilioDTO } from "../types/Domicilio/DomicilioDTO";
import { DomicilioResponseDTO } from "../types/Domicilio/DomicilioResponseDTO";
import { BackendClient } from "./BackendClient"

export class DomicilioService extends BackendClient<DomicilioDTO, DomicilioResponseDTO>{
  constructor(){
    super("http://localhost:8080/api/domicilios"); 
  }
}
