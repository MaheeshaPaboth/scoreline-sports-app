import React from 'react';
import { render } from '@testing-library/react-native';
import { OfflineBanner } from '../../src/shared/components/OfflineBanner';

describe('OfflineBanner Component', () => {
  it('renders offline warning banner when visible is true', () => {
    const { getByTestId, getByText } = render(<OfflineBanner visible={true} />);

    expect(getByTestId('offline-banner')).toBeTruthy();
    expect(
      getByText('Offline Mode: Showing cached sports & favourites')
    ).toBeTruthy();
  });

  it('renders nothing when visible is false', () => {
    const { queryByTestId } = render(<OfflineBanner visible={false} />);
    expect(queryByTestId('offline-banner')).toBeNull();
  });
});
