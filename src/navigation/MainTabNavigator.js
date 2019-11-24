import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs'

import TabBarIcon from '../components/MainTabBar/TabBarIcon';
import SearchPage from "../components/Search/SearchPage";
import MyLogsPage from "../components/MyLogs/MyLogsPage";
import SearchResultsPage from "../components/SearchResults/SearchResultsPage";
import FoodDetailsTabsPage from "../components/FoodDetailsTabs/FoodDetailsTabsPage";
import MyLogsTabsPage from "../components/MyLogs/MyLogsTabsPage";
import FoodDetailsPage from '../components/FoodDetailsTabs/FoodDetailsPage';
import AlternativesPage from '../components/FoodDetailsTabs/AlternativesPage';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

// Setup for the 'Search' tab
const SearchStack = createStackNavigator(
  {
    Search: SearchPage,
    SearchResultsPage: SearchResultsPage,
    FoodDetailsTabsPage: FoodDetailsTabsPage
  },
  config
);

SearchStack.navigationOptions = {
  tabBarLabel: 'Search',
  tabBarIcon: ({focused}) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-search' : 'md-search'} />
  )
};

SearchStack.path = '';


// Setup for the 'My Logs' tab
const MyLogsStack = createStackNavigator(
  {
    // MyLogs: MyLogsPage,
    MyLogs: MyLogsTabsPage
  },
  config
);

MyLogsStack.navigationOptions = {
  tabBarLabel: 'My Logs',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-calendar' : 'md-calendar'} />
  ),
};

MyLogsStack.path = '';


// Putting the two separate navigators together into the tab navigator
const tabNavigator = createBottomTabNavigator({
  Search: SearchStack,
  MyLogs: MyLogsStack
});

tabNavigator.path = '';

export default tabNavigator;
