import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feather from 'react-native-vector-icons/Feather';
import { HomeStackParamList, MainTabParamList } from './types';
import { HomeScreen } from '../features/sports/screens/HomeScreen';
import { DetailsScreen } from '../features/sports/screens/DetailsScreen';
import { FavouritesScreen } from '../features/favourites/screens/FavouritesScreen';
import { useAppTheme } from '../shared/hooks/useAppTheme';
import { spacing } from '../theme/spacing';

const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

export const HomeStackNavigator: React.FC = () => {
  const { theme } = useAppTheme();

  return (
    <HomeStack.Navigator
      initialRouteName="HomeFeed"
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: theme.colors.textPrimary,
        headerTitleStyle: { fontWeight: '700' },
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <HomeStack.Screen
        name="HomeFeed"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="Details"
        component={DetailsScreen}
        options={{
          title: 'Team Details',
          headerBackTitleVisible: false,
        }}
      />
    </HomeStack.Navigator>
  );
};

export const MainNavigator: React.FC = () => {
  const { theme } = useAppTheme();

  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={({ route }) => ({
        headerShown: route.name === 'FavouritesTab',
        headerTitle: 'Saved Favourites',
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: theme.colors.textPrimary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          minHeight: spacing.minTouchTarget + 12, // >= 48dp touch target
          paddingBottom: spacing.sm,
          paddingTop: spacing.xs,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarIcon: ({ color, size }) => {
          let iconName = 'home';
          if (route.name === 'HomeTab') {
            iconName = 'activity';
          } else if (route.name === 'FavouritesTab') {
            iconName = 'heart';
          }
          return <Feather name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{
          tabBarLabel: 'Home',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="FavouritesTab"
        component={FavouritesScreen}
        options={{
          tabBarLabel: 'Favourites',
        }}
      />
    </Tab.Navigator>
  );
};
