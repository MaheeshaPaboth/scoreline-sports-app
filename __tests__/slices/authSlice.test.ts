import authReducer, {
  clearAuthError,
  resetRegisterSuccess,
  AuthState,
} from '../../src/features/auth/slice/authSlice';

describe('authSlice reducer', () => {
  const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    isRestoringSession: true,
    registerSuccess: false,
  };

  it('should return initial state when passed empty action', () => {
    expect(authReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('should clear authentication error with clearAuthError', () => {
    const errorState: AuthState = {
      ...initialState,
      error: 'Invalid username or password',
    };
    const nextState = authReducer(errorState, clearAuthError());
    expect(nextState.error).toBeNull();
  });

  it('should reset registerSuccess flag', () => {
    const registeredState: AuthState = {
      ...initialState,
      registerSuccess: true,
    };
    const nextState = authReducer(registeredState, resetRegisterSuccess());
    expect(nextState.registerSuccess).toBe(false);
  });
});
