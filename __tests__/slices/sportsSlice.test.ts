import sportsReducer, {
  setOfflineStatus,
  clearSportsError,
  clearSelectedItem,
  hydrateSportsCache,
  SportsState,
} from '../../src/features/sports/slice/sportsSlice';
import { SportsItem } from '../../src/shared/types';

describe('sportsSlice reducer & offline-first logic', () => {
  const mockItem: SportsItem = {
    id: '133604',
    name: 'Arsenal',
    league: 'English Premier League',
    sport: 'Soccer',
    badgeUrl: 'https://www.thesportsdb.com/images/media/team/badge/arsenal.png',
    description: 'Arsenal Football Club is a professional football club.',
    country: 'England',
    formedYear: '1886',
    stadium: 'Emirates Stadium',
  };

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

  it('should update isOffline flag when setOfflineStatus is dispatched', () => {
    const stateOffline = sportsReducer(initialState, setOfflineStatus(true));
    expect(stateOffline.isOffline).toBe(true);

    const stateOnline = sportsReducer(stateOffline, setOfflineStatus(false));
    expect(stateOnline.isOffline).toBe(false);
  });

  it('should hydrate cached sports items without losing data', () => {
    const hydratedAction = {
      type: hydrateSportsCache.fulfilled.type,
      payload: [mockItem],
    };
    const nextState = sportsReducer(initialState, hydratedAction);
    expect(nextState.isHydrated).toBe(true);
    expect(nextState.items).toHaveLength(1);
    expect(nextState.items[0].name).toBe('Arsenal');
  });

  it('should clear selectedItem and sports errors', () => {
    const populatedState: SportsState = {
      ...initialState,
      selectedItem: mockItem,
      error: 'Network connection failed',
      detailsError: 'Failed to fetch details',
    };

    const stateAfterClearSelected = sportsReducer(populatedState, clearSelectedItem());
    expect(stateAfterClearSelected.selectedItem).toBeNull();

    const stateAfterClearErrors = sportsReducer(stateAfterClearSelected, clearSportsError());
    expect(stateAfterClearErrors.error).toBeNull();
    expect(stateAfterClearErrors.detailsError).toBeNull();
  });
});
