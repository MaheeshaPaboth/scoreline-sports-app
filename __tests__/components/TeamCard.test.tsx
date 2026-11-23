import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TeamCard } from '../../src/features/sports/components/TeamCard';
import { SportsItem } from '../../src/shared/types';

describe('TeamCard Component', () => {
  const mockTeam: SportsItem = {
    id: '133602',
    name: 'Chelsea',
    league: 'English Premier League',
    sport: 'Soccer',
    badgeUrl: 'https://example.com/badge.png',
    description: 'Chelsea Football Club is an English professional football club.',
    country: 'England',
  };

  it('renders team information properly', () => {
    const onPressMock = jest.fn();
    const onToggleFavMock = jest.fn();

    const { getByText } = render(
      <TeamCard
        item={mockTeam}
        isFavourite={false}
        onPress={onPressMock}
        onToggleFavourite={onToggleFavMock}
        testID="team-card-test"
      />
    );

    expect(getByText('Chelsea')).toBeTruthy();
    expect(getByText('English Premier League')).toBeTruthy();
    expect(getByText('England')).toBeTruthy();
  });

  it('triggers onToggleFavourite when heart button is pressed', () => {
    const onPressMock = jest.fn();
    const onToggleFavMock = jest.fn();

    const { getByTestId } = render(
      <TeamCard
        item={mockTeam}
        isFavourite={false}
        onPress={onPressMock}
        onToggleFavourite={onToggleFavMock}
        testID="team-card-test"
      />
    );

    const favButton = getByTestId('favourite-btn-133602');
    fireEvent.press(favButton);

    expect(onToggleFavMock).toHaveBeenCalledTimes(1);
    expect(onPressMock).not.toHaveBeenCalled();
  });
});
