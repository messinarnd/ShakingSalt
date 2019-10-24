import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    Button
} from 'react-native';
import { getFoodDetailsEndpoint, axiosConfig } from '../../services/USDAFoodService';
import { ListItem } from 'react-native-elements';
const axios = require("axios");

export default SearchResultsPage = (props) => {
    // Get the foodItems array that was passed from SearchResultsPage
    const { navigation } = props
    const { params } = navigation.state;
    const foodItems = params.foodItems;

    getFoodDetails = (fdcId) => {
        axios.get(getFoodDetailsEndpoint(fdcId), axiosConfig)
            .then((response) => {
                console.log("response data: ", response.data);
                navigation.navigate('FoodDetailsTabsPage', {
                    foodDetails: response.data
                })
                // Need to add navigation to a new page called FoodDetailsPage
                // Look at SearchPage for how this can be done
                // Think we only need to pass in response.data.foodNutrients not all of response.data
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
                                        title={`${foodItem.description} (${foodItem.score})`}
                                        rightSubtitle={"Sodium Level Placeholder"}
                                        onPress={() => getFoodDetails(foodItem.fdcId)}
                                        bottomDivider
                                    />
                                )
                            } else {
                                return (
                                    <ListItem
                                        key={foodItem.fdcId}
                                        title={`${foodItem.description} - ${foodItem.brandOwner} (${foodItem.score})`}
                                        rightSubtitle={"Sodium Level Placeholder"}
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