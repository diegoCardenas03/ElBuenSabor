import { PromocionResponseDTO} from "../types/Promocion/PromocionResponseDTO";
import { PromocionDTO } from "../types/Promocion/PromocionDTO";
import { BackendClient } from "./BackendClient";

export class PromocionService extends BackendClient<PromocionDTO, PromocionResponseDTO> {
  constructor() {
    super("http://localhost:8080/api/promociones"); 
  }
}