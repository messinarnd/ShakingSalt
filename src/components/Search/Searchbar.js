import React, {Component} from 'react';
import { TextInput } from 'react-native';


export default Searchbar = (props) => {

  searchInSearchPage = (searchEvent) => {
    props.searchItem(searchEvent["nativeEvent"]["text"]);
  }

  return (
    <TextInput
      placeholder="Type Here..."
      // onChangeText={this.updateSearch} - this can be used if we implement an in place search list
      // same screen/in place search list can be done if we can get all food data to a firebase database and clean it
      onSubmitEditing={this.searchInSearchPage}
      returnKeyType="search"
    />
  )
}