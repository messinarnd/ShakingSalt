import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Button,
  TextInput,
  Picker,
  Text
} from 'react-native';
import { Card, ListItem, Overlay } from 'react-native-elements';
import { storeFoodLog } from '../../services/LocalStorageService';
import { gray, grey } from 'ansi-colors';

// disables the warnings
// TODO: fix this later!!
console.disableYellowBox = true;


export default FoodDetailsPage = (props) => {
  const { foodDetails, sodiumLevel } = props;
  Object.freeze(foodDetails);
  
  const ogNutrientsObj = foodDetails.foodNutrients.reduce((obj, thisNutrient) => {
    nutrientName = thisNutrient.nutrient.name;
    nutrientAmount = thisNutrient.amount;
    nutrientUnit = thisNutrient.nutrient.unitName;
    tempObj = {
      "amount": nutrientAmount,
      "unit": nutrientUnit
    }
    obj[nutrientName] = tempObj;
    return obj;
  }, {});

  const [nutrientsObj, setNutrientsObj] = useState(ogNutrientsObj);
  const [servingSize, setServingSize] = useState("g")
  const [servingAmount, setServingAmount] = useState(0)

  useEffect(() => {
    // The nutrients from USDA are base on 100g of a food
    let factor = 0;
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
    let nutrientsObjCopy = {...ogNutrientsObj};
    let newNutrientObj = Object.keys(nutrientsObjCopy).reduce((obj, nutrientName) => {
      let updatedAmount = nutrientsObjCopy[nutrientName]["amount"] * factor;
      let updatedUnit = nutrientsObjCopy[nutrientName]["unit"];
      temp = {
        "amount": updatedAmount,
        "unit": updatedUnit
      }
      obj[nutrientName] = temp;
      return obj;
    }, {});
    setNutrientsObj(newNutrientObj);
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container}
        contentContainerStyle={styles.contentContainer}>
        <View>
          <Card title={foodDetails.description + " - " + foodDetails.brandOwner}>
            <View>
              <View style={{flex:1, alignContent:"center", justifyContent:"center", alignItems:"center", borderWidth:0, margin:0, padding:0}}>
                <Text style={{fontSize:18, borderWidth:0, margin:0, padding:0}}>How much did you eat?</Text>
                <View style={{flex:1, flexDirection:'row', borderWidth:0, margin:0, padding:0}}>
                  <TextInput
                    style={{flex:2, fontSize:20}}
                    placeholder="Type Amount Here.."
                    keyboardType="numeric"
                    onChangeText={(text) => { setServingAmount(text ? text : 0); }}
                  />
                  <Picker
                    selectedValue={servingSize}
                    style={{flex:2}}
                    onValueChange={(itemValue, itemIndex) => { setServingSize(itemValue) }}
                  >
                    <Picker.Item label="g" value="g" />
                    <Picker.Item label="oz" value="oz" />
                    <Picker.Item label="lbs" value="lbs" />
                    <Picker.Item label="mg" value="mg" />
                  </Picker>
                </View>
              </View>
              
            
              {/* <View style={{ flex: 0, flexDirection: 'row' }}>
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
                    style={{ flex : 1}}
                    onValueChange={(itemValue, itemIndex) => { setServingSize(itemValue) }}
                  >
                    <Picker.Item label="g" value="g" />
                    <Picker.Item label="oz" value="oz" />
                    <Picker.Item label="lbs" value="lbs" />
                    <Picker.Item label="mg" value="mg" />
                  </Picker>
                </View>
              </View> */}
              {/* TODO: Fix the high/low regulations for sodium and calories - everything is base on "per seving" which we don't have */}
              <ListItem key={2} title={"Calories: "} rightSubtitleStyle={{ color:(nutrientsObj["Energy"]["amount"] > (2000*0.2) ? "red" : (nutrientsObj["Energy"]["amount"] < (2000*0.05) ? 'green' : 'orange'))}} rightSubtitle={(nutrientsObj["Energy"]["amount"]).toString()} bottomDivider />
              <ListItem key={3} title={"Sodium: "} rightSubtitleStyle={{ color:(nutrientsObj["Sodium, Na"]["amount"] > (2300*0.2) ? "red" : (nutrientsObj["Sodium, Na"]["amount"] < (2300*0.05) ? 'green' : 'orange'))}} rightSubtitle={(nutrientsObj["Sodium, Na"]["amount"]).toString()} bottomDivider />
              <ListItem key={4} title={"Other Nutrients: "} bottomDivider />
              {Object.keys(nutrientsObj).map((nutrientName, index) => {
                if (nutrientName != "Energy" || nutrientName != "Sodium, Na") {
                  return (<ListItem key={index} titleStyle={{ color: 'grey', fontSize: 14 }} rightSubtitleStyle={{ color: 'grey', fontSize: 14 }} title={nutrientName} rightSubtitle={(nutrientsObj[nutrientName]["amount"]).toFixed(2) + nutrientsObj[nutrientName]["unit"]} />)
                }
              })}
              <View style={{ flex: 1, flexDirection: 'row-reverse', padding: 10 }}>
                <Button title="Log" onPress={() => storeFoodLog(foodDetails, servingSize, servingAmount, nutrientsObj)} />
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


// FoodDetailsPage TODOs:
// TODO: fix what nutrients show up (pepper steak has things like 20:1, Folate,DFE(waat.), etc.)