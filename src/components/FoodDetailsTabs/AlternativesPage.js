import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';

// import { searchResultsEndpoint, axiosConfig } from "../../services/USDAFoodService";
// const axios = require("axios");


export default Alternatives = (props) => {
  // Probably need to add redux for state so we know what the search term was for alternatives
  // Or maybe if they search 'cheese' but click on 'cheddar cheese' then the alternatives should search for cheddar

  return (
    <View style={styles.container}>
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
