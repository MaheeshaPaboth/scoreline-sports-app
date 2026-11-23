import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { useAppTheme } from '../hooks/useAppTheme';
import { PrimaryButton } from './PrimaryButton';

interface ErrorViewProps {
  message?: string;
  onRetry?: () => void;
  title?: string;
}

export const ErrorView: React.FC<ErrorViewProps> = ({
  message = 'An unexpected error occurred while loading sports data.',
  onRetry,
  title = 'Something went wrong',
}) => {
  const { theme } = useAppTheme();

  return (
    <View style={styles.container} testID="error-view">
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: theme.colors.errorBackground },
        ]}
      >
        <Feather name="alert-circle" size={40} color={theme.colors.error} />
      </View>
      <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
        {title}
      </Text>
      <Text style={[styles.message, { color: theme.colors.textSecondary }]}>
        {message}
      </Text>
      {onRetry ? (
        <PrimaryButton
          title="Retry"
          iconName="refresh-cw"
          onPress={onRetry}
          style={styles.retryButton}
          testID="retry-button"
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.heading,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  message: {
    ...typography.body,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  retryButton: {
    minWidth: 140,
  },
});
