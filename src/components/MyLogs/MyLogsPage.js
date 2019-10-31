import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ListView,
  ActivityIndicator,
  RefreshControl,
  FlatList,
} from 'react-native';
import { ListItem } from 'react-native-elements';
import { AsyncStorage } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { isLoading } from 'expo-font';

const STORAGE_KEY = 'LOG_ITEMS_STORAGE' // Don't put it in Constants cause it doesn't get initialized before call to log DB cause react suX

export default class MyLogsPage extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      isRefreshing: false,
      data: []
    }
  }

  // Reading dem data after rendering
  componentDidMount = async() => {
    this.retrieveData();
  }

  // Function for reading the local storage logged items
  retrieveData = async() => {
    // await AsyncStorage.clear(); // FOR DEBUG ONLY - SHOULD BE COMMENTED
    console.log('Retrieving logged data..');
    try {
      const retrievedItem = await AsyncStorage.getItem(STORAGE_KEY);
      if (retrievedItem !== null) {
        this.setState({
          dataSource: JSON.parse(retrievedItem),
        });
      }

      // Clearing flags so we don't show activity indicator for the life of the user
      this.setState({
        isLoading: false,
        isRefreshing: false
      });
      console.log(retrievedItem);
    } catch (error) {
      console.log(error.message);
    }
  }

  FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 2,
          width: "100%",
          backgroundColor: "#000",
        }}
      />
    );
  }

  // Pull down to refresh this bad boi
  onRefresh() {
    // TODO: implement a callback listener to update list automatically upon a new log
    this.setState({ isRefreshing: true });
    this.retrieveData();
  }

  // For when there's no logged items
  showEmptyComponent = () => {
    return (
        <View>
            <Text style={styles.emptyMessageStyle}>No Logged Items, EAT SOMETHING!</Text>
        </View>
    )
  }

  render() {
      if (this.state.isLoading) {
        return(
          <View style={{flex: 1, paddingTop:20}}>
            <ActivityIndicator />
          </View>
        );
      }

      return (
        <View style={styles.container}>
          <ScrollView style={styles.container}
            contentContainerStyle={styles.contentContainer}>
            <View style={styles.MainContainer}>
              {/* ListView is deprecated don't use it fam */}
              <FlatList
                data = {this.state.dataSource}
                ItemSeparatorComponent = {this.FlatListItemSeparator}
                ListEmptyComponent={this.showEmptyComponent}
                refreshControl = {
                  <RefreshControl
                    refreshing = {this.state.isRefreshing}
                    onRefresh = {this.onRefresh.bind(this)}
                  />
                }
                renderItem={({item}) =>
                  <View>
                    <ListItem title={"Timestamp: "} rightSubtitle={item.logTimeStamp} />
                    <ListItem title={"fdcId: "} rightSubtitle={item.logFdcId} />
                    <ListItem title={"Food Category: "} rightSubtitle={item.logBrandedFoodCategory} />
                    <ListItem title={"Brand Owner: "} rightSubtitle={item.logBrandOwner} />
                    <ListItem title={"Serving Size: "} rightSubtitle={item.logServingSize} />
                    <ListItem title={"Serving Amount: "} rightSubtitle={item.logServingAmount} />
                  </View>
                }    
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          </ScrollView>
        </View>
    );
  }
}

MyLogsPage.navigationOptions = {
  title: 'My Logs',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  emptyMessageStyle: {
    fontSize: 24,
    textAlign: 'center',
    marginTop: '50%', 
  }
});
