import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { SportsItem } from '../../../shared/types';
import { useAppTheme } from '../../../shared/hooks/useAppTheme';
import { spacing } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';

interface TeamCardProps {
  item: SportsItem;
  isFavourite: boolean;
  onPress: () => void;
  onToggleFavourite?: () => void;
  testID?: string;
}

export const TeamCard: React.FC<TeamCardProps> = ({
  item,
  isFavourite,
  onPress,
  onToggleFavourite,
  testID,
}) => {
  const { theme } = useAppTheme();

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
          opacity: pressed ? 0.95 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={`View details for ${item.name}`}
    >
      <View style={styles.contentRow}>
        {/* Team Badge Image */}
        <View
          style={[
            styles.imageContainer,
            { backgroundColor: theme.colors.inputBackground },
          ]}
        >
          {item.badgeUrl ? (
            <Image
              source={{ uri: item.badgeUrl }}
              style={styles.badge}
              resizeMode="contain"
            />
          ) : (
            <Feather name="shield" size={32} color={theme.colors.textMuted} />
          )}
        </View>

        {/* Text Info */}
        <View style={styles.textContainer}>
          <View style={styles.titleRow}>
            <Text
              style={[styles.name, { color: theme.colors.textPrimary }]}
              numberOfLines={1}
            >
              {item.name}
            </Text>
            {onToggleFavourite ? (
              <TouchableOpacity
                onPress={onToggleFavourite}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                style={styles.favouriteButton}
                testID={`favourite-btn-${item.id}`}
                accessibilityLabel={
                  isFavourite ? 'Remove from favourites' : 'Add to favourites'
                }
              >
                <Feather
                  name="heart"
                  size={20}
                  color={
                    isFavourite
                      ? theme.colors.favouriteActive
                      : theme.colors.favouriteInactive
                  }
                />
              </TouchableOpacity>
            ) : null}
          </View>

          <View style={styles.badgeRow}>
            <View
              style={[
                styles.pill,
                { backgroundColor: theme.colors.inputBackground },
              ]}
            >
              <Text style={[styles.pillText, { color: theme.colors.primary }]}>
                {item.league}
              </Text>
            </View>
            <Text style={[styles.countryText, { color: theme.colors.textSecondary }]}>
              {item.country}
            </Text>
          </View>

          <Text
            style={[styles.description, { color: theme.colors.textSecondary }]}
            numberOfLines={2}
          >
            {item.description}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: spacing.borderRadiusMd,
    borderWidth: 1,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    minHeight: spacing.minTouchTarget, // >= 48dp
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    width: 64,
    height: 64,
    borderRadius: spacing.borderRadiusSm,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xs,
    marginRight: spacing.md,
  },
  badge: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    ...typography.subheading,
    flex: 1,
    marginRight: spacing.xs,
  },
  favouriteButton: {
    padding: spacing.xs,
    minWidth: 32,
    minHeight: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  pill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: spacing.borderRadiusSm,
    marginRight: spacing.sm,
  },
  pillText: {
    ...typography.captionBold,
    fontSize: 11,
  },
  countryText: {
    ...typography.caption,
  },
  description: {
    ...typography.caption,
    lineHeight: 16,
  },
});
