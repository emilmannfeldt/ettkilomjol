import React, { Component } from 'react';
import './filterableRecipeList.css';
import RecipeList from './recipe/recipeList/recipeList';
import FilterBar from './search/filterBar/filterBar';

class FilterableRecipeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: {
        ingredients: [],
        tags: [],
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
          <FilterBar onUserInput={this.handleFilterInput} tags={this.props.tags} foods={this.props.foods} filter={this.state.filter} />
          <div className="col-md-12 app-stats">{this.props.recipeCards.length} recept i databasen</div>
        </div>
        <div className="row">
          <RecipeList recipeCards={this.props.recipeCards} filter={this.state.filter} maxHits={240} />
        </div>
      </div>
    );
  }
}
export default FilterableRecipeList;