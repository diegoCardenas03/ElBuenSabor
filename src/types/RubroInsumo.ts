export interface RubroInsumo {
    id?: number;
    denominacion: string;
    activo: boolean;
    rubroPadre?: RubroInsumo;
    subRubros: RubroInsumo[];
}