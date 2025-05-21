export interface RubroInsumoDTO {
    denominacion: string;
    activo: boolean;
    rubroPadre?: RubroInsumoDTO;
}