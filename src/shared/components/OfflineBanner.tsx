import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { lightColors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

interface OfflineBannerProps {
  visible: boolean;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ visible }) => {
  if (!visible) {
    return null;
  }

  return (
    <View style={styles.banner} testID="offline-banner">
      <Feather name="wifi-off" size={18} color="#FFFFFF" style={styles.icon} />
      <Text style={styles.text}>Offline Mode: Showing cached sports & favourites</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: lightColors.offlineBanner,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    minHeight: 38,
  },
  icon: {
    marginRight: spacing.sm,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});
