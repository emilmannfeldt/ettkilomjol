import React, { Component } from 'react';
import './filterbar.css';
import FilterInput from '../filterInput/filterInput';

class Filterbar extends Component {

  render() {

    return (
      <div className="col-md-12">
        <FilterInput onFilterChange={this.props.onUserInput} tags={this.props.tags} foods={this.props.foods} filter={this.props.filter} />
      </div>
    );
  }
}
export default Filterbar;
