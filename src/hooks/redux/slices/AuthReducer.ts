import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  rol: string | null;
  userId: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: null,
  rol: null,
  userId: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
    },
    setRol: (state, action: PayloadAction<string | null>) => {
      state.rol = action.payload;
    },
    clearAuth: (state) => {
      state.token = null;
      state.rol = null;
      state.userId = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setToken, setRol, clearAuth } = authSlice.actions;
export default authSlice.reducer;