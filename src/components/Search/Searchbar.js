import React, {Component} from 'react';
import { TextInput } from 'react-native';
import { SearchBar } from 'react-native-elements';

export default class Searchbar extends React.Component {

  state = {
    search: '',
  };

  searchInSearchPage = (searchEvent) => {
    this.props.searchItem(searchEvent["nativeEvent"]["text"]);
  }

  updateSearch = search => {
    this.setState({ search });
  }

  render() {
    const { search } = this.state;

    return (
      <SearchBar
        placeholder="Type Here..."
        containerStyle="TextInput"
        onChangeText={this.updateSearch}
        onSubmitEditing={this.searchInSearchPage}
        value={search}
      />
    );
  }
}