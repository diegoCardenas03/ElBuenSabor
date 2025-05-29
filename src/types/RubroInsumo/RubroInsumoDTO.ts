export interface RubroInsumoDTO {
    id?: number;
    denominacion: string;
    tipo: "Insumo"
    activo: boolean;
    rubroPadreId?: number;
}