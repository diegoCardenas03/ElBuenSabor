import { UnidadMedida } from '../enums/UnidadMedida';
// import { RubroInsumoDTO } from '../RubroInsumo/RubroInsumoDTO';


export interface InsumoDTO {
    id: number;
    denominacion: string;
    urlImagen: string;
    precioCosto: number;
    precioVenta: number;
    stockActual: number;
    stockMinimo: number;
    esParaElaborar: boolean;
    activo: boolean;
    unidadMedida: UnidadMedida;
    rubroId: number;
    descripcion: string;
}