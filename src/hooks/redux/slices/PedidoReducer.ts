import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { PedidoResponseDTO } from "../../../types/Pedido/PedidoResponseDTO";
import { Estado } from "../../../types/enums/Estado";
import { PedidosService } from "../../../services/PedidosService";
import { PedidoDTO } from "../../../types/Pedido/PedidoDTO";

interface PedidoState {
  pedidoEnCurso: PedidoResponseDTO | null;
  pedidosDelUsuario: PedidoResponseDTO[];
  loading: boolean;
  error: string | null;
}

const initialState: PedidoState = {
  pedidoEnCurso: null,
  pedidosDelUsuario: [],
  loading: false,
  error: null,
};

const pedidosService = new PedidosService();

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

export const fetchPedidosByUsuario = createAsyncThunk<PedidoResponseDTO[], number>(
  "pedido/fetchPedidosByUsuario",
  async (clienteId, { rejectWithValue }) => {
    try {
      const pedidoPorId = await pedidosService.getPedidosByUsuario(clienteId);
      console.log("Pedidos del usuario:", pedidoPorId);
      return pedidoPorId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const getPedidoEnCurso = (pedidos: PedidoResponseDTO[]) =>
  pedidos.find(p =>
    p.estado !== Estado.ENTREGADO &&
    p.estado !== Estado.CANCELADO &&
    p.estado !== Estado.PENDIENTE_FACTURACION
  ) ?? null;

const PedidoReducer = createSlice({
  name: "pedido",
  initialState,
  reducers: {
    clearPedidoEnCurso(state) {
      state.pedidoEnCurso = null;
    },
    setPedidoEnCurso(state, action: PayloadAction<PedidoResponseDTO>) {
      state.pedidoEnCurso = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateEstadoPedidoThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEstadoPedidoThunk.fulfilled, (state, action: PayloadAction<PedidoResponseDTO>) => {
        state.loading = false;
        state.error = null;
        state.pedidoEnCurso = (
          action.payload.estado !== Estado.ENTREGADO &&
          action.payload.estado !== Estado.CANCELADO &&
          action.payload.estado !== Estado.PENDIENTE_FACTURACION
        ) ? action.payload : null;
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
        state.pedidoEnCurso = (
          action.payload.estado !== Estado.ENTREGADO &&
          action.payload.estado !== Estado.CANCELADO &&
          action.payload.estado !== Estado.PENDIENTE_FACTURACION
        ) ? action.payload : null;
      })
      .addCase(enviarPedidoThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.payload) || "Error al enviar pedido";
      })

      .addCase(fetchPedidosByUsuario.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPedidosByUsuario.fulfilled, (state, action: PayloadAction<PedidoResponseDTO[]>) => {
        state.loading = false;
        state.error = null;
        state.pedidosDelUsuario = action.payload;
        state.pedidoEnCurso = getPedidoEnCurso(action.payload);
      })
      .addCase(fetchPedidosByUsuario.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.payload) || "Error al cargar pedidos del usuario";
        state.pedidosDelUsuario = [];
        state.pedidoEnCurso = null;
      });
  },
});

export const { clearPedidoEnCurso, setPedidoEnCurso } = PedidoReducer.actions;
export default PedidoReducer.reducer;