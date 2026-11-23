import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { sportsApi } from '../api/sportsApi';
import { SportsItem } from '../../../shared/types';
import { storage } from '../../../shared/services/storage';

export interface SportsState {
  items: SportsItem[];
  selectedItem: SportsItem | null;
  loading: boolean;
  refreshing: boolean;
  detailsLoading: boolean;
  error: string | null;
  detailsError: string | null;
  isOffline: boolean;
  isHydrated: boolean;
}

const initialState: SportsState = {
  items: [],
  selectedItem: null,
  loading: false,
  refreshing: false,
  detailsLoading: false,
  error: null,
  detailsError: null,
  isOffline: false,
  isHydrated: false,
};

/**
 * Hydrate the sports list from local cache on startup for offline-first resilience
 */
export const hydrateSportsCache = createAsyncThunk(
  'sports/hydrateSportsCache',
  async () => {
    const cached = await storage.getCachedSports<SportsItem>();
    return cached;
  }
);

/**
 * Fetch sports items from API, updating local cache on success.
 * If offline, uses cached data without overwriting it with an error.
 */
export const fetchSportsItems = createAsyncThunk(
  'sports/fetchSportsItems',
  async (isPullToRefresh: boolean = false, { getState, rejectWithValue }) => {
    const state = getState() as { sports: SportsState };
    const { isOffline, items } = state.sports;

    // If offline and we already have cached items, keep them intact
    if (isOffline && items.length > 0) {
      return { items, fromCache: true };
    }

    try {
      const fetchedItems = await sportsApi.fetchTeams();
      // Overwrite cache with fresh data
      await storage.saveCachedSports(fetchedItems);
      return { items: fetchedItems, fromCache: false };
    } catch (error: any) {
      // If we have cached items in state or disk, recover gracefully
      const cached = await storage.getCachedSports<SportsItem>();
      if (cached && cached.length > 0) {
        return { items: cached, fromCache: true };
      }
      return rejectWithValue(
        error.message || 'Unable to load sports data. Please check your internet connection.'
      );
    }
  }
);

/**
 * Fetch detailed view for a single item (passes ID only)
 */
export const fetchSportsItemDetails = createAsyncThunk(
  'sports/fetchSportsItemDetails',
  async (itemId: string, { getState, rejectWithValue }) => {
    try {
      const details = await sportsApi.fetchTeamById(itemId);
      return details;
    } catch (error: any) {
      // Fallback: check if the item is present in current sports feed list
      const state = getState() as { sports: SportsState };
      const fallbackItem = state.sports.items.find(item => item.id === itemId);
      if (fallbackItem) {
        return fallbackItem;
      }
      return rejectWithValue(error.message || 'Unable to load item details');
    }
  }
);

const sportsSlice = createSlice({
  name: 'sports',
  initialState,
  reducers: {
    setOfflineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOffline = action.payload;
    },
    clearSportsError: state => {
      state.error = null;
      state.detailsError = null;
    },
    clearSelectedItem: state => {
      state.selectedItem = null;
    },
  },
  extraReducers: builder => {
    // Hydrate
    builder.addCase(hydrateSportsCache.fulfilled, (state, action) => {
      state.isHydrated = true;
      if (action.payload && action.payload.length > 0 && state.items.length === 0) {
        state.items = action.payload;
      }
    });

    // Fetch feed
    builder
      .addCase(fetchSportsItems.pending, (state, action) => {
        if (action.meta.arg) {
          state.refreshing = true;
        } else if (state.items.length === 0) {
          state.loading = true;
        }
        state.error = null;
      })
      .addCase(fetchSportsItems.fulfilled, (state, action) => {
        state.loading = false;
        state.refreshing = false;
        state.items = action.payload.items;
        state.error = null;
      })
      .addCase(fetchSportsItems.rejected, (state, action) => {
        state.loading = false;
        state.refreshing = false;
        // Only set error if we don't have items to display
        if (state.items.length === 0) {
          state.error = (action.payload as string) || 'Failed to load sports data';
        }
      });

    // Fetch details
    builder
      .addCase(fetchSportsItemDetails.pending, state => {
        state.detailsLoading = true;
        state.detailsError = null;
      })
      .addCase(fetchSportsItemDetails.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.selectedItem = action.payload;
        state.detailsError = null;
      })
      .addCase(fetchSportsItemDetails.rejected, (state, action) => {
        state.detailsLoading = false;
        state.detailsError = (action.payload as string) || 'Failed to load details';
      });
  },
});

export const { setOfflineStatus, clearSportsError, clearSelectedItem } = sportsSlice.actions;
export default sportsSlice.reducer;
