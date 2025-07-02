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
  clienteId: string | null;
  items: CarritoItem[];
  tipoEntrega: TipoEnvio | null;
  direccion: DomicilioDTO | null;
  comentario: string;
  metodoPago: FormaPago | null;
};

const initialClienteId = sessionStorage.getItem('user_id_db');
const initialState = loadCarritoState(initialClienteId);
initialState.clienteId = initialClienteId;

function getCarritoKey(clienteId: string | null) {
  return `carritoState_${clienteId}`;
}

function loadCarritoState(clienteId: string | null): CarritoState {
  try {
    const serialized = localStorage.getItem(getCarritoKey(clienteId));
    if (serialized) {
      return JSON.parse(serialized);
    }
  } catch (error) {
    console.error("Error al cargar el carrito desde localStorage:", error);
  }
  return {
    clienteId: null,
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

function saveCarritoState(clienteId: string | null, state: CarritoState) {
  try {
    localStorage.setItem(getCarritoKey(clienteId), JSON.stringify(state));
  } catch (error) {
    console.error("Error al guardar el carrito en localStorage:", error);
  }
}

const carritoReducer = createSlice({
  name: 'carrito',
  initialState,
  reducers: {
    setClienteId: (state, action: PayloadAction<string | null>) => {
      state.clienteId = action.payload;
      const nuevo = loadCarritoState(action.payload);
      state.items = nuevo.items;
      state.tipoEntrega = nuevo.tipoEntrega;
      state.direccion = nuevo.direccion;
      state.comentario = nuevo.comentario;
      state.metodoPago = nuevo.metodoPago;
    },

    agregarProducto: (state, action: PayloadAction<CarritoItemType>) => {
      const id = obtenerId(action.payload);
      const index = state.items.findIndex((i) => obtenerId(i.item) === id);

      if (index >= 0) {
        state.items[index].cant += 1;
      } else {
        state.items.push({ item: action.payload, cant: 1 });
      }

      saveCarritoState(state.clienteId, state);
    },

    quitarProducto: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => obtenerId(i.item) !== action.payload);
      saveCarritoState(state.clienteId, state);
    },

    cambiarCantidad: (state, action: PayloadAction<{ id: string; cantidad: number }>) => {
      const { id, cantidad } = action.payload;
      const item = state.items.find((i) => obtenerId(i.item) === id);
      if (item && cantidad > 0) {
        item.cant = cantidad;
      }
      saveCarritoState(state.clienteId, state);
    },

    vaciarCarrito: (state) => {
      state.items = [];
      state.direccion = null;
      state.tipoEntrega = null;
      state.comentario = '';
      state.metodoPago = null;
      saveCarritoState(state.clienteId, state);
    },

    setTipoEntrega: (state, action: PayloadAction<TipoEnvio | null>) => {
      state.tipoEntrega = action.payload;
      saveCarritoState(state.clienteId, state);
    },

    setDireccion: (state, action: PayloadAction<DomicilioDTO | null>) => {
      state.direccion = action.payload;
      saveCarritoState(state.clienteId, state);
    },

    setComentario: (state, action: PayloadAction<string>) => {
      state.comentario = action.payload;
      saveCarritoState(state.clienteId, state);
    },

    setMetodoPago: (state, action: PayloadAction<FormaPago>) => {
      state.metodoPago = action.payload;
      saveCarritoState(state.clienteId, state);
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
  setClienteId,
} = carritoReducer.actions;

export default carritoReducer.reducer;
