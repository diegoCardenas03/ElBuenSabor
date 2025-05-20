import { UnidadMedida } from "../enums/UnidadMedida";
import { RubroInsumoResponseDTO } from "../RubroInsumo/RubroInsumoResponseDTO";

export interface InsumoResponseDTO {
    id?: number;
    denominacion: string;
    urlImagen: string;
    precioCosto: number;
    precioVenta: number;
    stockActual: number;
    stockMinimo: number;
    esParaElaborar: boolean;
    activo: boolean;
    unidadMedida: UnidadMedida;
    rubro: RubroInsumoResponseDTO;
}