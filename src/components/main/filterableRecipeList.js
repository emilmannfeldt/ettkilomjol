import React, { Component } from 'react';
import Recipe from '../recipe/recipe';
import Searchbar from '../search/searchbar';
import QuickTags from '../search/quickTags';
import Sort from '../search/sort';

class FilterableRecipelist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: {
        ingredients: [],
        tags: [],
        sort: 'Relevans'
      },
      foundRecipes: [],
      maxHits: 100,
    };
    this.handleFilterInput = this.handleFilterInput.bind(this);
    this.findRecipes = this.findRecipes.bind(this);
  }
  filterIsEmpty(filter) {
    if (filter.ingredients.length > 0) {
      return false;
    }
    if (filter.tags.length > 0) {
      return false;
    }
    return true;
  }

  runIngredientFilter(recipeIngredients, filterIngredients) {
    let ingredientHits = 0;
    for (let i = 0; i < recipeIngredients.length; i++) {
      let ing = recipeIngredients[i].name;
      if (filterIngredients.indexOf(ing) > -1) {
        ingredientHits++;
      }
    }
    return ingredientHits;
  }
  runTagFilter(recipeTags, filterTags) {
    let tagHits = 0;
    for (let tag in recipeTags) {
      if (recipeTags.hasOwnProperty(tag)) {
        if (filterTags.indexOf(tag) > -1) {
          tagHits++;
        }
      }
    }
    return tagHits;
  }

  runFilter(recipe, filter) {
    if (this.filterIsEmpty(filter)) {
      return false;
    }

    let tagHits = 0;
    let ingredientHits = 0;
    if (filter.tags.length > 0) {
      tagHits = this.runTagFilter(recipe.tags, filter.tags);
      if (tagHits === 0) {
        return false;
      }
    }
    if (filter.ingredients.length > 0) {
      ingredientHits = this.runIngredientFilter(recipe.ingredients, filter.ingredients);
      if (ingredientHits === 0) {
        return false;
      }
    }
    if (ingredientHits === 0) {
      return this.simpleFilter(filter.tags.length, recipe.tags.length, tagHits);
    }
    if (tagHits === 0) {
      return this.simpleFilter(filter.ingredients.length, recipe.ingredients.length, ingredientHits);
    }
    //om det finns både tags och ingredients i filtret
    return this.simpleFilter(filter.ingredients.length + filter.tags.length, recipe.ingredients.length + Object.keys(recipe.tags).length, ingredientHits + tagHits);

  }
  simpleFilter(filterLength, recipeLength, hits) {
    let keeper = false;
    if (filterLength > 10) {
      keeper = hits / filterLength > 0.24;
    } else if (filterLength > 6) {
      keeper = hits / filterLength > 0.3;
    } else if (filterLength > 3) {
      keeper = hits / filterLength > 0.38;
    } else {
      keeper = hits > 0;
    }
    if (!keeper) {
      if (recipeLength > 20) {
        keeper = hits / recipeLength > 0.8;
      } else if (recipeLength > 10) {
        keeper = hits / recipeLength > 0.7;
      } else {
        keeper = hits / recipeLength > 0.6;
      }
    }
    return keeper;
  }
  sortOnRelevans(a, b) {
    let filterTags = this.state.filter.tags;
    let filterIngredients = this.state.filter.ingredients;

    let tagsHitsA = 0;
    let tagsHitsB = 0;
    for (let tag in a.tags) {
      if (a.tags.hasOwnProperty(tag)) {
        if (filterTags.indexOf(tag) > -1) {
          tagsHitsA++;
        }
      }
    }
    for (let tag in b.tags) {
      if (b.tags.hasOwnProperty(tag)) {
        if (filterTags.indexOf(tag) > -1) {
          tagsHitsB++;
        }
      }
    }
    if (filterIngredients.length === 0) {
      return tagsHitsB - tagsHitsA;
    }
    //return -1 om a är bättre
    //return 1 om b är bättre
    //return 0 om de är lika
    let ingredientHitsA = 0;
    let ingredientHitsB = 0;
    //här måste vi ändra så att dubbletter av ingredient namn inte räjnas dubbel träff
    for (let i = 0; i < a.ingredients.length; i++) {
      if (filterIngredients.indexOf(a.ingredients[i].name) > -1) {
        ingredientHitsA++;
      }
    }
    for (let i = 0; i < b.ingredients.length; i++) {
      if (filterIngredients.indexOf(b.ingredients[i].name) > -1) {
        ingredientHitsB++;
      }
    }

    let aIngredients = a.ingredients.length;
    let bIngredients = b.ingredients.length;
    let hitsA = ingredientHitsA + (tagsHitsA * 0.6);
    let hitsB = ingredientHitsB + (tagsHitsB * 0.6);
    //om båda är full match: Välj den som har flest antal ingredienser
    if (hitsA === hitsB) {
      return aIngredients - bIngredients;
    }
    return hitsB - hitsA;
  }
  sortOnBetyg(a, b) {
    if (a.rating === b.rating) {
      return b.votes - a.votes;
    }
    return b.rating - a.rating;
  }
  sortOnPopularitet(a, b) {
    if (!a.visits && !b.visits) {
      this.sortOnVotes(a, b);
    }
    if (!a.visits) {
      return 1;
    }
    if (!b.visits) {
      return -1;
    }
    if (a.visits === b.visits) {
      this.sortOnVotes(a, b);
    }
    return b.visits - a.visits;
  }
  sortOnVotes(a, b) {
    if (b.votes === a.votes) {
      return b.rating - a.rating;
    }
    return b.votes - a.votes;
  }

  sortOnTid(a, b) {
    if (!b.time && !a.time) {
      return 0;
    }
    if (!b.time) {
      return -1;
    }
    if (!a.time) {
      return 1;
    }
    if (a.time === b.time) {
      return a.level - b.level;
    }
    return a.time - b.time;
  }

  sortOnAntalIngredienserAsc(a, b) {
    if (a.ingredients.length === b.ingredients.length) {
      return this.sortOnBetyg(a, b);
    }
    return a.ingredients.length - b.ingredients.length;
  }

  sortRecipes(a, b) {

    if (this.state.filter.sort === 'Relevans') {
      return this.sortOnRelevans(a, b);
    } else if (this.state.filter.sort === 'Betyg') {
      return this.sortOnBetyg(a, b);
    } else if (this.state.filter.sort === 'Popularitet') {
      return this.sortOnPopularitet(a, b);
    } else if (this.state.filter.sort === 'Snabbast') {
      return this.sortOnTid(a, b);
    } else if (this.state.filter.sort === 'Ingredienser') {
      return this.sortOnAntalIngredienserAsc(a, b);
    }
  }
  handleFilterInput(changedFilter) {
    this.setState({
      filter: changedFilter
    });
    this.findRecipes();
  }

  findRecipes() {
    let recipes = [];
    for (let i = 0; i < this.props.recipes.length; i++) {
      if (this.runFilter(this.props.recipes[i], this.state.filter)) {
        recipes.push(this.props.recipes[i]);
      }
    }
    let that = this;
    //sortera recept
    recipes.sort(function (a, b) {
      return that.sortRecipes(a, b);
    });
    console.log(recipes.length + " foundrecipes");
    if (recipes.length > this.state.maxHits) {
      recipes.length = this.state.maxHits;
    }
    this.setState({
      foundRecipes: recipes
    });
  }

  render() {
    return (
      <div className="container">
        <div className="row searchbar-wrapper">
          <Searchbar onFilterChange={this.handleFilterInput} tags={this.props.tags} foods={this.props.foods} filter={this.state.filter} />
        </div>
        <div className="popular-tags">
          <QuickTags onUserInput={this.handleFilterInput} tags={this.props.tags} filter={this.state.filter} recipeListRendered={this.state.foundRecipes.length > 0} />
        </div>
        <div>
          <Sort onUserInput={this.handleFilterInput} render={this.state.foundRecipes.length > 0} filter={this.state.filter} />
        </div>
        <div className="row recipelist-wrapper">
          <div className="col-md-12 app-stats">{this.props.recipes.length > 0 ? this.props.recipes.length + ' recept hämtade' : ''}</div>
          {this.state.foundRecipes.map((recipe, index) =>
            <Recipe key={index} filter={this.state.filter} ref="child"
              recipe={recipe} transitionDelay={index} isFav={this.props.favs.indexOf(recipe.source) > -1} setSnackbar={this.props.setSnackbar} />
          )}
        </div>
        <div className="row helper">
        </div>
      </div>
    );
  }
}
export default FilterableRecipelist;
