import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainTabParamList, HomeStackParamList } from '../../../navigation/types';
import { useAppDispatch, useAppSelector } from '../../../app/store';
import { loadFavourites, toggleFavourite } from '../slice/favouritesSlice';
import { TeamCard } from '../../sports/components/TeamCard';
import { EmptyView } from '../../../shared/components/EmptyView';
import { OfflineBanner } from '../../../shared/components/OfflineBanner';
import { useAppTheme } from '../../../shared/hooks/useAppTheme';
import { spacing } from '../../../theme/spacing';

type FavouritesScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'FavouritesTab'>,
  NativeStackNavigationProp<HomeStackParamList>
>;

interface Props {
  navigation: FavouritesScreenNavigationProp;
}

export const FavouritesScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useAppTheme();
  const dispatch = useAppDispatch();
  const { items, loading, isHydrated } = useAppSelector(state => state.favourites);
  const isOffline = useAppSelector(state => state.sports.isOffline);

  useEffect(() => {
    dispatch(loadFavourites());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(loadFavourites());
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <OfflineBanner visible={isOffline} />

      <FlatList
        data={items}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TeamCard
            item={item}
            isFavourite={true}
            onPress={() => {
              // Navigate to details passing itemId only
              navigation.navigate('Details', { itemId: item.id });
            }}
            onToggleFavourite={() => dispatch(toggleFavourite(item))}
            testID={`fav-team-card-${item.id}`}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
        ListEmptyComponent={
          isHydrated ? (
            <EmptyView
              title="No Favourites Yet"
              message="Tap the heart icon on any team card to save it here. Saved favourites are accessible even when completely offline!"
              iconName="heart"
            />
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: spacing.md,
    flexGrow: 1,
  },
});
