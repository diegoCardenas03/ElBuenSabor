export interface DomicilioResponseDTO {
    id: number;
    calle: string;
    numero: number;
    localidad: string;
    codigoPostal: number;
    latitud: number;
    longitud: number;
    activo: boolean;
}