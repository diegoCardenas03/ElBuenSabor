import { UnidadMedida } from './enums/UnidadMedida';


export interface Insumo {
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
    rubro: number;
}