import React from 'react';
import { Container, Tab, Tabs } from 'native-base';
import AlternativesPage from './AlternativesPage';
import FoodDetailsPage from './FoodDetailsPage';


export default FoodDetailsTabsPage = (props) => {
  // Get foodDetails from navigation parameters
  const { navigation } = props;
  const { params } = navigation.state;
  const foodDetails = params.foodDetails;

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