import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { SportsItem } from '../../../shared/types';
import { storage } from '../../../shared/services/storage';

export interface FavouritesState {
  items: SportsItem[];
  loading: boolean;
  isHydrated: boolean;
}

const initialState: FavouritesState = {
  items: [],
  loading: false,
  isHydrated: false,
};

/**
 * Hydrate favourites list from local persistent storage on startup
 */
export const loadFavourites = createAsyncThunk(
  'favourites/loadFavourites',
  async () => {
    const saved = await storage.getFavourites<SportsItem>();
    return saved;
  }
);

/**
 * Add or remove favourite, immediately persisting to storage
 */
export const toggleFavourite = createAsyncThunk(
  'favourites/toggleFavourite',
  async (item: SportsItem, { getState }) => {
    const state = getState() as { favourites: FavouritesState };
    const exists = state.favourites.items.some(f => f.id === item.id);
    let updated: SportsItem[];

    if (exists) {
      updated = state.favourites.items.filter(f => f.id !== item.id);
    } else {
      updated = [item, ...state.favourites.items];
    }

    // Persist to storage across app restarts
    await storage.saveFavourites(updated);
    return updated;
  }
);

const favouritesSlice = createSlice({
  name: 'favourites',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(loadFavourites.pending, state => {
        state.loading = true;
      })
      .addCase(loadFavourites.fulfilled, (state, action) => {
        state.loading = false;
        state.isHydrated = true;
        state.items = action.payload || [];
      })
      .addCase(loadFavourites.rejected, state => {
        state.loading = false;
        state.isHydrated = true;
      });

    builder.addCase(toggleFavourite.fulfilled, (state, action: PayloadAction<SportsItem[]>) => {
      state.items = action.payload;
    });
  },
});

export default favouritesSlice.reducer;
