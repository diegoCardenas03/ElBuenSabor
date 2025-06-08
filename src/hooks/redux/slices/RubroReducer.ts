import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RubroInsumo } from '../../../types/RubroInsumo';

interface RubroState {
  rubros: RubroInsumo[];
  loading: boolean;
  error: string | null;
}

const initialState: RubroState = {
  rubros: [],
  loading: false,
  error: null,
};

// Thunk para traer rubros del backend
export const fetchRubrosProductos = createAsyncThunk<RubroInsumo[]>(
  'rubros/fetchRubrosProductos',
  async () => {
    const response = await fetch('http://localhost:8080/api/rubroproductos');
    if (!response.ok) {
      throw new Error('Error al cargar rubros de productos');
    }
    const data: RubroInsumo[] = await response.json();
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
        state.loading = false;
        state.rubros = action.payload.filter(rubro => rubro.activo);
      })
      .addCase(fetchRubrosProductos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error desconocido';
      });
  },
});

export default rubroSlice.reducer;