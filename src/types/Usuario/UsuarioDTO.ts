export interface UsuarioDTO {
    email: string;
    contrasenia?: string;
    connection?: string;
    auth0Id?: string;
    roles: string[];
}