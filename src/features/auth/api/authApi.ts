export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface AuthApiResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender?: string;
  image?: string;
  accessToken?: string;
  token?: string; // DummyJSON v0 / v1 compatibility
}

const DUMMY_JSON_BASE_URL = 'https://dummyjson.com';

export const authApi = {
  /**
   * Login using DummyJSON API
   * Standard demo user: emilys / emilyspass
   */
  login: async (credentials: LoginCredentials): Promise<AuthApiResponse> => {
    const response = await fetch(`${DUMMY_JSON_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: credentials.username.trim(),
        password: credentials.password,
        expiresInMins: 60,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Authentication failed. Please verify credentials.');
    }

    return data;
  },

  /**
   * Register simulated user using DummyJSON /users/add
   */
  register: async (payload: RegisterPayload): Promise<AuthApiResponse> => {
    const response = await fetch(`${DUMMY_JSON_BASE_URL}/users/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed. Please try again.');
    }

    return data;
  },
};
