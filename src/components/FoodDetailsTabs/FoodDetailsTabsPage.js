import React from 'react';
import { Container, Tab, Tabs } from 'native-base';
import AlternativesPage from './AlternativesPage';
import FoodDetailsPage from './FoodDetailsPage';


export default FoodDetailsTabsPage = (props) => {
  // Get foodDetails from navigation parameters
  const { navigation } = props;
  const { params } = navigation.state;
  const foodDetails = params.foodDetails;
  const sodiumLevel = params.sodiumContent;

  return (
    <Container>
        <Tabs>
            <Tab heading="Details">
                <FoodDetailsPage foodDetails={foodDetails} sodiumLevel={sodiumLevel}/>
            </Tab>
            <Tab heading="Alternatives">
                <AlternativesPage navigation={navigation} foodDetails={foodDetails} sodiumLevel={sodiumLevel}/>
            </Tab>
        </Tabs>
    </Container>
  );
}

FoodDetailsTabsPage.navigationOptions = {
  title: 'Food Details',
};

// Food Details Tabs TODOs: