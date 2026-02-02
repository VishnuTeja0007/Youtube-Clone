import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token'),
    loading: true,
  },
  reducers: {
    setAuth: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
      if (action.payload.token) {
        localStorage.setItem('token', action.payload.token);
      }
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      localStorage.removeItem('token');
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  },
});

export const { setAuth, clearAuth, updateUser, setLoading } = authSlice.actions;
export default authSlice.reducer;