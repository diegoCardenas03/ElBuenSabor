import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ProductoDTO } from '../../../types/Producto/ProductoDTO';

interface ProductState {
  products: ProductoDTO[];
  filteredProducts: ProductoDTO[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  selectedCategories: number[];
  filters: {
    order: string;
    bestseller: boolean;
  };
}

const initialState: ProductState = {
  products: [],
  filteredProducts: [],
  loading: false,
  error: null,
  searchTerm: '',
  selectedCategories: [],
  filters: { order: '', bestseller: false }
};

// Thunk para traer productos del backend
export const fetchProducts = createAsyncThunk<ProductoDTO[]>(
  'products/fetchProducts',
  async () => {
    const response = await fetch('http://localhost:8080/api/productos');
    if (!response.ok) {
      throw new Error('Error al cargar productos');
    }
    const data: ProductoDTO[] = await response.json();
    return data;
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      productSlice.caseReducers.applyFilters(state);
    },
    setSelectedCategories: (state, action: PayloadAction<number[]>) => {
      state.selectedCategories = action.payload;
      productSlice.caseReducers.applyFilters(state);
    },
    selectCategory: (state, action: PayloadAction<number | null>) => {
      if (action.payload === null) {
        state.selectedCategories = [];
      } else {
        if (state.selectedCategories.includes(action.payload)) {
          state.selectedCategories = [];
        } else {
          state.selectedCategories = [action.payload];
        }
      }
      productSlice.caseReducers.applyFilters(state);
    },
    toggleCategory: (state, action: PayloadAction<number>) => {
      const categoryId = action.payload;
      const index = state.selectedCategories.indexOf(categoryId);
      
      if (index > -1) {
        // Si ya está seleccionada, quitarla
        state.selectedCategories.splice(index, 1);
      } else {
        // Si no está seleccionada, añadirla
        state.selectedCategories.push(categoryId);
      }
      productSlice.caseReducers.applyFilters(state);
    },
    setFilters: (state, action: PayloadAction<{ order: string; bestseller: boolean }>) => {
      state.filters = action.payload;
      productSlice.caseReducers.applyFilters(state);
    },
    clearFilters: (state) => {
      state.searchTerm = '';
      state.selectedCategories = [];
      state.filters = { order: '', bestseller: false };
      productSlice.caseReducers.applyFilters(state);
    },
      applyFilters: (state) => {
      console.log('Aplicando filtros...');
      console.log('selectedCategories:', state.selectedCategories);
      console.log('Primer producto completo:', state.products[0]);
      
      let filtered = state.products.filter((product) => {
        const productRubroId = product.rubro?.id;
        // Validar que productRubroId existe antes de usar includes
        const matchesCategory = state.selectedCategories.length === 0 || 
          (productRubroId !== undefined && state.selectedCategories.includes(productRubroId));
        const matchesSearch = product.denominacion.toLowerCase().includes(state.searchTerm.toLowerCase());
        const matchesBestseller = state.filters.bestseller ? product.activo : true;
        
        console.log(`Producto: ${product.denominacion}, rubroId: ${productRubroId}, matchesCategory: ${matchesCategory}`);
        
        return matchesCategory && matchesSearch && matchesBestseller && product.activo;
      });

      if (state.filters.order === 'asc') {
        filtered = filtered.sort((a, b) => (a.precioVenta || 0) - (b.precioVenta || 0));
      } else if (state.filters.order === 'desc') {
        filtered = filtered.sort((a, b) => (b.precioVenta || 0) - (a.precioVenta || 0));
      }

      state.filteredProducts = filtered;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<ProductoDTO[]>) => {
        state.loading = false;
        state.products = action.payload;
        // Filtrar solo productos activos
        state.filteredProducts = action.payload.filter(product => product.activo);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error desconocido';
      });
  },
});

export const { 
  setSearchTerm, 
  setSelectedCategories, 
  selectCategory, 
  toggleCategory, 
  setFilters, 
  clearFilters 
} = productSlice.actions;

export default productSlice.reducer;