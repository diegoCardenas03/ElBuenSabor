import { RubroInsumoResponseDTO } from './RubroInsumoResponseDTO';
export interface RubroInsumoDTO {
    denominacion: string;
    tipo: "Insumo"
    activo: boolean;
    rubroPadre?: RubroInsumoDTO;
     subRubros: RubroInsumoResponseDTO[];
}