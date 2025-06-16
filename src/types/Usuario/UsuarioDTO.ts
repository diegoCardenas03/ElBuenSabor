export interface UsuarioDTO {
  email?: string
  contrasenia?: string // Opcional para registro social
  connection?: string
  auth0Id?: string
  roles: string[]
  nickName?: string // Para registro social
}
