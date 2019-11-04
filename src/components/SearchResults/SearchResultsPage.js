import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    Button
} from 'react-native';
// import { AsyncStorage } from 'react-native';
import { getFoodDetailsEndpoint, axiosConfig } from '../../services/USDAFoodService';
import { ListItem } from 'react-native-elements';
const axios = require("axios");

export default SearchResultsPage = (props) => {
    // Get the foodItems array that was passed from SearchResultsPage
    const { navigation } = props
    const { params } = navigation.state;
    const foodItems = params.foodItems;
    // currently used for passing the food item search
    global.test = foodItems;
    global.filtered = foodItems;

    getFoodDetails = (fdcId) => {
        axios.get(getFoodDetailsEndpoint(fdcId), axiosConfig)
            .then((response) => {
                // console.log("response data: ", response.data);
                global.filtered = (global.test).filter(function(value, index, arr){
                    return value.fdcId != fdcId;
                });
                navigation.navigate('FoodDetailsTabsPage', {
                    foodDetails: response.data
                })
            })
            .catch((err) => {
                console.log(err);
            })
    }

    getSodiumLevel = (fdcId) => {
        axios.get(getFoodDetailsEndpoint(fdcId), axiosConfig)
            .then((response) => {
                return response.data.labelNutrients.sodium.value ? `${response.data.labelNutrients.sodium.value}` : "Value Unknown";
            })
            .catch((err) => {
                console.log(err);
            })
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.container}
                contentContainerStyle={styles.contentContainer}>
                <View>
                    {
                        foodItems.map((foodItem, index) => {
                            if (foodItem.brandOwner == null) {
                                return (
                                    <ListItem
                                        key={foodItem.fdcId}
                                        title={`${foodItem.description}`}
                                        rightSubtitle={getSodiumLevel(foodItem.fdcId)}
                                        onPress={() => getFoodDetails(foodItem.fdcId)}
                                        bottomDivider
                                    />
                                )
                            } else {
                                return (
                                    <ListItem
                                        key={foodItem.fdcId}
                                        title={`${foodItem.description} - ${foodItem.brandOwner}`}
                                        rightSubtitle={getSodiumLevel(foodItem.fdcId)}
                                        onPress={() => getFoodDetails(foodItem.fdcId)}
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