import React, { Component } from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import './search.css';
import Grid from '@material-ui/core/Grid';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import FlatButton from 'material-ui/FlatButton';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import PropTypes from 'prop-types';
import Switch from '@material-ui/core/Switch';
import FilterChip from './filterChip';

const placeholders = [
  'Banan, Mjölk, Ägg, Glutenfri, Snabb',
  'Nyttig, Avokado, Smoothie',
  'Vad har du i kylen?',
  'Baka, Mjöl, Smör, Vitchoklad, Ägg, Snabb',
  'Sök bland ingredienser & preferenser',
  'Billigt, Nyttig, Vegetariskt, Sötpotatis',
  'Grill, Fläskfilé, Färskpotatis, Sås',
  'Glutenfri, Efterrätt, Choklad, Maräng, Glass, Jordgubbar',
  'LCHF, Frukost, Ägg, Bacon',
  'Asiatisk, Äggnudlar, Nötkött, Enkel',
];

function suggestInputFilter(searchText, key) {
  if (key.substring(0, 1).toLowerCase() === searchText.substring(0, 1).toLowerCase()) {
    return AutoComplete.caseInsensitiveFilter(searchText, key);
  }
  return false;
}

class Searchbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      placeholder: '',
    };
    this.handleUpdateInputText = this.handleUpdateInputText.bind(this);
    this.deleteIngredient = this.deleteIngredient.bind(this);
    this.deleteTag = this.deleteTag.bind(this);
    this.clearFilter = this.clearFilter.bind(this);
    this.toggleTagsIsMandatory = this.toggleTagsIsMandatory.bind(this);
  }

  componentDidMount() {
    const placeholder = placeholders[Math.floor(Math.random() * placeholders.length)];
    this.setState({ placeholder });
  }

  getAutoCompletteFoods() {
    const { foods, filter } = this.props;
    const foodNames = foods.map(a => a.name);
    return foodNames.filter(x => !filter.ingredients.includes(x));
  }

  getAutoCompletteTags() {
    const { tags, filter } = this.props;
    const tagNames = tags.map(a => a.name);
    return tagNames.filter(x => !filter.tags.includes(x));
  }

  handleNewRequest = (searchText) => {
    const searchTextCap = searchText.charAt(0).toUpperCase() + searchText.slice(1);
    const selectableFoods = this.getAutoCompletteFoods();
    const foundFood = selectableFoods.find(x => x === searchTextCap);
    if (foundFood) {
      this.addIngredient(foundFood);
    } else {
      const selectableTags = this.getAutoCompletteTags();
      const foundTag = selectableTags.find(x => x === searchTextCap);
      if (foundTag) {
        this.addTag(foundTag);
      }
    }
    // this.setState({
    //   searchText: '',
    // });
    // funkar deta med som ersättnign för REF? no-string-refs?
    this.Searchbar.focus();
  };

  toggleTagsIsMandatory() {
    const { filter, onFilterChange } = this.props;
    filter.tagsIsMandatory = !filter.tagsIsMandatory;
    onFilterChange(filter);
  }

  deleteIngredient(ingredientName) {
    const { filter, onFilterChange } = this.props;
    const index = filter.ingredients.indexOf(ingredientName);
    if (index !== -1) {
      const newFilter = filter;
      newFilter.ingredients.splice(index, 1);
      onFilterChange(newFilter);
    }
  }

  deleteTag(tagName) {
    const { filter, onFilterChange } = this.props;
    const index = filter.tags.indexOf(tagName);
    if (index !== -1) {
      const newFilter = filter;
      newFilter.tags.splice(index, 1);
      onFilterChange(newFilter);
    }
  }

  addIngredient(ingredientName) {
    const { filter, onFilterChange } = this.props;
    filter.ingredients.push(ingredientName);
    onFilterChange(filter);
    this.setState({
      searchText: '',
    });
  }

  addTag(tagName) {
    const { filter, onFilterChange } = this.props;
    filter.tags.push(tagName);
    onFilterChange(filter);
    this.setState({
      searchText: '',
    });
  }

  handleUpdateInputText(searchText) {
    this.setState({
      searchText,
    });
  }

  clearFilter() {
    const { filter, onFilterChange } = this.props;
    this.setState({
      searchText: '',
    });
    const newFilter = filter;
    newFilter.ingredients = [];
    newFilter.tags = [];
    newFilter.sort = 'Relevans';
    onFilterChange(newFilter);
  }


  render() {
    const { filter } = this.props;
    const { placeholder, searchText } = this.state;

    const foodChips = filter.ingredients.map(x => <FilterChip key={`${x}ingredient`} chipType="ingredient" text={x} onUserDelete={this.deleteIngredient} />);
    const tagChips = filter.tags.map(x => <FilterChip key={`${x}tag`} chipType="tag" text={x} onUserDelete={this.deleteTag} />);
    const chips = foodChips.concat(tagChips);
    const searchables = this.getAutoCompletteFoods().concat(this.getAutoCompletteTags());

    return (
      <Grid item container spacing={32} xs={12}>
        <Grid item xs={12} className="chip-wrapper">
          {chips}
        </Grid>
        <Grid item xs={12}>
          <AutoComplete
            id="searchrecipes"
            floatingLabelFocusStyle={{ color: '#303f9f' }}
            className="c-autocomplete"
            ref={(c) => { this.Searchbar = c; }}
            searchText={searchText}
            hintText={placeholder}
            filter={AutoComplete.caseInsensitiveFilter}
            onUpdateInput={this.handleUpdateInputText}
            dataSource={searchables}
            onNewRequest={this.handleNewRequest}
            maxSearchResults={6}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          {chips.length > 0
            && (
            <FlatButton
              label="Rensa sökning"
              style={{ color: 'rgba(255, 255, 255, 0.9)' }}
              className="filter-clear-btn"
              onClick={this.clearFilter}
              secondary={false}
              icon={<ClearIcon />}
            />
            )}
          <FormControlLabel
            className="searchbar-switch"
            control={(
              <Switch
                checked={filter.tagsIsMandatory}
                onChange={this.toggleTagsIsMandatory}
                value="tagsIsMandatory"
                color="primary"
              />)}
            label="Alla valda preferenser måste finns med i recepten"
          />
        </Grid>
      </Grid>
    );
  }
}
Searchbar.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  tags: PropTypes.array.isRequired,
  foods: PropTypes.array.isRequired,
  filter: PropTypes.object.isRequired,
};
export default Searchbar;
