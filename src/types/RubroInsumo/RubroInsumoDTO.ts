export interface RubroInsumoDTO {
    denominacion: string;
    tipo: "Insumo"
    activo: boolean;
    rubroPadre?: RubroInsumoDTO;
}