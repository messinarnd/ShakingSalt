import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  Container,
  Col,
  Row,
  Picker
} from 'react-native';
import { Card, ListItem, Overlay } from 'react-native-elements'
import { AsyncStorage } from 'react-native';
import { gray, grey } from 'ansi-colors';

const STORAGE_KEY = 'LOG_ITEMS_STORAGE' // Don't put it in Constants cause it doesn't get initialized before call to log DB cause react suX
var nutritionVisible = false;
// import { searchResultsEndpoint, axiosConfig } from "../../services/USDAFoodService";
// const axios = require("axios");

export default FoodDetailsPage = (props) => {
  // Probably need to add redux for global state so we know what the search term was for alternatives
  // Or maybe if they search 'cheese' but click on 'cheddar cheese' then the alternatives should search for cheddar

  const { foodDetails } = props
  Object.freeze(foodDetails) // Not really sure if this is needed since using the spread operators (...) but doesn't hurt

  // Function for logging food info when user clicks on the log item button
  storeData = async () => {
    // await AsyncStorage.clear(); // FOR DEBUG ONLY - SHOULD BE COMMENTED
    console.log("Logging new item..");
    try {
      // Making sure allLogs array is initialized in the beginning
      const existingLogs = await AsyncStorage.getItem(STORAGE_KEY);
      let allLogs = JSON.parse(existingLogs);
      if (!allLogs) {
        allLogs = []
      }

      // Creating this log object based on user selection
      // Add more field info for log (and then display it in MyLogsPage) as necessary
      var item = {
        logTimeStamp: getCurrentDateTime(),
        logFdcId: foodDetails.fdcId,
        logBrandedFoodCategory: foodDetails.brandedFoodCategory,
        logBrandOwner: foodDetails.brandOwner,
        logServingSize: servingSize,
        logServingAmount: servingAmount
      };

      // Adding the new item to the JSON array
      allLogs.push(item);

      console.log('Current log DB:')
      console.log(allLogs);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(allLogs)).then(() => alert('Logged!'));
      // TODO: Pop navigation stack (return to home page)
    } catch (error) {
      console.log(error.message);
    }
  };

  // Helper function for getting current timestamp for logging
  getCurrentDateTime = () => {
    var day = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    var hours = new Date().getHours();
    var min = new Date().getMinutes();
    var sec = new Date().getSeconds();
    var formattedDateTime = month + '/' + day + '/' + year + ' ' + hours + ':' + min + ':' + sec;
    return formattedDateTime;
  };

  const [nutrientsObj, setNutrientsObj] = useState({ ...foodDetails.labelNutrients })
  console.log("og nutrients: ", nutrientsObj)

  const [servingSize, setServingSize] = useState("g")
  const [servingAmount, setServingAmount] = useState(0)

  useEffect(() => {
    let factor = 0;
    // One serving size is actually based on 1 ounce for the Belgioioso cheese (it's romano) and triad beer cheese
    // bread, rye doesn't even have labelNutrients....
    // TODO: figure out a consistent way to get the nutrients and then update the factor multipliers here
    if (servingSize == "g") {
      factor = ((1 * servingAmount) / 100)
    } else if (servingSize == "oz") {
      factor = ((28.345 * servingAmount) / 100)
    } else if (servingSize == "lbs") {
      factor = ((453.592 * servingAmount) / 100)
    } else if (servingSize == "mg") {
      factor = ((0.001 * servingAmount) / 100)
    }

    updateAllFoodNutrients(factor)
  }, [servingSize, servingAmount])

  updateAllFoodNutrients = (factor) => {
    let nutrientsObjCopy = { ...foodDetails.labelNutrients }
    let newNutrientObj = Object.keys(nutrientsObjCopy).reduce((obj, nutrientName) => {
      obj[nutrientName] = {}
      obj[nutrientName]["value"] = nutrientsObjCopy[nutrientName]["value"] * factor
      return obj
    }, {})
    setNutrientsObj(newNutrientObj)
  }
  console.log("IS VISIBLE: " + nutritionVisible);
  return (
    <View style={styles.container}>
      {/* <Overlay 
        isVisible={nutritionVisible} 
        onBackdropPress={() => {
        nutritionVisible = false
        // TODO: Reload 
        }}>
        {Object.keys(nutrientsObj).map((nutrientName, index) => {
          if (nutrientName != "calories" || nutrientName != "sodium") {
            return (<ListItem title={nutrientName} rightSubtitle={nutrientsObj[nutrientName]["value"]}/>)
          }
        })}
      </Overlay> */}
      <ScrollView style={styles.container}
        contentContainerStyle={styles.contentContainer}>
        <View>
          <Card title={foodDetails.description + " - " + foodDetails.brandOwner}>
            <View>
              <View style={{ flex: 0, flexDirection: 'row' }}>
                <View style={{ flex: 2, fontSize: 14 }}><ListItem key={0} title={"Serving Size: "} bottomDivider /></View>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <TextInput
                    placeholder="amount.."
                    keyboardType="numeric"
                    onChangeText={(text) => { setServingAmount(text ? text : 0); }}
                  />
                </View>
                <View style={{ flex: 1, justifyContent: 'center'  }}>
                  <Picker
                    selectedValue={servingSize}
                    style={{ height: 50, width: 100 }}
                    onValueChange={(itemValue, itemIndex) => { setServingSize(itemValue) }}
                  >
                    <Picker.Item label="g" value="g" />
                    <Picker.Item label="oz" value="oz" />
                    <Picker.Item label="lbs" value="lbs" />
                    <Picker.Item label="mg" value="mg" />
                  </Picker>
                </View>
              </View>
              <ListItem key={2} title={"Calories: "} rightSubtitle={nutrientsObj["calories"]["value"]} bottomDivider />
              <ListItem key={3} title={"Sodium: "} rightSubtitle={nutrientsObj["sodium"]["value"]} bottomDivider />
              <ListItem key={4} title={"Other Information: "} rightSubtitle={nutrientsObj["sodium"]["value"]} bottomDivider />
              {Object.keys(nutrientsObj).map((nutrientName, index) => {
                if (nutrientName != "calories" || nutrientName != "sodium") {
                  return (<ListItem key={index} titleStyle={{ color: 'grey', fontSize: 10 }} rightSubtitleStyle={{ color: 'grey', fontSize: 10 }} title={nutrientName} rightSubtitle={nutrientsObj[nutrientName]["value"]} />)
                }
              })}
              <View style={{ flex: 1, flexDirection: 'row-reverse', padding: 10 }}>
                <Button title="Log" onPress={storeData} />
                {/* <Button title="Nutritional Information" onPress={() => {
                  nutritionVisible = true;
                  // TODO: Reload 
                }} /> */}
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}


FoodDetailsPage.navigationOptions = {
  title: 'Details',
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
