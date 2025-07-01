import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ProductoResponseDTO } from '../../../types/Producto/ProductoResponseDTO';
import { InsumoResponseDTO } from '../../../types/Insumo/InsumoResponseDTO';
import { ProductoUnificado, isInsumo } from '../../../types/ProductoUnificado/ProductoUnificado';

interface ProductState {
  products: ProductoResponseDTO[];
  insumos: InsumoResponseDTO[];
  filteredProducts: ProductoUnificado[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  selectedCategories: string[]; // CAMBIAR A STRING para manejar IDs compuestos
  filters: {
    order: string;
    bestseller: boolean;
  };
  rubrosConInsumosVendibles: number[];
}

const initialState: ProductState = {
  products: [],
  insumos: [],
  filteredProducts: [],
  loading: false,
  error: null,
  searchTerm: '',
  selectedCategories: [], // Ahora será array de strings como "producto-2", "insumo-3"
  filters: { order: '', bestseller: false },
  rubrosConInsumosVendibles: []
};

// Thunk para traer productos del backend
export const fetchProducts = createAsyncThunk<ProductoResponseDTO[]>(
  'products/fetchProducts',
  async () => {
    const response = await fetch('http://localhost:8080/api/productos');
    if (!response.ok) {
      throw new Error('Error al cargar productos');
    }
    const data: ProductoResponseDTO[] = await response.json();
    return data;
  }
);

// Thunk para traer insumos vendibles del backend
export const fetchInsumosVendibles = createAsyncThunk<InsumoResponseDTO[]>(
  'products/fetchInsumosVendibles',
  async () => {
    const response = await fetch('http://localhost:8080/api/insumos');
    if (!response.ok) {
      throw new Error('Error al cargar insumos');
    }
    const data: InsumoResponseDTO[] = await response.json();
    return data.filter(insumo => !insumo.esParaElaborar && insumo.activo);
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
    setSelectedCategories: (state, action: PayloadAction<string[]>) => { // CAMBIAR A STRING[]
      state.selectedCategories = action.payload;
      productSlice.caseReducers.applyFilters(state);
    },
    selectCategory: (state, action: PayloadAction<string | null>) => { // CAMBIAR A STRING
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
    toggleCategory: (state, action: PayloadAction<string>) => {
      const categoryId = action.payload; // "producto-2" o "insumo-3"
      // console.log('toggleCategory called with:', categoryId);

      const index = state.selectedCategories.indexOf(categoryId);

      if (index > -1) {
        state.selectedCategories.splice(index, 1);
        // console.log('Removiendo categoría:', categoryId);
      } else {
        state.selectedCategories.push(categoryId);
        // console.log('Agregando categoría:', categoryId);
      }

      // console.log('selectedCategories after:', [...state.selectedCategories]);
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
      // console.log('=== APLICANDO FILTROS ===');
      // console.log('selectedCategories:', state.selectedCategories);
      // console.log('searchTerm:', state.searchTerm);

      // Combinar productos e insumos vendibles
      const allItems: ProductoUnificado[] = [
        ...state.products.filter(product => product.activo),
        ...state.insumos.map(insumo => ({ ...insumo, tipo: 'insumo' as const }))
      ];

      let filtered = allItems.filter((item) => {
        let itemRubroId: number | undefined;
        let itemName: string;
        
        let isActive: boolean;
        let itemType: 'producto' | 'insumo';

        if (isInsumo(item)) {
          itemRubroId = item.rubro?.id;
          itemName = item.denominacion;
         
          isActive = item.activo;
          itemType = 'insumo';
        } else if ('rubro' in item && item.rubro) {
          itemRubroId = item.rubro.id;
          itemName = item.denominacion;
          
          isActive = item.activo;
          itemType = 'producto';
        } else {
          itemRubroId = undefined;
          itemName = item.denominacion;
          
          isActive = item.activo;
          itemType = 'producto';
        }

        // Verificar filtro de categoría con IDs compuestos
        let matchesCategory = state.selectedCategories.length === 0;

        if (!matchesCategory && itemRubroId !== undefined) {
          const compositeId = `${itemType}-${itemRubroId}`;
          matchesCategory = state.selectedCategories.includes(compositeId);
          // console.log(`Item: ${itemName}, compositeId: ${compositeId}, matches: ${matchesCategory}`);
        }

        // Verificar filtro de búsqueda
        const matchesSearch = itemName.toLowerCase().includes(state.searchTerm.toLowerCase());

        // Verificar filtro de bestseller
        const matchesBestseller = state.filters.bestseller ? isActive : true;

        const finalMatch = matchesCategory && matchesSearch && matchesBestseller && isActive;

        if (state.selectedCategories.length > 0) {
          // console.log(`Item: ${itemName}, tipo: ${itemType}, rubroId: ${itemRubroId}, matches: ${finalMatch}`);
        }

        return finalMatch;
      });

      // Aplicar ordenamiento
      if (state.filters.order === 'asc') {
        filtered = filtered.sort((a, b) => {
          const priceA = isInsumo(a) ? a.precioVenta : (a.precioVenta || 0);
          const priceB = isInsumo(b) ? b.precioVenta : (b.precioVenta || 0);
          return priceA - priceB;
        });
      } else if (state.filters.order === 'desc') {
        filtered = filtered.sort((a, b) => {
          const priceA = isInsumo(a) ? a.precioVenta : (a.precioVenta || 0);
          const priceB = isInsumo(b) ? b.precioVenta : (b.precioVenta || 0);
          return priceB - priceA;
        });
      }

      state.filteredProducts = filtered;
      // console.log(`Productos filtrados: ${filtered.length}`);
      // console.log('========================');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<ProductoResponseDTO[]>) => {
        state.products = action.payload;
        productSlice.caseReducers.applyFilters(state);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error desconocido';
      })
      .addCase(fetchInsumosVendibles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInsumosVendibles.fulfilled, (state, action: PayloadAction<InsumoResponseDTO[]>) => {
        state.loading = false;
        state.insumos = action.payload;
        // Guardar los rubros que tienen insumos vendibles, filtrando undefined
        state.rubrosConInsumosVendibles = [...new Set(
          action.payload
            .map(insumo => insumo.rubro?.id)
            .filter((id): id is number => id !== undefined)
        )];
        productSlice.caseReducers.applyFilters(state);
      })
      .addCase(fetchInsumosVendibles.rejected, (state, action) => {
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