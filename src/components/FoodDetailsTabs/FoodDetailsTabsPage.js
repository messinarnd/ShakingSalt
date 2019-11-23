import React from 'react';
import { Container, Tab, Tabs } from 'native-base';
import AlternativesPage from './AlternativesPage';
import FoodDetailsPage from './FoodDetailsPage';


export default FoodDetailsTabsPage = (props) => {
  // Probably need to add redux for state so we know what the search term was for alternatives
  // Or maybe if they search 'cheese' but click on 'cheddar cheese' then the alternatives should search for cheddar

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