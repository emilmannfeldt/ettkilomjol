import React, { Component } from 'react';
import './App.css'; //fixa en egen css för varje komponent?
import FilterIngredients from './FilterIngredients';

class FilterBar extends Component {

  // handleChange(filter) {
  //   this.props.onUserInput(filter);
  // }


  render() {

    return (
      <div className="col-md-12">
        <FilterIngredients onFilterChange={ this.props.onUserInput } foods={ this.props.foods } filter={ this.props.filter } />
      </div>
      );
  }

}

export default FilterBar;
