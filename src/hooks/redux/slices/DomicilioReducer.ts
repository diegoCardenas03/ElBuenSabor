import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DomicilioService } from '../../../services/DomicilioService';
import { DomicilioResponseDTO } from '../../../types/Domicilio/DomicilioResponseDTO';
import { DomicilioDTO } from '../../../types/Domicilio/DomicilioDTO';
import { DetalleDomicilioDTO } from '../../../types/DetalleDomicilio/DetalleDomicilioDTO';
import { DetalleDomicilioService } from '../../../services/DetalleDomicilioService';

const domicilioService = new DomicilioService();
const detalleDomicilioService = new DetalleDomicilioService();

interface DomicilioState {
    direcciones: DomicilioResponseDTO[];
    cargando: boolean;
    error: string | null;
    direccionSeleccionada: number | null;
}

const initialState: DomicilioState = {
    direcciones: [],
    cargando: false,
    error: null,
    direccionSeleccionada: null,
};

const token = sessionStorage.getItem('auth_token');

export const fetchDirecciones = createAsyncThunk(
    'domicilios/fetchDirecciones',
    async (_, { rejectWithValue }) => {
        try {
            const todas = await domicilioService.getByClienteId(Number(sessionStorage.getItem('user_id_db')), token!);
            const activas = todas.filter((d: DomicilioResponseDTO) => d.activo === true);
            return activas;
        } catch (error) {
            return rejectWithValue('Error al obtener direcciones');
        }
    }
);
export const crearDireccion = createAsyncThunk(
    'domicilios/crearDireccion',
    async (data: DetalleDomicilioDTO, { dispatch, rejectWithValue }) => {
        try {
            await detalleDomicilioService.post(data, token!);
            dispatch(fetchDirecciones());
        } catch (error) {
            return rejectWithValue('Error al crear dirección');
        }
    }
);

export const editarDireccion = createAsyncThunk(
    'domicilios/editarDireccion',
    async ({ id, data }: { id: number; data: DomicilioDTO }, { dispatch, rejectWithValue }) => {
        try {
            await domicilioService.patch(id, data, token!);
            dispatch(fetchDirecciones());
        } catch (error) {
            return rejectWithValue('Error al editar dirección');
        }
    }
);

export const eliminarDireccion = createAsyncThunk(
    'domicilios/eliminarDireccion',
    async (id: number, { rejectWithValue }) => {
        try {
            await domicilioService.delete(id, token!);
            return id;
        } catch (error) {
            return rejectWithValue('Error al eliminar dirección');
        }
    }
);
const domicilioReducer = createSlice({
    name: 'domicilios',
    initialState,
    reducers: {
        setDireccionSeleccionada: (state, action: PayloadAction<number | null>) => {
            state.direccionSeleccionada = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDirecciones.pending, (state) => {
                state.cargando = true;
                state.error = null;
            })
            .addCase(fetchDirecciones.fulfilled, (state, action: PayloadAction<DomicilioResponseDTO[]>) => {
                state.direcciones = action.payload;
                state.cargando = false;
            })
            .addCase(fetchDirecciones.rejected, (state, action) => {
                state.cargando = false;
                state.error = action.payload as string;
            })
            .addCase(eliminarDireccion.fulfilled, (state, action: PayloadAction<number>) => {
                state.direcciones = state.direcciones.filter(d => d.id !== action.payload);
                state.cargando = false;
                state.error = null;
            })
            .addCase(eliminarDireccion.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

export const { setDireccionSeleccionada } = domicilioReducer.actions;
export default domicilioReducer.reducer;
