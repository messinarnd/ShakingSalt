import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Button
} from 'react-native';
import { AsyncStorage } from 'react-native';
import { getFoodDetailsEndpoint, axiosConfig } from '../../services/USDAFoodService';
import { ListItem } from 'react-native-elements';
const axios = require("axios");
const FETCH_KEY = 'SEARCH_RESULTS' // three hours of googling later... kms i hate javascript

// gg for stateful components
export default class Alternatives extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedItems: 0,
      foodItems: [],
      searchItems: []
    };
    // console.log("FOOD SODIUM:", this.props.foodDetails.labelNutrients.sodium.value);
  }

  // getting stuff as we initially load 
  componentDidMount = async() => {
    // get the stored data (this list is filtered so the currently selected item isn't included)
    await this.getSearchedFoods();
  }

  // yeet our search results from AsynStorage
  getSearchedFoods = async() => {
    console.log('Fetching searched food list');
    try {
      const savedList = await AsyncStorage.getItem(FETCH_KEY);
      if (savedList !== null) {
        var searchResults = JSON.parse(savedList);
        let id = this.props.foodDetails.fdcId;
        searchResults = searchResults.filter(function(value, index, arr){
          return value.fdcId != id;
        });
        this.setState({
          searchItems: searchResults
        }, async() => {
          var len = this.state.searchItems.length;
          for (var i = 0; i < len; i++) {
            this.getFoodDetails(this.state.searchItems[i].fdcId);
          }
      });
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  // get the actual food data
  getFoodDetails = (fdcId) => {
    axios.get(getFoodDetailsEndpoint(fdcId), axiosConfig)
        .then((response) => {
            // console.log("IT'S YA BOI");
            const detailedInfo = response.data;
            // filter for sodium level (foods with unknown sodium content get a free pass)
            var temp = detailedInfo.labelNutrients;
            var temp2 = null;
            var checkSodium = 0;
            if (temp != null) {
              temp2 = detailedInfo.labelNutrients.sodium;
            }
            if(temp != null && temp2 != null) {
              checkSodium = detailedInfo.labelNutrients.sodium.value;
            }
            if (checkSodium < this.props.foodDetails.labelNutrients.sodium.value) {
              // console.log("Adding this item... Sodium: ", checkSodium);
              this.setState({ 
                checkedItems : this.state.checkedItems + 1,
                foodItems: this.state.foodItems.concat(detailedInfo) 
              });
            } else {
              this.setState({ 
                checkedItems : this.state.checkedItems + 1,
              });
              // console.log("WARNING: SODIUM TOO HIGH: ", checkSodium);
            }
        })
        .catch((err) => {
            console.log(err);
        })
  }
  
  // for getting sodium information in the view
  // returns string "UNKNOWN" if food.labelNutrients is null
  // or food.labelNutrients.sodium is null
  getSodiumInformation = (food) => {
    var temp = food.labelNutrients;
    var temp2 = null;
    if (temp != null) {
      temp2 = food.labelNutrients.sodium;
    }
    if(temp != null && temp2 != null) {
      return food.labelNutrients.sodium.value.toString();
    } else {
      return "UNKNOWN";
    }
  }

  // the click handler when an alternative item is clicked
  // doesn't search the db again because we already did that for sodium info
  getTransition = (fdcId) => {
    // using push so we add a page to the stack (so back goes
    // to the previous food details page's alt tab)
    console.log("TRANSITIONING");
    var array = this.state.foodItems;
    var foodItem = array.find(function(element) { 
      return element.fdcId == fdcId; 
    });
    console.log(foodItem.brandOwner);
    // console.log(this.state.searchItems[index].brandOwner);
    // console.log("fake push");
    this.props.navigation.push('FoodDetailsTabsPage', {
      foodDetails: foodItem
    })
  }

  // display our page
  render() {
    // if we haven't finished loading and stuff yet, stall
    if (this.state.checkedItems == 0 || this.state.checkedItems < this.state.searchItems.length) {
      return(
        <View style={{flex: 1, paddingTop:20}}>
          <ActivityIndicator />
        </View>
      );
    }
    console.log("ready: (checked", this.state.checkedItems,
      "\b, passed", this.state.foodItems.length, "\b, orig", this.state.searchItems.length, "\b)");
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container}
          contentContainerStyle={styles.contentContainer}>
          <View>
            {
              this.state.foodItems.map((foodItem, index) => {
                if (foodItem.brandOwner == null) {
                  return (
                    <ListItem
                      key={foodItem.fdcId}
                      title={`${foodItem.description}`}
                      // rightSubtitle={this.getSodiumInformation(foodItem)}
                      onPress={() => this.getTransition(foodItem.fdcId)}
                      bottomDivider
                    />
                  )
                } else {
                  return (
                    <ListItem
                      key={foodItem.fdcId}
                      title={`${foodItem.description} - ${foodItem.brandOwner}`}
                      // rightSubtitle={this.getSodiumInformation(foodItem)}
                      onPress={() => this.getTransition(foodItem.fdcId)}
                      bottomDivider
                    />
                  )
                }
              }
              )
            }
          </View>
        </ScrollView>
      </View>
    );
  }
}

Alternatives.navigationOptions = {
  title: 'Alternatives',
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