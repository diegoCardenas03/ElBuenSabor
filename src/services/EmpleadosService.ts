import { EmpleadoDTO } from "../types/Empleado/EmpleadoDTO";
import { EmpleadoResponseDTO } from "../types/Empleado/EmpleadoResponseDTO";
import { BackendClient } from "./BackendClient"

export class EmpleadosService extends BackendClient<EmpleadoDTO, EmpleadoResponseDTO> {
  constructor(){
    super("http://localhost:8080/api/empleados"); 
  }
}
