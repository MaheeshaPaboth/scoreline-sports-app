import * as Keychain from 'react-native-keychain';

export interface StoredAuthSession {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    image?: string;
  };
}

const AUTH_SERVICE_KEY = 'ScorelineAuthService';

/**
 * Securely store authentication token and user data using device Keychain/Keystore.
 * Storing tokens in AsyncStorage or MMKV is strictly disallowed per security requirements.
 */
export const saveAuthSession = async (session: StoredAuthSession): Promise<boolean> => {
  try {
    const payload = JSON.stringify(session);
    await Keychain.setGenericPassword(session.user.username, payload, {
      service: AUTH_SERVICE_KEY,
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
    return true;
  } catch (error) {
    console.error('Failed to save auth session to Keychain:', error);
    return false;
  }
};

/**
 * Retrieve the securely stored authentication session from Keychain/Keystore.
 */
export const getAuthSession = async (): Promise<StoredAuthSession | null> => {
  try {
    const credentials = await Keychain.getGenericPassword({ service: AUTH_SERVICE_KEY });
    if (credentials && credentials.password) {
      const parsed: StoredAuthSession = JSON.parse(credentials.password);
      return parsed;
    }
    return null;
  } catch (error) {
    console.error('Failed to get auth session from Keychain:', error);
    return null;
  }
};

/**
 * Reset and remove authentication credentials from Keychain/Keystore on logout.
 */
export const clearAuthSession = async (): Promise<boolean> => {
  try {
    await Keychain.resetGenericPassword({ service: AUTH_SERVICE_KEY });
    return true;
  } catch (error) {
    console.error('Failed to clear auth session from Keychain:', error);
    return false;
  }
};
