import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { useAppTheme } from '../hooks/useAppTheme';

interface EmptyViewProps {
  title?: string;
  message?: string;
  iconName?: string;
}

export const EmptyView: React.FC<EmptyViewProps> = ({
  title = 'No items found',
  message = 'There is currently no data to display.',
  iconName = 'inbox',
}) => {
  const { theme } = useAppTheme();

  return (
    <View style={styles.container} testID="empty-view">
      <Feather
        name={iconName}
        size={54}
        color={theme.colors.textMuted}
        style={styles.icon}
      />
      <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
        {title}
      </Text>
      <Text style={[styles.message, { color: theme.colors.textSecondary }]}>
        {message}
      </Text>
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
  icon: {
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
  },
});
