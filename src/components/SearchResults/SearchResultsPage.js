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
import { Avatar, Badge, Icon, withBadge } from 'react-native-elements'
import SearchListItem from './SearchListItem';
const axios = require("axios");

export default SearchResultsPage = (props) => {
    // Get the foodItems array that was passed from SearchResultsPage
    const { navigation } = props
    const { params } = navigation.state;
    const foodItems = params.foodItems;
    // currently used for passing the food item search
    global.test = foodItems;
    global.filtered = foodItems;

    // make results page look less dumb with the "sodium per serving"
    return (
        <View style={styles.container}>
            <ScrollView style={styles.container}
                contentContainerStyle={styles.contentContainer}>
                <View>
                    <ListItem
                        title={"Search Results"}
                        badge= { {value:"Sodium per serving"}}
                        onPress={() => getFoodDetails(item.fdcId)}
                        bottomDivider
                    />
                    {
                        foodItems.map((foodItem, index) => {
                            return(<SearchListItem navigation={navigation} key={foodItem.fdcId} item={foodItem}></SearchListItem>);
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