import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../utils/axios';

const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
const token = localStorage.getItem('token');

const initialState = {
  user,
  token,
  loading: false,
  error: null,
};

export const register = createAsyncThunk('auth/register', async (formData, { rejectWithValue }) => {
  try {
    const { data } = await API.post('/auth/register', formData);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

export const login = createAsyncThunk('auth/login', async (formData, { rejectWithValue }) => {
  try {
    const { data } = await API.post('/auth/login', formData);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const getMe = createAsyncThunk('auth/getMe', async (_, { rejectWithValue }) => {
  try {
    const { data } = await API.get('/auth/me');
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch user');
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (formData, { rejectWithValue }) => {
  try {
    const { data } = await API.put('/auth/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Profile update failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const loading = (state) => { state.loading = true; state.error = null; };
    const rejected = (state, action) => { state.loading = false; state.error = action.payload; };

    builder
      .addCase(register.pending, loading)
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, rejected)
      .addCase(login.pending, loading)
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, rejected)
      .addCase(getMe.pending, loading)
      .addCase(getMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(getMe.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      })
      .addCase(updateProfile.pending, loading)
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(updateProfile.rejected, rejected);
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
