import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { PedidoResponseDTO } from "../../../types/Pedido/PedidoResponseDTO";
import { Estado } from "../../../types/enums/Estado";
import { PedidosService } from "../../../services/PedidosService";
import { PedidoDTO } from "../../../types/Pedido/PedidoDTO";

interface PedidoState {
  pedidoEnCurso: PedidoResponseDTO | null;
  loading: boolean;
  error: string | null;
}

const initialState: PedidoState = {
  pedidoEnCurso: null,
  loading: false,
  error: null,
};

const pedidosService = new PedidosService();

export const fetchPedidoByCodigo = createAsyncThunk<PedidoResponseDTO, string>(
  "pedido/fetchPedidoByCodigo",
  async (codigo, { rejectWithValue }) => {
    try {
      return await pedidosService.getPedidoByCodigo(codigo);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateEstadoPedidoThunk = createAsyncThunk<PedidoResponseDTO, { pedidoId: number; nuevoEstado: Estado }>(
  "pedido/updateEstadoPedido",
  async ({ pedidoId, nuevoEstado }, { rejectWithValue }) => {
    try {
      return await pedidosService.updateEstadoPedido(pedidoId, nuevoEstado);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const enviarPedidoThunk = createAsyncThunk<PedidoResponseDTO, PedidoDTO>(
  "pedido/enviarPedido",
  async (pedidoDTO, { rejectWithValue }) => {
    try {
      return await pedidosService.post(pedidoDTO);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const PedidoReducer = createSlice({
  name: "pedido",
  initialState,
  reducers: {
    clearPedidoEnCurso(state) {
      state.pedidoEnCurso = null;
      localStorage.removeItem("pedidoEnCurso");
    },
    setPedidoEnCurso(state, action: PayloadAction<PedidoResponseDTO>) {
      state.pedidoEnCurso = action.payload;
      localStorage.setItem("pedidoEnCurso", JSON.stringify(action.payload.codigo));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPedidoByCodigo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchPedidoByCodigo.fulfilled,
        (state, action: PayloadAction<PedidoResponseDTO>) => {
          state.loading = false;
          state.error = null;
          state.pedidoEnCurso = action.payload;
          if (action.payload.estado !== Estado.ENTREGADO && action.payload.estado !== Estado.CANCELADO) {
            localStorage.setItem("pedidoEnCurso", JSON.stringify(action.payload.codigo));
          } else {
            localStorage.removeItem("pedidoEnCurso");
            state.pedidoEnCurso = null;
          }
        }
      )
      .addCase(fetchPedidoByCodigo.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.payload) || "Error al cargar pedido";
        state.pedidoEnCurso = null;
        localStorage.removeItem("pedidoEnCurso");
      })

      .addCase(updateEstadoPedidoThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEstadoPedidoThunk.fulfilled, (state, action: PayloadAction<PedidoResponseDTO>) => {
        state.loading = false;
        state.error = null;
        if (
          action.payload.estado !== Estado.ENTREGADO &&
          action.payload.estado !== Estado.CANCELADO
        ) {
          state.pedidoEnCurso = action.payload;
          localStorage.setItem("pedidoEnCurso", JSON.stringify(action.payload.codigo));
        } else {
          state.pedidoEnCurso = null;
          localStorage.removeItem("pedidoEnCurso");
        }
      })
      .addCase(updateEstadoPedidoThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.payload) || "Error al actualizar estado";
      })

      .addCase(enviarPedidoThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(enviarPedidoThunk.fulfilled, (state, action: PayloadAction<PedidoResponseDTO>) => {
        state.loading = false;
        state.error = null;
        state.pedidoEnCurso = action.payload;
        if (
          action.payload.codigo !== undefined &&
          action.payload.codigo !== null &&
          action.payload.estado !== Estado.ENTREGADO &&
          action.payload.estado !== Estado.CANCELADO
        ) {
          localStorage.setItem("pedidoEnCurso", JSON.stringify(action.payload.codigo));
        } else {
          localStorage.removeItem("pedidoEnCurso");
        }
      })
      .addCase(enviarPedidoThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.payload) || "Error al enviar pedido";
      })

  },
});

export const { clearPedidoEnCurso, setPedidoEnCurso } = PedidoReducer.actions;
export default PedidoReducer.reducer;