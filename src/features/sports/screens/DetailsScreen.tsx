import React, { useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../../navigation/types';
import { useAppDispatch, useAppSelector } from '../../../app/store';
import { fetchSportsItemDetails, clearSelectedItem } from '../slice/sportsSlice';
import { toggleFavourite } from '../../favourites/slice/favouritesSlice';
import { LoadingView } from '../../../shared/components/LoadingView';
import { ErrorView } from '../../../shared/components/ErrorView';
import { PrimaryButton } from '../../../shared/components/PrimaryButton';
import { Card } from '../../../shared/components/Card';
import { useAppTheme } from '../../../shared/hooks/useAppTheme';
import { spacing } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';

type DetailsRouteProp = RouteProp<HomeStackParamList, 'Details'>;
type DetailsNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Details'>;

interface Props {
  route: DetailsRouteProp;
  navigation: DetailsNavigationProp;
}

export const DetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { itemId } = route.params; // ID ONLY passed from Home
  const { theme } = useAppTheme();
  const dispatch = useAppDispatch();
  const { selectedItem, detailsLoading, detailsError } = useAppSelector(
    state => state.sports
  );
  const favourites = useAppSelector(state => state.favourites.items);

  const isFavourite = selectedItem
    ? favourites.some(f => f.id === selectedItem.id)
    : false;

  useEffect(() => {
    dispatch(fetchSportsItemDetails(itemId));

    return () => {
      dispatch(clearSelectedItem());
    };
  }, [dispatch, itemId]);

  if (detailsLoading && !selectedItem) {
    return <LoadingView message="Loading team details..." />;
  }

  if (detailsError && !selectedItem) {
    return (
      <ErrorView
        message={detailsError}
        onRetry={() => dispatch(fetchSportsItemDetails(itemId))}
      />
    );
  }

  if (!selectedItem) {
    return null;
  }

  const openWebsite = () => {
    if (selectedItem.website) {
      Linking.openURL(selectedItem.website).catch(() => {});
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Banner / Header Image */}
      {selectedItem.bannerUrl ? (
        <Image
          source={{ uri: selectedItem.bannerUrl }}
          style={styles.banner}
          resizeMode="cover"
        />
      ) : null}

      <View style={styles.body}>
        {/* Header & Favorite Toggle */}
        <View style={styles.badgeHeaderRow}>
          <View
            style={[
              styles.badgeContainer,
              { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
            ]}
          >
            <Image
              source={{ uri: selectedItem.badgeUrl }}
              style={styles.badgeImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.titleColumn}>
            <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
              {selectedItem.name}
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              {selectedItem.league} • {selectedItem.country}
            </Text>
          </View>
        </View>

        {/* Favorite Toggle Action Button */}
        <PrimaryButton
          title={isFavourite ? 'Remove from Favourites' : 'Add to Favourites'}
          iconName="heart"
          variant={isFavourite ? 'danger' : 'primary'}
          onPress={() => dispatch(toggleFavourite(selectedItem))}
          style={styles.favToggleButton}
          testID="toggle-favourite-button"
        />

        {/* Key Info Card */}
        <Card style={styles.infoCard}>
          <Text style={[styles.sectionHeading, { color: theme.colors.textPrimary }]}>
            Team Information
          </Text>

          <View style={styles.infoRow}>
            <View style={styles.infoCol}>
              <Feather name="globe" size={16} color={theme.colors.primary} />
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                Country
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.textPrimary }]}>
                {selectedItem.country}
              </Text>
            </View>

            <View style={styles.infoCol}>
              <Feather name="calendar" size={16} color={theme.colors.primary} />
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                Formed Year
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.textPrimary }]}>
                {selectedItem.formedYear || 'N/A'}
              </Text>
            </View>

            <View style={styles.infoCol}>
              <Feather name="map-pin" size={16} color={theme.colors.primary} />
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                Stadium
              </Text>
              <Text
                style={[styles.infoValue, { color: theme.colors.textPrimary }]}
                numberOfLines={1}
              >
                {selectedItem.stadium || 'N/A'}
              </Text>
            </View>
          </View>

          {selectedItem.website ? (
            <TouchableOpacity
              onPress={openWebsite}
              style={[
                styles.websiteRow,
                { borderTopColor: theme.colors.border },
              ]}
              accessibilityLabel="Open official website"
            >
              <Feather name="external-link" size={16} color={theme.colors.primary} />
              <Text style={[styles.websiteText, { color: theme.colors.primary }]}>
                Visit Official Website
              </Text>
            </TouchableOpacity>
          ) : null}
        </Card>

        {/* Description Section */}
        <Card style={styles.descriptionCard}>
          <Text style={[styles.sectionHeading, { color: theme.colors.textPrimary }]}>
            About {selectedItem.name}
          </Text>
          <Text style={[styles.descriptionText, { color: theme.colors.textSecondary }]}>
            {selectedItem.description}
          </Text>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  banner: {
    width: '100%',
    height: 180,
  },
  body: {
    padding: spacing.lg,
  },
  badgeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  badgeContainer: {
    width: 80,
    height: 80,
    borderRadius: spacing.borderRadiusMd,
    borderWidth: 1,
    padding: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  badgeImage: {
    width: '100%',
    height: '100%',
  },
  titleColumn: {
    flex: 1,
  },
  title: {
    ...typography.heading,
  },
  subtitle: {
    ...typography.body,
    marginTop: spacing.xs,
  },
  favToggleButton: {
    marginBottom: spacing.lg,
  },
  infoCard: {
    marginBottom: spacing.lg,
  },
  sectionHeading: {
    ...typography.subheading,
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoCol: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  },
  infoLabel: {
    ...typography.caption,
    marginTop: spacing.xs,
    marginBottom: 2,
  },
  infoValue: {
    ...typography.captionBold,
    textAlign: 'center',
  },
  websiteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
  },
  websiteText: {
    ...typography.captionBold,
    marginLeft: spacing.xs,
  },
  descriptionCard: {
    marginBottom: spacing.lg,
  },
  descriptionText: {
    ...typography.body,
    lineHeight: 22,
  },
});
