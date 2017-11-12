import React, { Component } from 'react';
import './filterableRecipeList.css';
import RecipeList from './recipe/recipeList/recipeList';
import Filterbar from './search/filterbar/filterbar';

class FilterableRecipelist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: {
        ingredients: [],
        tags: [],
        sort: 'Relevans'
      }
    };
    this.handleFilterInput = this.handleFilterInput.bind(this);
  }

  handleFilterInput(changedFilter) {
    this.setState({
      filter: changedFilter
    });
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-xs-12">
            <h1></h1>
          </div>
        </div>
        <div className="row">
          <Filterbar onUserInput={this.handleFilterInput} tags={this.props.tags} foods={this.props.foods} filter={this.state.filter} />
        </div>
        <div className="row">
          <RecipeList recipes={this.props.recipes} filter={this.state.filter} maxHits={240} />
        </div>
      </div>
    );
  }
}
export default FilterableRecipelist;
