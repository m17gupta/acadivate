import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loginThunk } from './authThunks';

interface User {
  userName?: string;
  password?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const loadState = () => {
  try {
    const serializedUser = localStorage.getItem('user');
    const serializedToken = localStorage.getItem('token');
    if (serializedUser === null) {
      return {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    }
    return {
      user: JSON.parse(serializedUser),
      token: serializedToken,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    };
  } catch (err) {
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    };
  }
};

const initialState: AuthState = typeof window !== 'undefined' ? loadState() : {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('token', action.payload.token);
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(loginThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(loginThunk.fulfilled, (state, action: any) => {
   
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        // Note: token is not currently in the loginThunk payload, 
        // but if it were, we would set it here as well.
      }
    })
    .addCase(loginThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  }
});

export const { setCredentials, logout, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;
