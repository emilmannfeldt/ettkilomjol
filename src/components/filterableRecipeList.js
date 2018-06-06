import React, { Component } from 'react';
import './filterableRecipeList.css';
import RecipeList from './recipe/recipeList/recipeList';
import Filterbar from './search/filterbar/filterbar';
import QuickTags from './search/quickTags/quickTags';

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
        <div className="row filterbar-wrapper">
          <Filterbar onUserInput={this.handleFilterInput} tags={this.props.tags} foods={this.props.foods} filter={this.state.filter} />
        </div>
        <div className="popular-tags">
        <QuickTags onUserInput={this.handleFilterInput} tags={this.props.tags} filter={this.state.filter} filterIsEmpty={!this.state.filter.tags.length && !this.state.filter.ingredients.length}/>
        </div>
        <div className="row recipelist-wrapper">
          <RecipeList recipes={this.props.recipes} filter={this.state.filter} maxHits={100} />
        </div>
        <div className="row helper">
        </div>
      </div>
    );
  }
}
export default FilterableRecipelist;
