// Importación necesaria
import { configureStore } from "@reduxjs/toolkit";
import carritoReducer from './slices/CarritoReducer';
import productReducer from './slices/ProductReducer';
import rubroReducer from './slices/RubroReducer';
import TablaReducer from "./slices/TableReducer"; // Importamos el reducer del slice TablaReducer
import domicilioReducer from './slices/DomicilioReducer';
import abrirCarritoReducer from './slices/AbrirCarritoReducer';
import pedidoReducer from './slices/PedidoReducer';

// Configuración de la tienda de Redux
export const store = configureStore({
  reducer: {
    pedido: pedidoReducer,
    carritoUI: abrirCarritoReducer,
    domicilio: domicilioReducer,
    carrito: carritoReducer,
    rubros: rubroReducer,
    products: productReducer,
    tablaReducer: TablaReducer, // Agregamos el reducer del slice TablaReducer al estado global con la clave tablaReducer
  },
});

store.subscribe(() => {
    try {
        const serialized = JSON.stringify(store.getState().carrito);
        localStorage.setItem('carritoState', serialized);
    } catch (e) {
    }
});

// Inferimos los tipos `RootState` y `AppDispatch` del almacén de la tienda misma
export type RootState = ReturnType<typeof store.getState>;
// Tipo inferido: { modalReducer: ModalState, tablaReducer: TablaState }
export type AppDispatch = typeof store.dispatch;
