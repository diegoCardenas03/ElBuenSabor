import { BackendClient } from "./BackendClient";
import { RubroInsumoDTO } from "../types/RubroInsumo/RubroInsumoDTO";

export class RubroInsumoClient extends BackendClient<RubroInsumoDTO, RubroInsumoDTO> {
  constructor() {
    super("http://localhost:8080/api/rubroinsumos");
  }
}