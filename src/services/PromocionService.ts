import { PromocionResponseDTO} from "../types/Promocion/PromocionResponseDTO";
import { PromocionDTO } from "../types/Promocion/PromocionDTO";
import { BackendClient } from "./BackendClient";
// Clase PromocionService que extiende BackendClient para interactuar con la API de promociones
export class PromocionService extends BackendClient<PromocionDTO, PromocionResponseDTO> {
  constructor() {
    super("http://localhost:8080/api/promociones"); // URL base de la API de promociones
  }
}