import React, { Component } from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import FilterChip from './FilterChip';
import './App.css';


class FilterInput extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ingredients: this.props.filter.ingredients,
      tags: this.props.filter.tags,
      searchText: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleUpdateInputText = this.handleUpdateInputText.bind(this);
    this.deleteIngredient = this.deleteIngredient.bind(this);
    this.deleteTag = this.deleteTag.bind(this);

  }


  styles = {
    chipWrapper: {
      display: 'flex',
      flexWrap: 'wrap',
    },
  };
  handleChange() {
    let newFilter = this.props.filter;

    newFilter.ingredients = this.state.ingredients;
    newFilter.tags = this.state.tags;

    this.props.onFilterChange(newFilter);
  }
  deleteIngredient(ingredientName) {
    let index = this.state.ingredients.indexOf(ingredientName);
    if (index !== -1) {
      let newIngredients = this.state.ingredients;
      newIngredients.splice(index, 1);
      this.setState({
        ingredients: newIngredients,
      });
      this.handleChange();

    }

  }
  deleteTag(tagName) {
    let index = this.state.tags.indexOf(tagName);
    if (index !== -1) {
      let newTags = this.state.tags;
      newTags.splice(index, 1);
      this.setState({
        tags: newTags,
      });
      this.handleChange();

    }
    //ta bort ingrediensen från state och kör handelChange

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
      //visa snackbar att det inte finns en sådan ingrediens
      return;
    }
    let newIngredients = this.state.ingredients;
    newIngredients.push(ingredientName);
    this.setState({
      ingredients: newIngredients,
      searchText: '',
    });
    this.handleChange();
    //lägg till ingrediensen från state (setState )och kör handelChange
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
      //visa snackbar att det inte finns en sådan ingrediens
      return;
    }
    let newTags = this.state.tags;
    newTags.push(tagName);
    this.setState({
      tags: newTags,
      searchText: '',
    });
    this.handleChange();
    //lägg till ingrediensen från state (setState )och kör handelChange
  }

  getAutoCompletteFoods() {
    Array.prototype.diff = function(a) {
      return this.filter(function(i) {
        return a.indexOf(i) < 0;
      });
    };
    //filtrerar bort de som redan finns i filtret. 
    //problem: det blir dubbletter
    //rensade local storage så fungerade det igen. men buggen kan återkomma.
    //den uppstod när jag varit borta länge
    return this.props.foods.diff(this.props.filter.ingredients);

  }

  getAutoCompletteTags() {
    Array.prototype.diff = function(a) {
      return this.filter(function(i) {
        return a.indexOf(i) < 0;
      });
    };

    return this.props.tags.diff(this.props.filter.tags);

  }

  suggestInputFilter(searchText, key) {
    if (key.substring(0, 1).toLowerCase() == searchText.substring(0, 1).toLowerCase()) {
      return AutoComplete.caseInsensitiveFilter(searchText, key); //fnukar?
    }

    return false;
  }

  handleUpdateInputText(searchText) {
    this.setState({
      searchText: searchText,
    });
  };

  handleNewRequest = (searchText) => {
    let foundchip = false;
    searchText = searchText.charAt(0).toUpperCase() + searchText.slice(1);
    for (var i = this.props.foods.length - 1; i >= 0; i--) {
      if (this.props.foods[i] === searchText) {
        this.addIngredient(searchText);
        foundchip = true;
      }
    }
    if (!foundchip) {
      for (var i = this.props.tags.length - 1; i >= 0; i--) {
        if (this.props.tags[i] === searchText) {
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
      chips.push(<FilterChip key={ i } chipType={'ingredient'} text={ this.props.filter.ingredients[i] } onUserDelete={ this.deleteIngredient } />);
    }
    for (let i = 0; i < this.props.filter.tags.length; i++) {
      chips.push(<FilterChip key={ i } chipType={'tag'} text={ this.props.filter.tags[i] } onUserDelete={ this.deleteTag} />);
    }

    let searchables = this.getAutoCompletteFoods().concat(this.getAutoCompletteTags());


    return (
      <div>
        <div className="chip-wrapper">
        { chips }
        </div>
        <AutoComplete ref="filterSearchbar" searchText={ this.state.searchText } floatingLabelText="sök ingredienser" filter={ this.suggestInputFilter} onUpdateInput={ this.handleUpdateInputText } dataSource={ searchables }
          onNewRequest={ this.handleNewRequest } maxSearchResults={ 5 } fullWidth={ true } />
      </div>

    );
  }

}

export default FilterInput;
