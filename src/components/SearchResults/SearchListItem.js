import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';
import { getFoodDetailsEndpoint, axiosConfig } from '../../services/USDAFoodService';
import { ListItem } from 'react-native-elements';
const axios = require("axios");

export default SearchListItem = (props) => {
    const { item, navigation } = props;

    // Get the sodium level for each item (not included in original API call so have to make separate one for each item)
    const [sodiumLevel, setSodiumLevel] = useState(0);
    useEffect(() => {
        axios.get(getFoodDetailsEndpoint(item.fdcId), axiosConfig)
        .then((response) => {

            let sodLvl = response.data.foodNutrients.reduce((sodiumContent, thisNutrient) => {
                let nutrientName = thisNutrient.nutrient.name;
                if (nutrientName == "Sodium, Na") {
                    return sodiumContent + parseInt(thisNutrient.amount);
                } else {
                    return sodiumContent;
                }
            }, 0);

            setSodiumLevel(sodLvl);
        })
        .catch((err) => {
            console.log(err);
        });
    }, []);

    // Low sodium is less than 140 mg of sodium per RACC (around 50g). Our nutrition measurements are based on 100g servings
    let color;
    if (sodiumLevel < 280) {
        // Low Sodium
        color = "success";
    } else if (sodiumLevel > 960) {
        // High Sodium
        color = "error";
    } else {
        // Average Sodium
        color = "warning";
    }

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
    
    return(
        <View>
            <ListItem
                title={item.brandOwner ? `${item.description} - ${item.brandOwner}` : `${item.description}`}
                badge= { {value:sodiumLevel + " mg", status:color}}
                onPress={() => getFoodDetails(item.fdcId)}
                bottomDivider
                chevron
            />
        </View>
        
    )
}

SearchListItem.navigationOptions = {
    title: 'SearchListItem',
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