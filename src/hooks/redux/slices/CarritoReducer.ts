import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductoUnificado, isProducto, isInsumo } from '../../../types/ProductoUnificado/ProductoUnificado';
import { TipoEnvio } from '../../../types/enums/TipoEnvio';
import { DomicilioDTO } from '../../../types/Domicilio/DomicilioDTO';
import { FormaPago } from '../../../types/enums/FormaPago';


interface CarritoItem {
    item: ProductoUnificado;
    cantidad: number;
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
    } catch (e) {}
    return {
        items: [],
        tipoEntrega: null,
        direccion: null,
        comentario: '',
        metodoPago: null,
    };
}

export const obtenerId = (item: ProductoUnificado): string => {
    if (isInsumo(item))
        return `insumo-${item.id}`;
    return `producto-${item.id}`;
};

const carritoReducer = createSlice({
    name: 'carrito',
    initialState: loadCarritoState(),
    reducers: {
        agregarProducto: (state, action: PayloadAction<ProductoUnificado>) => {
            const id = obtenerId(action.payload);
            const index = state.items.findIndex((i) => obtenerId(i.item) === id);

            if (index >= 0) {
                state.items[index].cantidad += 1;
            } else {
                state.items.push({ item: action.payload, cantidad: 1 });
            }
        },

        quitarProducto: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter((i) => obtenerId(i.item) !== action.payload);
        },

        cambiarCantidad: (state, action: PayloadAction<{ id: string; cantidad: number }>) => {
            const { id, cantidad } = action.payload;
            const item = state.items.find((i) => obtenerId(i.item) === id);
            if (item && cantidad > 0) {
                item.cantidad = cantidad;
            }
        },

        vaciarCarrito: (state) => {
            state.items = [];
            state.direccion = null;
            state.tipoEntrega = null;
            state.comentario = "";
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
    setMetodoPago
} = carritoReducer.actions;

export default carritoReducer.reducer;
