import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Searchbar from "./Searchbar";
import { searchResultsEndpoint, axiosConfig } from "../../services/USDAFoodService";
const axios = require("axios");


export default SearchPage = (props) => {
  // Allows you to get the stack navigator
  const { navigation } = props;

  searchItem = (foodItem) => {
    let postData = {
      generalSearchInput: foodItem
    }
    
    axios.post(searchResultsEndpoint, postData, axiosConfig)
      .then((response) => {
        // Repsonse.data.foods is an array of all food objects
        // Navigate vs push might come in handy with clicking on food items in the alternatives list
        navigation.navigate('SearchResultsPage', {
          foodItems: response["data"]["foods"]
        })
      })
      .catch((err) => {
        console.log(err);
      })
  }

  return (
    <View style={styles.container}>
      <Searchbar searchItem={this.searchItem}/>

      <ScrollView style={styles.container}
      contentContainerStyle={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
              <Text>Hello, Search!</Text>
          </View>
      </ScrollView>
    </View>
  );
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
