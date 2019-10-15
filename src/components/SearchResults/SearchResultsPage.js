import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';
import { getFoodDetailsEndpoint, axiosConfig } from '../../services/USDAFoodService';
const axios = require("axios");

export default SearchResultsPage = (props) => {
    // Get the foodItems array that was passed from SearchResultsPage
    const { params } = props.navigation.state;
    const foodItems = params.foodItems;

    getFoodDetails = (fdcId) => {
        axios.get(getFoodDetailsEndpoint(fdcId), axiosConfig)
            .then((response) => {
                console.log("response data: ", response.data);
                // Need to add navigation to a new page called FoodDetailsPage
                // Look at SearchPage for how this can be done
                // Think we only need to pass in response.data.foodNutrients not all of response.data
            })
            .catch((err) => {
                console.log(err);
            })
    }

    return(
        <View style={styles.container}>
            <ScrollView style={styles.container}
            contentContainerStyle={styles.contentContainer}>
                <View style={styles.welcomeContainer}>
                    <Text>Hello, Search Results!</Text>
                    {/* This is the loop that will display the list of foodItems */}
                    {
                        foodItems.map((foodItem, index) => {
                            return(
                                <Button 
                                    key={foodItem.fdcId}
                                    title={`${foodItem.brandOwner} - full name?`}
                                    onPress={() => getFoodDetails(foodItem.fdcId)} />
                                    // Not sure where to get the full name only the brand name
                            )
                            
                        })
                    }
                    
                </View>
            </ScrollView>
        </View>
    )
}

SearchResultsPage.navigationOptions = {
    title: 'SearchResultsPage',
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