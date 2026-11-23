import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  FAVOURITES: '@scoreline/favourites',
  LAST_CACHED_SPORTS: '@scoreline/last_cached_sports',
  THEME_MODE: '@scoreline/theme_mode',
};

export const storage = {
  // Favourites storage
  getFavourites: async <T>(): Promise<T[]> => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEYS.FAVOURITES);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error('Failed to read favourites from storage:', e);
      return [];
    }
  },
  saveFavourites: async <T>(favourites: T[]): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.FAVOURITES, JSON.stringify(favourites));
    } catch (e) {
      console.error('Failed to write favourites to storage:', e);
    }
  },

  // Offline-first cached sports list
  getCachedSports: async <T>(): Promise<T[]> => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEYS.LAST_CACHED_SPORTS);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error('Failed to read cached sports list from storage:', e);
      return [];
    }
  },
  saveCachedSports: async <T>(items: T[]): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_CACHED_SPORTS, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to cache sports list to storage:', e);
    }
  },

  // Theme preference
  getThemeMode: async (): Promise<'light' | 'dark' | null> => {
    try {
      const mode = await AsyncStorage.getItem(STORAGE_KEYS.THEME_MODE);
      return mode === 'dark' || mode === 'light' ? mode : null;
    } catch (e) {
      console.error('Failed to read theme mode from storage:', e);
      return null;
    }
  },
  saveThemeMode: async (mode: 'light' | 'dark'): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.THEME_MODE, mode);
    } catch (e) {
      console.error('Failed to save theme mode to storage:', e);
    }
  },
};
