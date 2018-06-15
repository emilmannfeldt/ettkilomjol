import React, { Component } from 'react';
import './filterableRecipeList.css';
import RecipeList from './recipe/recipeList/recipeList';
import Filterbar from './search/filterbar/filterbar';
import QuickTags from './search/quickTags/quickTags';
import Sort from './search/sort/sort';

class FilterableRecipelist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: {
        ingredients: [],
        tags: [],
        sort: 'Relevans'
      },
      recipeHits: []
    };
    this.handleFilterInput = this.handleFilterInput.bind(this);
    this.updateRecipeHits = this.updateRecipeHits.bind(this);

  }

  handleFilterInput(changedFilter) {
    this.setState({
      filter: changedFilter
    });
  }
  
  updateRecipeHits(recipes) {
    this.setState({
      recipeHits: recipes
    });
  }

  render() {
    return (
      <div className="container">
        <div className="row filterbar-wrapper">
          <Filterbar onUserInput={this.handleFilterInput} tags={this.props.tags} foods={this.props.foods} filter={this.state.filter} />
        </div>
        <div className="popular-tags">
        <QuickTags onUserInput={this.handleFilterInput} tags={this.props.tags} filter={this.state.filter} filterIsEmpty={!this.state.filter.tags.length && !this.state.filter.ingredients.length}/>
        </div>
        <div>
          <Sort onUserInput={this.handleFilterInput} filter={this.state.filter}/>
        </div>
        <div className="row recipelist-wrapper">
          <RecipeList onRecipelistChange={this.updateRecipeHits} recipes={this.props.recipes} filter={this.state.filter} maxHits={100} />
        </div>
        <div className="row helper">
        </div>
      </div>
    );
  }
}
export default FilterableRecipelist;
