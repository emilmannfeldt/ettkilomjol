import React, { Component } from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import FilterChip from './filterChip';
import './search.css';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import FlatButton from 'material-ui/FlatButton';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

class Searchbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ingredients: this.props.filter.ingredients,
      tags: this.props.filter.tags,
      sort: this.props.filter.sort,
      searchText: '',
      placeholder: '',
    };
    this.handleUpdateInputText = this.handleUpdateInputText.bind(this);
    this.deleteIngredient = this.deleteIngredient.bind(this);
    this.deleteTag = this.deleteTag.bind(this);
    this.clearFilter = this.clearFilter.bind(this);
    this.toggleTagsIsMandatory = this.toggleTagsIsMandatory.bind(this);
    Array.prototype.diff = function (a) {
      return this.filter(function (i) {
        return a.indexOf(i) < 0;
      });
    };
  }
  componentDidMount() {
    let rnd = Math.floor(Math.random() * 10);
    let placeholder = "";
    switch (rnd) {
      case 0:
        placeholder = "Banan, Mjölk, Ägg, Glutenfri, Snabb"
        break;
      case 1:
        placeholder = "Nyttig, Avokado, Smoothie"
        break;
      case 2:
        placeholder = "Vad har du i kylen?"
        break;
      case 3:
        placeholder = "Baka, Mjöl, Smör, Vitchoklad, Ägg, Snabb"
        break;
      case 4:
        placeholder = "Sök bland ingredienser & preferenser"
        break;
      case 5:
        placeholder = "Billigt, Nyttig, Vegetariskt, Sötpotatis"
        break;
      case 6:
        placeholder = "Grill, Fläskfilé, Färskpotatis, Sås"
        break;
      case 7:
        placeholder = "Glutenfri, Efterrätt, Choklad, Maräng, Glass, Jordgubbar"
        break;
      case 8:
        placeholder = "LCHF, Frukost, Ägg, Bacon"
        break;
      case 9:
        placeholder = "Asiatisk, Äggnudlar, Nötkött, Enkel"
        break;
      default:
        break;
    }
    this.setState({ placeholder });

  }
  toggleTagsIsMandatory() {
    let filter = this.props.filter;
    filter.tagsIsMandatory = !filter.tagsIsMandatory;
    this.props.onFilterChange(filter);

  }
  deleteIngredient(ingredientName) {
    let index = this.state.ingredients.indexOf(ingredientName);
    if (index !== -1) {
      let newFilter = this.props.filter;
      newFilter.ingredients.splice(index, 1);
      this.props.onFilterChange(newFilter);
    }
  }

  deleteTag(tagName) {
    let index = this.props.filter.tags.indexOf(tagName);
    if (index !== -1) {
      let newFilter = this.props.filter;
      newFilter.tags.splice(index, 1);
      this.props.onFilterChange(newFilter);
    }
  }

  addIngredient(ingredientName) {
    let foundFood = false;
    let availibleFoods = this.getAutoCompletteFoods();
    for (var i = availibleFoods.length - 1; i >= 0; i--) {
      if (availibleFoods[i] === ingredientName) {
        foundFood = true;
      }
    }
    if (!foundFood) {
      this.setState({
        searchText: '',
      });
      return;
    }
    let newFilter = this.props.filter;
    newFilter.ingredients.push(ingredientName);
    this.props.onFilterChange(newFilter);
    this.setState({
      searchText: '',
    });
  }

  addTag(tagName) {
    let foundTag = false;
    let availibleTags = this.getAutoCompletteTags();
    for (var i = availibleTags.length - 1; i >= 0; i--) {
      if (availibleTags[i] === tagName) {
        foundTag = true;
      }
    }
    if (!foundTag) {
      this.setState({
        searchText: '',
      });
      return;
    }
    let newFilter = this.props.filter;
    newFilter.tags.push(tagName);
    this.props.onFilterChange(newFilter);
    this.setState({
      searchText: '',
    });
  }

  getAutoCompletteFoods() {
    let foodNames = this.props.foods.map(a => a.name);
    return foodNames.diff(this.props.filter.ingredients);
  }

  getAutoCompletteTags() {

    let tagNames = this.props.tags.map(a => a.name);
    return tagNames.diff(this.props.filter.tags);
  }

  suggestInputFilter(searchText, key) {
    if (key.substring(0, 1).toLowerCase() === searchText.substring(0, 1).toLowerCase()) {
      return AutoComplete.caseInsensitiveFilter(searchText, key); //fnukar?
    }
    return false;
  }

  handleUpdateInputText(searchText) {
    this.setState({
      searchText: searchText,
    });
  };

  clearFilter() {
    this.setState({
      ingredients: [],
      tags: [],
      sort: 'Relevans',
      searchText: ''
    });
    let newFilter = this.props.filter;
    newFilter.ingredients = [];
    newFilter.tags = [];
    newFilter.sort = 'Relevans';

    this.props.onFilterChange(newFilter);
  }

  handleNewRequest = (searchText) => {
    let foundchip = false;
    searchText = searchText.charAt(0).toUpperCase() + searchText.slice(1);
    for (let i = this.props.foods.length - 1; i >= 0; i--) {
      if (this.props.foods[i].name === searchText) {
        this.addIngredient(searchText);
        foundchip = true;
      }
    }
    if (!foundchip) {
      for (let i = this.props.tags.length - 1; i >= 0; i--) {
        if (this.props.tags[i].name === searchText) {
          this.addTag(searchText);
          foundchip = true;
        }
      }
    }
    this.setState({
      searchText: ''
    });
    this.refs.filterSearchbar.focus();
  };

  render() {

    let chips = [];
    for (let i = 0; i < this.props.filter.ingredients.length; i++) {
      chips.push(<FilterChip key={chips.length} chipType={'ingredient'} text={this.props.filter.ingredients[i]} onUserDelete={this.deleteIngredient} />);
    }
    for (let i = 0; i < this.props.filter.tags.length; i++) {
      chips.push(<FilterChip key={chips.length} chipType={'tag'} text={this.props.filter.tags[i]} onUserDelete={this.deleteTag} />);
    }
    let searchables = this.getAutoCompletteFoods().concat(this.getAutoCompletteTags());

    return (
      <div className="col-md-12">
        <div className="chip-wrapper">
          {chips}
        </div>
        <AutoComplete id="searchrecipes" floatingLabelFocusStyle={{ color: '#303f9f' }} className="c-autocomplete" ref="filterSearchbar" searchText={this.state.searchText} hintText={this.state.placeholder} filter={AutoComplete.caseInsensitiveFilter} onUpdateInput={this.handleUpdateInputText} dataSource={searchables}
          onNewRequest={this.handleNewRequest} maxSearchResults={6} fullWidth={true} />
        {chips.length > 0 ?
          <FlatButton label="Rensa sökning"
            style={{ color: 'rgba(255, 255, 255, 0.9)' }}
            className="filter-clear-btn"
            onClick={this.clearFilter}
            secondary={false}
            icon={<ClearIcon />}
          />
          : ''}
        <FormControlLabel className="searchbar-switch"
          control={
            <Switch
              checked={this.props.filter.tagsIsMandatory}
              onChange={this.toggleTagsIsMandatory}
              value="tagsIsMandatory"
              color="primary"
            />
          }
          label="Alla valda preferenser måste finns med i recepten"
        />
      </div>
    );
  }
}
export default Searchbar;