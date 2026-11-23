import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../../navigation/types';
import { useAppDispatch, useAppSelector } from '../../../app/store';
import {
  fetchSportsItems,
  hydrateSportsCache,
} from '../slice/sportsSlice';
import { toggleFavourite, loadFavourites } from '../../favourites/slice/favouritesSlice';
import { logoutUser } from '../../auth/slice/authSlice';
import { TeamCard } from '../components/TeamCard';
import { OfflineBanner } from '../../../shared/components/OfflineBanner';
import { LoadingView } from '../../../shared/components/LoadingView';
import { ErrorView } from '../../../shared/components/ErrorView';
import { EmptyView } from '../../../shared/components/EmptyView';
import { useAppTheme } from '../../../shared/hooks/useAppTheme';
import { spacing } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  'HomeFeed'
>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { theme, isDark, toggleTheme } = useAppTheme();
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);
  const { items, loading, refreshing, error, isOffline, isHydrated } =
    useAppSelector(state => state.sports);
  const favouriteItems = useAppSelector(state => state.favourites.items);

  // Initialize: load local cache immediately for offline-first support, then fetch fresh data
  useEffect(() => {
    dispatch(hydrateSportsCache()).then(() => {
      dispatch(fetchSportsItems());
    });
    dispatch(loadFavourites());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchSportsItems(true));
  };

  const isFavourite = (itemId: string) => {
    return favouriteItems.some(f => f.id === itemId);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Offline Status Banner */}
      <OfflineBanner visible={isOffline} />

      {/* Header bar displaying user's name & logout */}
      <View
        style={[
          styles.headerBar,
          {
            backgroundColor: theme.colors.surface,
            borderBottomColor: theme.colors.border,
          },
        ]}
      >
        <View style={styles.userInfo}>
          <Text style={[styles.greeting, { color: theme.colors.textSecondary }]}>
            Hello,
          </Text>
          <Text
            style={[styles.userName, { color: theme.colors.textPrimary }]}
            numberOfLines={1}
            testID="header-user-name"
          >
            {user?.firstName ? `${user.firstName} ${user.lastName}` : user?.username || 'Sports Fan'}
          </Text>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            onPress={toggleTheme}
            style={[
              styles.iconBtn,
              { backgroundColor: theme.colors.inputBackground },
            ]}
            accessibilityLabel="Toggle Theme"
          >
            <Feather
              name={isDark ? 'sun' : 'moon'}
              size={18}
              color={theme.colors.textPrimary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => dispatch(logoutUser())}
            style={[
              styles.iconBtn,
              styles.logoutBtn,
              { backgroundColor: theme.colors.errorBackground },
            ]}
            accessibilityLabel="Log out"
            testID="logout-button"
          >
            <Feather name="log-out" size={18} color={theme.colors.error} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content Area */}
      {loading && !refreshing && items.length === 0 ? (
        <LoadingView message="Loading sports leagues & teams..." />
      ) : error && items.length === 0 ? (
        <ErrorView
          message={error}
          onRetry={() => dispatch(fetchSportsItems())}
        />
      ) : (
        <FlatList
          data={items}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <TeamCard
              item={item}
              isFavourite={isFavourite(item.id)}
              onPress={() => {
                // Passes itemId ONLY, never the full object per strict assignment requirement!
                navigation.navigate('Details', { itemId: item.id });
              }}
              onToggleFavourite={() => dispatch(toggleFavourite(item))}
              testID={`team-card-${item.id}`}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={theme.colors.primary}
              colors={[theme.colors.primary]}
            />
          }
          ListEmptyComponent={
            isHydrated ? (
              <EmptyView
                title="No sports teams found"
                message="Pull down to refresh or check your internet connection."
                iconName="activity"
              />
            ) : null
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    minHeight: spacing.minTouchTarget, // >= 48dp
  },
  userInfo: {
    flex: 1,
  },
  greeting: {
    ...typography.caption,
  },
  userName: {
    ...typography.subheading,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  logoutBtn: {
    minWidth: spacing.minTouchTarget,
    minHeight: spacing.minTouchTarget,
  },
  listContainer: {
    padding: spacing.md,
    flexGrow: 1,
  },
});
