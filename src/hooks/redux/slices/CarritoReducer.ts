import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductoUnificado, isProducto, isInsumo } from '../../../types/ProductoUnificado/ProductoUnificado';
import { TipoEnvio } from '../../../types/enums/TipoEnvio';
import { DomicilioDTO } from '../../../types/Domicilio/DomicilioDTO';
import { FormaPago } from '../../../types/enums/FormaPago';
import { isPromocion } from '../../../utils/isPromocion';

export type CarritoItemType = ProductoUnificado;

interface CarritoItem {
  item: CarritoItemType;
  cant: number;
}

type CarritoState = {
  items: CarritoItem[];
  tipoEntrega: TipoEnvio | null;
  direccion: DomicilioDTO | null;
  comentario: string;
  metodoPago: FormaPago | null;
};

const LOCALSTORAGE_KEY = 'carritoState';

function loadCarritoState(): CarritoState {
  try {
    const serialized = localStorage.getItem(LOCALSTORAGE_KEY);
    if (serialized) {
      return JSON.parse(serialized);
    }
  } catch (error) {
    console.error("Error al cargar el carrito desde localStorage:", error);
  }
  return {
    items: [],
    tipoEntrega: null,
    direccion: null,
    comentario: '',
    metodoPago: null,
  };
}

export const obtenerId = (item: CarritoItemType): string => {
  if (isPromocion(item)) return `PROMO-${item.id}`;
  if (isInsumo(item)) return `INSUMO-${item.id}`;
  if (isProducto(item)) return `PROD-${item.id}`;
  throw new Error("Tipo de ítem desconocido");
};

const carritoReducer = createSlice({
  name: 'carrito',
  initialState: loadCarritoState(),
  reducers: {
    agregarProducto: (state, action: PayloadAction<CarritoItemType>) => {
      const id = obtenerId(action.payload);
      const index = state.items.findIndex((i) => obtenerId(i.item) === id);

      if (index >= 0) {
        state.items[index].cant += 1;
      } else {
        state.items.push({ item: action.payload, cant: 1 });
      }
    },

    quitarProducto: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => obtenerId(i.item) !== action.payload);
    },

    cambiarCantidad: (state, action: PayloadAction<{ id: string; cantidad: number }>) => {
      const { id, cantidad } = action.payload;
      const item = state.items.find((i) => obtenerId(i.item) === id);
      if (item && cantidad > 0) {
        item.cant = cantidad;
      }
    },

    vaciarCarrito: (state) => {
      state.items = [];
      state.direccion = null;
      state.tipoEntrega = null;
      state.comentario = '';
      state.metodoPago = null;
    },

    setTipoEntrega: (state, action: PayloadAction<TipoEnvio | null>) => {
      state.tipoEntrega = action.payload;
    },

    setDireccion: (state, action: PayloadAction<DomicilioDTO | null>) => {
      state.direccion = action.payload;
    },

    setComentario: (state, action: PayloadAction<string>) => {
      state.comentario = action.payload;
    },

    setMetodoPago: (state, action: PayloadAction<FormaPago>) => {
      state.metodoPago = action.payload;
    },
  },
});

export const {
  agregarProducto,
  quitarProducto,
  cambiarCantidad,
  vaciarCarrito,
  setTipoEntrega,
  setDireccion,
  setComentario,
  setMetodoPago,
} = carritoReducer.actions;

export default carritoReducer.reducer;
