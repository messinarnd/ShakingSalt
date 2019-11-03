import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';
import { Container, Tab, Tabs, StyleProvider } from 'native-base';
import AlternativesPage from './AlternativesPage';
import FoodDetailsPage from './FoodDetailsPage';


export default FoodDetailsTabsPage = (props) => {
  // Probably need to add redux for state so we know what the search term was for alternatives
  // Or maybe if they search 'cheese' but click on 'cheddar cheese' then the alternatives should search for cheddar

  // Allows you to get the stack navigator
  const { navigation } = props;
  const { params } = navigation.state;
  const foodDetails = params.foodDetails;

  // console.log("afsdh: ", foodDetails);
  return (
    <Container>
        <Tabs>
            <Tab heading="Details">
                <FoodDetailsPage foodDetails={foodDetails}/>
            </Tab>
            <Tab heading="Alternatives">
                <AlternativesPage navigation={navigation} foodDetails={foodDetails}/>
            </Tab>
        </Tabs>
    </Container>
  );
}

FoodDetailsTabsPage.navigationOptions = {
  title: 'Food Details',
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
