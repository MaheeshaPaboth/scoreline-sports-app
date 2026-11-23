import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authApi, LoginCredentials, RegisterPayload } from '../api/authApi';
import { UserProfile } from '../../../shared/types';
import {
  saveAuthSession,
  getAuthSession,
  clearAuthSession,
} from '../../../shared/services/keychain';

export interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  isRestoringSession: boolean;
  registerSuccess: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  isRestoringSession: true,
  registerSuccess: false,
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      const token = response.accessToken || response.token || '';
      const user: UserProfile = {
        id: response.id,
        username: response.username,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        image: response.image,
      };

      // Store in Keychain (Hardware-backed secure storage, NEVER AsyncStorage/MMKV)
      await saveAuthSession({ token, user });

      return { user, token };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      const response = await authApi.register(payload);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

export const restoreSession = createAsyncThunk(
  'auth/restoreSession',
  async (_, { rejectWithValue }) => {
    try {
      const session = await getAuthSession();
      if (session && session.token) {
        return session;
      }
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  await clearAuthSession();
  return null;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: state => {
      state.error = null;
    },
    resetRegisterSuccess: state => {
      state.registerSuccess = false;
    },
  },
  extraReducers: builder => {
    // Login
    builder
      .addCase(loginUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Authentication failed';
      });

    // Register
    builder
      .addCase(registerUser.pending, state => {
        state.loading = true;
        state.error = null;
        state.registerSuccess = false;
      })
      .addCase(registerUser.fulfilled, state => {
        state.loading = false;
        state.registerSuccess = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Registration failed';
        state.registerSuccess = false;
      });

    // Session Restore
    builder
      .addCase(restoreSession.pending, state => {
        state.isRestoringSession = true;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.isRestoringSession = false;
        if (action.payload) {
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.token = action.payload.token;
        } else {
          state.isAuthenticated = false;
          state.user = null;
          state.token = null;
        }
      })
      .addCase(restoreSession.rejected, state => {
        state.isRestoringSession = false;
        state.isAuthenticated = false;
      });

    // Logout
    builder.addCase(logoutUser.fulfilled, state => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
    });
  },
});

export const { clearAuthError, resetRegisterSuccess } = authSlice.actions;
export default authSlice.reducer;
