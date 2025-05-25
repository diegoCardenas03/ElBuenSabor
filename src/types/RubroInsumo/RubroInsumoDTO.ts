import { RubroInsumoResponseDTO } from './RubroInsumoResponseDTO';
export interface RubroInsumoDTO {
    denominacion: string;
    activo: boolean;
    rubroPadre?: RubroInsumoDTO;
     subRubros: RubroInsumoResponseDTO[];
}