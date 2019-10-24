import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';

// import { searchResultsEndpoint, axiosConfig } from "../../services/USDAFoodService";
import { ButtonGroup } from 'react-native-elements';
// const axios = require("axios");


export default Alternatives = (props) => {
  // Probably need to add redux for state so we know what the search term was for alternatives
  // Or maybe if they search 'cheese' but click on 'cheddar cheese' then the alternatives should search for cheddar

  // Allows you to get the stack navigator
  const { navigation } = props;

  const [tabIndex, setTabIndex] = useState(0)

  const tab1 = () => <Text>Details</Text>
  const tab2 = () => <Text>Alternatives</Text>

  const buttons = [{ element: tab1 }, { element: tab2 }]

  return (
    <View style={styles.container}>

      {/* <Button
        key={foodDetailsTab}
        title={`Details`} />

      <Button
        key={alternativesTab}
        title={`Alternatives`}
        onPress={() => navigation.navigate('alternatives', {
            foodItems: response["data"]["foods"]
          })}/>

      <Button 
        key={foodItem.fdcId}
        title={`${foodItem.brandOwner} - full name?`}
        onPress={() => getFoodDetails(foodItem.fdcId)} /> */}

      <ScrollView style={styles.container}
      contentContainerStyle={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
              <Text>Hello, Alternatives!</Text>
          </View>
      </ScrollView>
    </View>
  );
}

Alternatives.navigationOptions = {
  title: 'Alternatives',
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
