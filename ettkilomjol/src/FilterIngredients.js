import React, { Component } from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import IngredientChip from './IngredientChip';


class FilterIngredients extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ingredients: this.props.filter.ingredients,
      searchText: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleUpdateInputText = this.handleUpdateInputText.bind(this);
    this.deleteIngredient = this.deleteIngredient.bind(this);
  }



  handleChange() {
    let newFilter = this.props.filter;

    newFilter.ingredients = this.state.ingredients;
    this.props.onFilterChange(newFilter);
  }
  deleteIngredient(ingredientName) {
    console.log("enter delete" + ingredientName);
    console.log(this.state.ingredients);
    let index = this.state.ingredients.indexOf(ingredientName);
    if (index !== -1) {
      console.log("delete " + ingredientName + index);
      let newIngredients = this.state.ingredients;
      newIngredients.splice(index,1);
      this.setState({
        ingredients: newIngredients,
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
    console.log("Add " + ingredientName);
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

    return this.props.foods.diff(this.props.filter.ingredients);

  }



  handleUpdateInputText(searchText) {
    this.setState({
      searchText: searchText,
    });
  };

  handleNewRequest = (searchText) => {
    let foundFood = false;
    for (var i = this.props.foods.length - 1; i >= 0; i--) {
      if (this.props.foods[i] === searchText) {
        foundFood = true;
      }
    }
    if (!foundFood) {
      //det fanns ingen matchande ingrediens
      //visa snackbar att det inte finns en sådan ingrediens?
    } else {
      this.addIngredient(searchText);
    }
    this.setState({
      searchText: ''
    });
  };

  render() {
    let chips = [];
    for (let i = 0; i < this.props.filter.ingredients.length; i++) {
      chips.push(<IngredientChip key={ i } text={ this.props.filter.ingredients[i] } onUserDelete={ this.deleteIngredient } />);
    }

    let dataSourceFoods = this.getAutoCompletteFoods();


    return (
      <div>
        { chips }
        <AutoComplete searchText={ this.state.searchText } floatingLabelText="sök ingredienser" filter={ AutoComplete.caseInsensitiveFilter } onUpdateInput={ this.handleUpdateInputText } dataSource={ dataSourceFoods }
          onNewRequest={ this.handleNewRequest } maxSearchResults={ 5 } fullWidth={ true } />
      </div>

      );
  }

}

export default FilterIngredients;
