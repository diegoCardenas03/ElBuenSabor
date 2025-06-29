import { DomicilioDTO } from "../types/Domicilio/DomicilioDTO";
import { DomicilioResponseDTO } from "../types/Domicilio/DomicilioResponseDTO";

export const formatearDireccion = (d?: DomicilioDTO | null | DomicilioResponseDTO) =>  d ? `${d.calle} ${d.numero}, ${d.localidad}, ${d.codigoPostal}`: '';

export function truncar(frase: string, max = 30) {
    return frase.length > max ? frase.slice(0, max) + '...' : frase;
}