import React, { Component } from 'react';
import './App.css'; //fixa en egen css för varje komponent?
import FilterIngredients from './FilterIngredients';

class FilterBar extends Component {
  constructor(props) {
    super(props);
  // this.handleChange = this.handleChange.bind(this); skicka med denna metod istället för pops.onuserinput?
  }
  // handleChange(filter) {
  //   this.props.onUserInput(filter);
  // }


  render() {

    return (
      <div>
        <FilterIngredients onFilterChange={ this.props.onUserInput } foods={ this.props.foods } filter={ this.props.filter } />
      </div>
      );
  }

}

export default FilterBar;
