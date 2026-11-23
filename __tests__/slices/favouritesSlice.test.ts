import favouritesReducer, {
  loadFavourites,
  toggleFavourite,
  FavouritesState,
} from '../../src/features/favourites/slice/favouritesSlice';
import { SportsItem } from '../../src/shared/types';

describe('favouritesSlice reducer', () => {
  const mockItem: SportsItem = {
    id: '133612',
    name: 'Liverpool',
    league: 'English Premier League',
    sport: 'Soccer',
    badgeUrl: 'https://www.thesportsdb.com/images/media/team/badge/liverpool.png',
    description: 'Liverpool Football Club is a professional football club.',
    country: 'England',
  };

  const initialState: FavouritesState = {
    items: [],
    loading: false,
    isHydrated: false,
  };

  it('should populate favourites list on loadFavourites.fulfilled', () => {
    const action = {
      type: loadFavourites.fulfilled.type,
      payload: [mockItem],
    };
    const nextState = favouritesReducer(initialState, action);
    expect(nextState.isHydrated).toBe(true);
    expect(nextState.items).toHaveLength(1);
    expect(nextState.items[0].name).toBe('Liverpool');
  });

  it('should update favourites on toggleFavourite.fulfilled', () => {
    const action = {
      type: toggleFavourite.fulfilled.type,
      payload: [mockItem],
    };
    const nextState = favouritesReducer(initialState, action);
    expect(nextState.items).toEqual([mockItem]);
  });
});
