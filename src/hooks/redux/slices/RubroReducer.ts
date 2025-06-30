import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RubroProductoResponseDTO } from '../../../types/RubroProducto/RubroProductoResponseDTO';
import { RubroInsumoResponseDTO } from '../../../types/RubroInsumo/RubroInsumoResponseDTO';

interface RubroState {
  rubros: RubroProductoResponseDTO[];
  rubrosInsumos: RubroInsumoResponseDTO[];
  loading: boolean;
  error: string | null;
}

const initialState: RubroState = {
  rubros: [],
  rubrosInsumos: [],
  loading: false,
  error: null,
};

// Thunk para traer rubros de productos del backend
export const fetchRubrosProductos = createAsyncThunk<RubroProductoResponseDTO[]>(
  'rubros/fetchRubrosProductos',
  async () => {
    const response = await fetch('http://localhost:8080/api/rubroproductos');
    if (!response.ok) {
      throw new Error('Error al cargar rubros de productos');
    }
    const data: RubroProductoResponseDTO[] = await response.json();
    return data;
  }
);

// Thunk para traer rubros de insumos del backend
export const fetchRubrosInsumos = createAsyncThunk<RubroInsumoResponseDTO[]>(
  'rubros/fetchRubrosInsumos',
  async () => {
    const response = await fetch('http://localhost:8080/api/rubroinsumos');
    if (!response.ok) {
      throw new Error('Error al cargar rubros de insumos');
    }
    const data: RubroInsumoResponseDTO[] = await response.json();
    return data;
  }
);

const rubroSlice = createSlice({
  name: 'rubros',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRubrosProductos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRubrosProductos.fulfilled, (state, action) => {
        state.rubros = action.payload.filter(rubro => rubro.activo);
      })
      .addCase(fetchRubrosProductos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error desconocido';
      })
      .addCase(fetchRubrosInsumos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRubrosInsumos.fulfilled, (state, action) => {
        state.loading = false;
        state.rubrosInsumos = action.payload.filter(rubro => rubro.activo);
      })
      .addCase(fetchRubrosInsumos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error desconocido';
      });
  },
});

export const { } = rubroSlice.actions;

export default rubroSlice.reducer;