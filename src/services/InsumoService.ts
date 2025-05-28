// Importamos el tipo de dato IPersona y la clase BackendClient
import { InsumoResponseDTO } from "../types/Insumo/InsumoResponseDTO";
import { InsumoDTO } from "../types/Insumo/InsumoDTO";
import { BackendClient } from "./BackendClient";

// Clase Insumoservice que extiende BackendClient para interactuar con la API de insumos
export class InsumoService extends BackendClient<InsumoDTO, InsumoResponseDTO> {
  constructor() {
    super("http://localhost:8080/api/insumos"); // <-- Aquí va el link del backend
  }
}
