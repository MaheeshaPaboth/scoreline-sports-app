import { useEffect, useRef } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useAppDispatch } from '../../app/store';
import { setOfflineStatus, fetchSportsItems } from '../../features/sports/slice/sportsSlice';

/**
 * Custom hook to monitor network status:
 * 1. Updates Redux offline state to toggle the OfflineBanner.
 * 2. Implements the assignment's Offline-first twist: When connection returns
 *    (transitions from offline -> online), automatically dispatches fetchSportsItems()
 *    to refresh data immediately.
 */
export const useNetworkStatus = () => {
  const dispatch = useAppDispatch();
  const wasOffline = useRef<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      // Offline when isConnected is false OR isInternetReachable is false
      const isOffline = !(state.isConnected && state.isInternetReachable !== false);
      dispatch(setOfflineStatus(isOffline));

      // Auto-refresh when internet reconnects (Offline -> Online transition)
      if (wasOffline.current === true && !isOffline) {
        dispatch(fetchSportsItems(true));
      }

      wasOffline.current = isOffline;
    });

    return () => unsubscribe();
  }, [dispatch]);
};
