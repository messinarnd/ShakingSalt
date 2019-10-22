import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ListItem } from 'react-native-elements';
const loggedItems = [                  // TODO: Populate this list with search as we go
  { name: "Cheese", subtitle: "250mg" }, 
  { name: "Ramen", subtitle: "700mg"  }, 
  { name: "Turkey", subtitle: "300mg" }] 

export default function MyLogsPage() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.container}
        contentContainerStyle={styles.contentContainer}>
        <View>
          {
            loggedItems.map((l, i) => (
              <ListItem
                key={i}
                title={l.name}
                rightSubtitle={l.subtitle}
                onPress={handleClick}
                bottomDivider
              />
            ))
          }
        </View>
      </ScrollView>
    </View>
  );
}

MyLogsPage.navigationOptions = {
  title: 'My Logs',
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
