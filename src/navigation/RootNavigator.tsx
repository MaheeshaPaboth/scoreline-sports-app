import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../app/store';
import { restoreSession } from '../features/auth/slice/authSlice';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { useAppTheme } from '../shared/hooks/useAppTheme';
import { useNetworkStatus } from '../shared/hooks/useNetworkStatus';

export const RootNavigator: React.FC = () => {
  const { theme } = useAppTheme();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isRestoringSession } = useAppSelector(state => state.auth);

  // Initialize network listeners for offline banner and auto-refresh on reconnect
  useNetworkStatus();

  // Restore session from Keychain on app boot
  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  if (isRestoringSession) {
    return (
      <View
        style={[
          styles.splashContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
