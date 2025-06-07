export interface RubroInsumo {
    id: number;
    denominacion: string;
    activo: boolean;
    tipo: "Insumo";
    rubroPadre?: RubroInsumo;
    subRubros: RubroInsumo[];
}
