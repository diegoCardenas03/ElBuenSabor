import { DetalleDomicilioDTO } from "../types/DetalleDomicilio/DetalleDomicilioDTO";
import { DetalleDomicilioResponseDTO } from "../types/DetalleDomicilio/DetalleDomicilioResponseDTO";
import { BackendClient } from "./BackendClient"

export class DetalleDomicilioService extends BackendClient<DetalleDomicilioDTO, DetalleDomicilioResponseDTO>{
  constructor(){
    super("http://localhost:8080/api/detalledomicilios"); 
  }
}