import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';

import Searchbar from "./Searchbar";
import {ListItem} from 'react-native-elements';
import { searchResultsEndpoint, axiosConfig } from "../../services/USDAFoodService";
const axios = require("axios");


export default SearchPage = (props) => {
  // Allows you to get the stack navigator
  const { navigation } = props;
  const list = [                  // TODO: Populate this list with search as we go
    { name: "Recent Search 1"}, 
    { name: "Recent Search 2"}, 
    { name: "Recent Search 3"}] 

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

  handleClick = (e) => {  // TODO: Redirect to search result page with this search
    alert('TODO: Redirect to search result page with this item');
  }

  return (
    <View style={styles.container}>
      <Searchbar searchItem={this.searchItem}/>

      <ScrollView style={styles.container}>
        <View>
          {
            list.map((l, i) => (
              <ListItem
                key={i}
                title={l.name}
                subtitle={l.subtitle}
                onPress={handleClick}
                bottomDivider
              />
            ))
          }
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
