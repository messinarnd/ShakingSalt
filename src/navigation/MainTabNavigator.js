import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs'

import TabBarIcon from '../components/MainTabBar/TabBarIcon';
import SearchPage from "../components/Search/SearchPage";
import MyLogsPage from "../components/MyLogs/MyLogsPage";
import SearchResultsPage from "../components/SearchResults/SearchResultsPage";

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

// Setup for the 'Search' tab
const SearchStack = createStackNavigator(
  {
    Search: SearchPage,
    SearchResultsPage: SearchResultsPage,
    // Add any other screens that relate to this stack here
    // Food details page will be one once we implement that
    // Adding here allows 'navigation' to be accessed from the props in that component
    // It might also be needed just to go to that page even if you aren't navigating once there
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
    MyLogs: MyLogsPage,
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

const tabNavigator = createBottomTabNavigator({
  Search: SearchStack,
  MyLogs: MyLogsStack
});

tabNavigator.path = '';

export default tabNavigator;
