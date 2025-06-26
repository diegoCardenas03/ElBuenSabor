import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { InsumoResponseDTO } from "../../../types/Insumo/InsumoResponseDTO";
import { ProductoResponseDTO } from "../../../types/Producto/ProductoResponseDTO";
import { PedidoResponseDTO } from "../../../types/Pedido/PedidoResponseDTO";
import { ClienteResponseDTO } from "../../../types/Cliente/ClienteResponseDTO";
import { EmpleadoResponseDTO } from "../../../types/Empleado/EmpleadoResponseDTO";
import { PromocionResponseDTO } from "../../../types/Promocion/PromocionResponseDTO";

// El tipo de dato puede ser insumo o producto (o ambos)
type TableElement = InsumoResponseDTO | ProductoResponseDTO |  PedidoResponseDTO | PromocionResponseDTO | ClienteResponseDTO | EmpleadoResponseDTO;

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