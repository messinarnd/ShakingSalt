import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  FlatList,
} from 'react-native';

import Searchbar from "./Searchbar";
import {ListItem} from 'react-native-elements';
import { searchResultsEndpoint, axiosConfig } from "../../services/USDAFoodService";
import { AsyncStorage } from 'react-native';
const axios = require("axios");

const REC_SEARCHED_STORAGE_KEY = 'REC_SEARCHED_ITEMS_STORAGE'

export default class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    }

    // To update the recently searched list whenever user gets back to this screen
    this.props.navigation.addListener('willFocus', () => {
      this.retrieveRecentlySearchedData();
    });
  }

  // Reading dem recently searched data after rendering
  componentDidMount = async() => {
    this.retrieveRecentlySearchedData();
  }

  searchItem = async (foodItem) => {
    // console.log("here in searchItem");
    let postData = {
      generalSearchInput: foodItem
    }
    
    axios.post(searchResultsEndpoint, postData, axiosConfig)
      .then((response) => {
        if (response["data"]["totalHits"] !== 0) {
            // If success, log to recently searched DB
          this.storeRecentlySearchedData(foodItem);
          // Response.data.foods is an array of all food objects
          // Navigate vs push might come in handy with clicking on food items in the alternatives list
          let searchResults = response["data"]["foods"];
          console.log("storing to AsyncStorage...")
          AsyncStorage.setItem("SEARCH_RESULTS", JSON.stringify(searchResults));
          this.props.navigation.navigate('SearchResultsPage', {
            foodItems: response["data"]["foods"]
          })
        } else {
          alert('No result found for search input ' + foodItem.toString());
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }

  storeRecentlySearchedData = async (foodItem) => {
    // await AsyncStorage.clear(); // FOR DEBUG ONLY - SHOULD BE COMMENTED
    // console.log("Storing rec searched item..");
    // console.log(foodItem);

    try {
      // Making sure allRecSearchedItems array is initialized in the beginning
      const existingSearches = await AsyncStorage.getItem(REC_SEARCHED_STORAGE_KEY);
      let allRecSearchedItems = JSON.parse(existingSearches);
      if (!allRecSearchedItems) {
        allRecSearchedItems = []
      }

      // Declared as a JSON object for future expansion
      var recSearchItem = {
        searchedText: foodItem
      }

      // Adding the item to the JSON array if it doesn't already exist (better UI)
      var duplicate = false;
      for (var i = 0; i < allRecSearchedItems.length; i++) {
        if (JSON.stringify(allRecSearchedItems[i]) === JSON.stringify(recSearchItem)) {
          duplicate = true;
          break;
        }
      }

      if (!duplicate) {
        allRecSearchedItems.push(recSearchItem);
      } else {
        console.log("Duplicate found. Not adding to recently searched array.");
      }

      // console.log('Current recently searched DB:')
      // console.log(allRecSearchedItems);
      await AsyncStorage.setItem(REC_SEARCHED_STORAGE_KEY, JSON.stringify(allRecSearchedItems)).then(() => console.log('Recently Searched Logged!: ', foodItem));
    } catch (error) {
      console.log(error.message);
    }
  };

  // Function for reading the local storage logged items
  retrieveRecentlySearchedData = async() => {
    // await AsyncStorage.clear(); // FOR DEBUG ONLY - SHOULD BE COMMENTED
    // console.log('Retrieving recently searched data..');
    try {
      const retrievedItem = await AsyncStorage.getItem(REC_SEARCHED_STORAGE_KEY);
      if (retrievedItem !== null) {
        this.setState({
          dataSource:JSON.parse(retrievedItem),
        });
      }

      console.log("Recently searched items: ", retrievedItem);
    } catch (error) {
      console.log(error.message);
    }
  }

  // For when there's no recently searched items
  showEmptyComponent = () => {
    return (
        <View>
            <Text style={styles.emptyMessageStyle}>No Recent Searches!</Text>
        </View>
    )
  }

  // TODO: Farzam implement in future using SwipeView --> mind need a npm package @see e.g. https://www.npmjs.com/package/react-swipe-view
  // deleteRecSearchedItem = async(item) => {
  //   try {
  //     let allRecentlySearches = await AsyncStorage.getItem(REC_SEARCHED_STORAGE_KEY);
  //     if (allRecentlySearches !== null) {
  //       let arr = JSON.parse(allRecentlySearches);
  //       const filteredArr = arr.filter(function(e){return JSON.stringify(e) !== JSON.stringify(item)});
  //       await AsyncStorage.removeItem(REC_SEARCHED_STORAGE_KEY, filteredArr);
  //     }
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // }

  render() {
      return (
        <View style={styles.container}>
          <Searchbar searchItem={this.searchItem}/>

          {/* RECENTLY SEARCHED */}
          <ScrollView style={styles.container}
            contentContainerStyle={styles.contentContainer}>
            <View style={styles.MainContainer}>
              {/* ListView is deprecated don't use it fam */}
              <FlatList
                data = {this.state.dataSource}
                ItemSeparatorComponent = {this.FlatListItemSeparator}
                ListEmptyComponent={this.showEmptyComponent}
                renderItem={({item}) =>
                  <View>
                      <ListItem title={item.searchedText} onPress={() => this.searchItem(item.searchedText)} />
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

SearchPage.navigationOptions = {
  title: 'Search',
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
  }
});
