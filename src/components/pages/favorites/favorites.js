import React, { Component } from 'react';
import './favorites.css';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import Fuse from 'fuse.js';
import Grid from '@material-ui/core/Grid';
import Recipe from '../../recipe/recipe';

function dummy() {}

class Favorites extends Component {
    state = {
      filter: {
        ingredients: [],
        tags: [],
        freeSearch: '',
      },
    };

    handleSearch = (event) => {
      this.setState({
        filter: {
          freeSearch: event.target.value,
          ingredients: [],
          tags: [],
        },
      });
    };

    render() {
      const {
        recipes, favs, units, grocerylists, setSnackbar,
      } = this.props;
      const { filter } = this.state;
      const options = {
        shouldSort: true,
        threshold: 0.3,
        location: 0,
        distance: 800,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [
          'title',
          'author',
          'description',
          'createdFor',
        ],
      };

      let recipesTmp = [];
      for (let i = 0; i < recipes.length; i++) {
        const recipe = recipes[i];
        if (favs.indexOf(recipe.source) > -1) {
          recipesTmp.push(recipe);
        }
      }
      if (filter.freeSearch.length > 0) {
        const fuse = new Fuse(recipesTmp, options);
        recipesTmp = fuse.search(filter.freeSearch);
      }
      let demoRecipe = null;
      if (recipes.length > 0) {
        demoRecipe = recipes[recipes.length - 1];
        demoRecipe.title = 'Exempel på recept';
        demoRecipe.source = '#';
        demoRecipe.description = 'Du har inga sparade favoritrecept. För att spara ett recept klickar du på hjärtat upp till höger. Detta är bara ett exempel. Gå till sök recept för att hitta dina favoriter.';
      }
      return (
        <Grid item container className="container my_recipes-container">
          <Grid item xs={12}>
            <h2 className="page-title">Mina sparade favoriter</h2>
            <TextField
              className="my_recipes-search c-autocomplete"
              label="Sök"
              value={filter.freeSearch}
              onChange={this.handleSearch}
              margin="normal"
            />
          </Grid>
          <Grid item>
            {demoRecipe && recipesTmp.length === 0 ? (
              <Recipe demo transitionDelay={12} isFav={false} recipe={demoRecipe} filter={filter} setSnackbar={dummy} units={units} />
            )
              : (recipesTmp.map((recipe, index) => (
                <Recipe
                  key={recipe.source}
                  filter={filter}
                  grocerylists={grocerylists}
                  recipe={recipe}
                  transitionDelay={index}
                  isFav
                  setSnackbar={setSnackbar}
                  units={units}
                />
              ))
              )}
          </Grid>
        </Grid>
      );
    }
}
Favorites.propTypes = {
  grocerylists: PropTypes.array.isRequired,
  setSnackbar: PropTypes.func.isRequired,
  units: PropTypes.any.isRequired,
  recipes: PropTypes.array.isRequired,
  favs: PropTypes.array.isRequired,

};
export default Favorites;
