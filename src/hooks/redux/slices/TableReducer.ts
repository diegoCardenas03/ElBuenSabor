import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { InsumoResponseDTO } from "../../../types/Insumo/InsumoResponseDTO";
import { ProductoDTO } from "../../../types/Producto/ProductoDTO";

// El tipo de dato puede ser insumo o producto (o ambos)
type TableElement = InsumoResponseDTO | ProductoDTO;

interface IInitialState {
  dataTable: TableElement[]; // Datos de la tabla (pueden ser insumos o productos)
  elementActive: null | TableElement; // Elemento activo seleccionado
}

const initialState: IInitialState = {
  dataTable: [],
  elementActive: null,
};

interface PayloadSetElement {
  element: TableElement;
}

const TablaReducer = createSlice({
  name: "TablaReducer",
  initialState,
  reducers: {
    setDataTable(state, action: PayloadAction<TableElement[]>) {
      state.dataTable = action.payload;
    },
    setElementActive(state, action: PayloadAction<PayloadSetElement>) {
      state.elementActive = action.payload.element;
    },
    removeElementActive(state) {
      state.elementActive = null;
    },
  },
});

export const { setDataTable, setElementActive, removeElementActive } =
  TablaReducer.actions;

export default TablaReducer.reducer;