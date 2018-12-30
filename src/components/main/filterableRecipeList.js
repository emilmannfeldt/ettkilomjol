import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import Recipe from '../recipe/recipe';
import Searchbar from '../search/searchbar';
import QuickTags from '../search/quickTags';
import Sort from '../search/sort';
import RFUtil from '../../recipeFilterUtil';

class FilterableRecipelist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: {
        ingredients: [],
        tags: [],
        sort: 'Relevans',
        tagsIsMandatory: false,
      },
      foundRecipes: [],
      maxHits: 128,
    };
    this.handleFilterInput = this.handleFilterInput.bind(this);
    this.findRecipes = this.findRecipes.bind(this);
  }


  sortRecipes(recipes) {
    const { filter } = this.state;
    switch (filter.sort) {
      case 'Relevans':
        return recipes.sort((a, b) => RFUtil.sortOnRelevans(a, b, filter.tags, filter.ingredients));
      case 'Betyg':
        return recipes.sort((a, b) => RFUtil.sortOnBetyg(a, b));
      case 'Popularitet':
        return recipes.sort((a, b) => RFUtil.sortOnPopularitet(a, b));
      case 'Snabbast':
        return recipes.sort((a, b) => RFUtil.sortOnTid(a, b));
      case 'Ingredienser':
        return recipes.sort((a, b) => RFUtil.sortOnAntalIngredienserAsc(a, b));
      default:
        return recipes.sort((a, b) => RFUtil.sortOnRelevans(a, b, filter.tags, filter.ingredients));
    }
  }

  handleFilterInput(changedFilter) {
    this.setState({
      filter: changedFilter,
    });
    this.findRecipes();
  }

  findRecipes() {
    const { filter, maxHits } = this.state;
    const { recipes } = this.props;
    const filteredRecipes = [];
    if (RFUtil.filterIsEmpty(filter)) {
      this.setState({
        foundRecipes: [],
      });
    }
    for (let i = 0; i < recipes.length; i++) {
      if (RFUtil.runFilter(recipes[i], filter)) {
        filteredRecipes.push(recipes[i]);
      }
    }
    // sortera recept
    const sortedRecipes = this.sortRecipes(filteredRecipes);

    if (sortedRecipes.length > maxHits) {
      sortedRecipes.length = maxHits;
    }
    this.setState({
      foundRecipes: sortedRecipes,
    });
  }

  render() {
    const { filter, foundRecipes } = this.state;
    const {
      foods, tags, recipes, grocerylists, units, favs, setSnackbar,
    } = this.props;
    return (
      <Grid container>
        <Grid item xs={12} className="searchbar-wrapper gutter">
          <Searchbar onFilterChange={this.handleFilterInput} tags={tags} foods={foods} filter={filter} />
        </Grid>
        <Grid item xs={12} className="gutter">
          <QuickTags onUserInput={this.handleFilterInput} tags={tags} filter={filter} recipeListRendered={foundRecipes.length > 0} />
        </Grid>
        <Grid item xs={12} className="gutter">
          <Sort onUserInput={this.handleFilterInput} render={foundRecipes.length > 0} filter={filter} />
        </Grid>
        <Grid item xs={12} className="gutter" style={{ color: '#fdfdfd' }}>
          <Typography color="inherit" variant="body1">{recipes.length > 0 ? `${recipes.length} recept hämtade` : ''}</Typography>
        </Grid>
        <Grid item xs={12} container className="recipelist-wrapper">
          {foundRecipes.map((r, index) => (
            <Grid item key={r.source}>
              <Recipe
                filter={filter}
                grocerylists={grocerylists}
                units={units}
                recipe={r}
                transitionDelay={index}
                isFav={favs.indexOf(r.source) > -1}
                setSnackbar={setSnackbar}
              />
            </Grid>
          ))}
        </Grid>
      </Grid>
    );
  }
}
FilterableRecipelist.propTypes = {
  recipes: PropTypes.array.isRequired,
  foods: PropTypes.array.isRequired,
  tags: PropTypes.array.isRequired,
  units: PropTypes.any.isRequired,
  favs: PropTypes.array,
  setSnackbar: PropTypes.func.isRequired,
  grocerylists: PropTypes.array,
};
export default FilterableRecipelist;
