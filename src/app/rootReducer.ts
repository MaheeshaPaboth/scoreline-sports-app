import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/slice/authSlice';
import sportsReducer from '../features/sports/slice/sportsSlice';
import favouritesReducer from '../features/favourites/slice/favouritesSlice';

export const rootReducer = combineReducers({
  auth: authReducer,
  sports: sportsReducer,
  favourites: favouritesReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
