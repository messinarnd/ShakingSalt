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
import { Avatar, Badge, Icon, withBadge } from 'react-native-elements';
const axios = require("axios");

export default SearchListItem = (props) => {
    const { item, navigation } = props;
    console.log("nav: ", navigation)

    const [sodiumLevel, setSodiumLevel] = useState(0);

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
                setSodiumLevel(response.data.labelNutrients.sodium.value ? `${response.data.labelNutrients.sodium.value}` : "Value Unknown");
            })
            .catch((err) => {
                console.log(err);
            })
    }

    getSodiumLevel(item.fdcId);
    let color;
    console.log("BITCH", sodiumLevel);
    if (sodiumLevel < 140) {
        color = "success";
    } else if (sodiumLevel > 480) {
        color = "error";
    } else {
        color = "warning";
    }
    
    return(
        <View>
            <ListItem
                title={item.brandOwner ? `${item.description} - ${item.brandOwner}` : `${item.description}`}
                badge= { {value:sodiumLevel, status:color}}
                // getSodiumLevel(item.fdcId)
                onPress={() => getFoodDetails(item.fdcId)}
                bottomDivider
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