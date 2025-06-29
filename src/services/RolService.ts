import { RolDTO } from "../types/Rol/RolDTO";
import { BackendClient } from "./BackendClient";
import { RolResponseDTO } from "../types/Rol/RolResponseDTO";

export class RolService extends BackendClient<RolDTO, RolResponseDTO> {
  constructor() {
    super("http://localhost:8080/api/admin/roles"); 
  }

}