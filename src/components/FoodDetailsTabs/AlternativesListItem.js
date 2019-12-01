import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { getFoodDetailsEndpoint, axiosConfig } from '../../services/USDAFoodService';
import { ListItem } from 'react-native-elements';
const axios = require("axios");

export default AlternativesListItem = (props) => {
    const { item, navigation } = props;

    // Get the sodium level for each item (not included in original API call so have to make separate one for each item)
    // If addingall food nutrients, it really frees up the need for a lot of future API calls
    const [sodiumLevel, setSodiumLevel] = useState(0);
    useEffect(() => {
        setSodiumLevel(item["sodiumLevel"]);
    }, []);

    getFoodDetails = (fdcId, sodLvl) => {
        axios.get(getFoodDetailsEndpoint(fdcId), axiosConfig).then((response) => {
                global.filtered = (global.foodItemsWithNutrients).filter(function(value, index, arr){
                    return value.fdcId != fdcId;
                });
                navigation.push('FoodDetailsTabsPage', {
                    foodDetails: response.data,
                    sodiumContent: sodLvl
                })
            }).catch((err) => {
                console.log(err);
            })
    }
    
    return(
        <View>
            <ListItem
                title={item.brandOwner ? `${item.description} - ${item.brandOwner}` : `${item.description}`}
                rightSubtitle={sodiumLevel.toString() + " mg"}
                // Low sodium is less than 140 mg of sodium per RACC (around 50g). Our nutrition measurements are based on 100g servings
                rightSubtitleStyle={{color:(sodiumLevel > 960 ? 'red' : (sodiumLevel < 280 ? 'green' : 'orange'))}}
                onPress={() => getFoodDetails(item.fdcId, item.sodiumLevel)}
                bottomDivider
                chevron
            />
        </View>
        
    )
}

AlternativesListItem.navigationOptions = {
    title: 'AlternativesListItem',
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