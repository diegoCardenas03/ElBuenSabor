export interface DomicilioResponseDTO {
    id?: number;
    calle: string;
    numero: number;
    localidad: string;
    codigoPostal: number;
    activo: boolean;
}