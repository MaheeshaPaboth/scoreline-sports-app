import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { useAppTheme } from '../hooks/useAppTheme';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  iconName?: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  testID?: string;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  style,
  textStyle,
  iconName,
  variant = 'primary',
  testID,
}) => {
  const { theme } = useAppTheme();

  const getBackgroundColor = () => {
    if (disabled) {
      return theme.isDark ? '#334155' : '#CBD5E1';
    }
    switch (variant) {
      case 'secondary':
        return theme.colors.card;
      case 'danger':
        return theme.colors.error;
      case 'outline':
        return 'transparent';
      case 'primary':
      default:
        return theme.colors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) {
      return theme.isDark ? '#64748B' : '#94A3B8';
    }
    switch (variant) {
      case 'outline':
        return theme.colors.primary;
      case 'secondary':
        return theme.colors.textPrimary;
      default:
        return '#FFFFFF';
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      testID={testID}
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: variant === 'outline' ? theme.colors.primary : 'transparent',
          borderWidth: variant === 'outline' ? 1.5 : 0,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <>
          {iconName ? (
            <Feather
              name={iconName}
              size={18}
              color={getTextColor()}
              style={styles.icon}
            />
          ) : null}
          <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    minHeight: spacing.minTouchTarget, // >= 48dp accessibility requirement
    minWidth: spacing.minTouchTarget,
    paddingHorizontal: spacing.lg,
    borderRadius: spacing.borderRadiusMd,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  text: {
    ...typography.button,
  },
  icon: {
    marginRight: spacing.sm,
  },
});
