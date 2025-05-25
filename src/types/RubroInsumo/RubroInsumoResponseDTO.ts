export interface RubroInsumoResponseDTO {
    id?: number;
    denominacion: string;
    activo: boolean;
    rubroPadre?: RubroInsumoResponseDTO;
    subRubros: RubroInsumoResponseDTO[];
}