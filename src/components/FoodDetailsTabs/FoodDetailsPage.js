import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  Picker
} from 'react-native';

// import { searchResultsEndpoint, axiosConfig } from "../../services/USDAFoodService";
// const axios = require("axios");


export default FoodDetailsPage = (props) => {
  // Probably need to add redux for global state so we know what the search term was for alternatives
  // Or maybe if they search 'cheese' but click on 'cheddar cheese' then the alternatives should search for cheddar

  const {foodDetails} = props
  Object.freeze(foodDetails) // Not really sure if this is needed since using the spread operators (...) but doesn't hurt


  const [nutrientsObj, setNutrientsObj] = useState({...foodDetails.labelNutrients})
  console.log("og nutrients: ", nutrientsObj)

  const [servingSize, setServingSize] = useState("g")
  const [servingAmount, setServingAmount] = useState(0)

  useEffect(() => {
    let factor = 0;
    // One serving size is actually based on 1 ounce for the Belgioioso cheese (it's romano) and triad beer cheese
    // bread, rye doesn't even have labelNutrients....
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
    let nutrientsObjCopy = {...foodDetails.labelNutrients}
    let newNutrientObj = Object.keys(nutrientsObjCopy).reduce((obj, nutrientName) => {
      obj[nutrientName] = {}
      obj[nutrientName]["value"] = nutrientsObjCopy[nutrientName]["value"] * factor
      return obj
    }, {})
    setNutrientsObj(newNutrientObj)
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container}
      contentContainerStyle={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
              <Text>{foodDetails.description} - {foodDetails.brandOwner}</Text>
              <TextInput
                placeholder="Enter amount eaten..."
                keyboardType="numeric"
                onChangeText={(text) => {setServingAmount(text ? text : 0); setTest1(7); setTest2()}}
              />
              <Picker
                selectedValue={servingSize}
                style={{height: 50, width: 100}}
                onValueChange={(itemValue, itemIndex) => {setServingSize(itemValue)}}
              >
                <Picker.Item label="g" value="g" />
                <Picker.Item label="oz" value="oz" />
                <Picker.Item label="lbs" value="lbs" />
                <Picker.Item label="mg" value="mg" />
              </Picker>
              {/* Put these texts here as spacer so the picker wouldn't overlap */}
              {/* TODO: Get rid of the spacers and use css like a normal human being... */}
              {/* TODO: Change several rows of text to a table or something nicer */}
              <Text> </Text>
              <Text> </Text>
              <Text> </Text>
              <Text> </Text>
              <Text> </Text>
              <Text> </Text>
              <Text> </Text>
              <Text> </Text>
              <Text>serving size: {servingSize}</Text>
              <Text>serving amount: {servingAmount}</Text>
              <Text>Calories: {nutrientsObj["calories"]["value"]}</Text>
              <Text>Sodium: {nutrientsObj["sodium"]["value"]}</Text>
              {Object.keys(nutrientsObj).map((nutrientName, index) => {
                if (nutrientName != "calories" || nutrientName != "sodium") {
                  return (<Text key={index}>{nutrientName} - {nutrientsObj[nutrientName]["value"]}</Text>)
                }
              })}
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
