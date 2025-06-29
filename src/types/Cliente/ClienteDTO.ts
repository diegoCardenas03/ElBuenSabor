import type { UsuarioDTO } from "../Usuario/UsuarioDTO"

export interface ClienteDTO {
  nombreCompleto: string
  telefono?: string // Opcional para registro social
  usuario: UsuarioDTO
}
