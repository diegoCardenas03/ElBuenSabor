export interface Domicilio {
    id?: number;
    calle: string;
    numero: number;
    localidad: string;
    codigoPostal: number;
    infoAdicional?: string;
    activo: boolean;
}