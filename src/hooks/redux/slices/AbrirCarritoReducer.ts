import { createSlice } from '@reduxjs/toolkit';

interface CarritoUIState {
  abierto: boolean;
}

const initialState: CarritoUIState = {
  abierto: false,
};

const abrirCarritoReducer = createSlice({
  name: 'carritoUI',
  initialState,
  reducers: {
    abrirCarrito: (state) => {
      state.abierto = true;
    },
    cerrarCarrito: (state) => {
      state.abierto = false;
    },
  },
});

export const { abrirCarrito, cerrarCarrito } = abrirCarritoReducer.actions;
export default abrirCarritoReducer.reducer;