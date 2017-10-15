import React, { Component } from 'react';
import './App.css'; //fixa en egen css för varje komponent?
import FilterInput from './FilterInput';

class FilterBar extends Component {

  // handleChange(filter) {
  //   this.props.onUserInput(filter);
  // }


  render() {

    return (
      <div className="col-md-12">
        <FilterInput onFilterChange={ this.props.onUserInput } tags={this.props.tags} foods={ this.props.foods } filter={ this.props.filter } />
      </div>
    );
  }

}

export default FilterBar;
