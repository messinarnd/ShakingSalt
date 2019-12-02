import React, { useState} from 'react';
import { SearchBar } from 'react-native-elements';

export default Searchbar = (props) => {
	const [searchText, setSearchText] = useState('');

	searchInSearchPage = (searchEvent) => {
		props.searchItem(searchEvent["nativeEvent"]["text"]);
	}

	updateSearch = (search) => {
		setSearchText(search);
	}

	return (
		<SearchBar
		  placeholder="Search for a Food Item..."
		  containerStyle="TextInput"
		  onChangeText={this.updateSearch}
		  onSubmitEditing={this.searchInSearchPage}
		  value={searchText}
		/>
	);
}

// Searchbar TODOs:
// TODO: Make styling of Searchbar match the rest of the application