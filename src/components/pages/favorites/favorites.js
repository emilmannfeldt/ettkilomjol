import React, { Component } from 'react';
import './favorites.css'
import TextField from '@material-ui/core/TextField';
import Fuse from 'fuse.js';
import Recipe from '../../recipe/recipe';

class Favorites extends Component {
    state = {
        filter: {
            ingredients: [],
            tags: [],
            freeSearch: ''
        },
    };

    handleSearch = event => {
        this.setState({
            filter: {
                freeSearch: event.target.value,
                ingredients: [],
                tags: [],
            },
        })
    };
    dummy() {
    }
    render() {
        var options = {
            shouldSort: true,
            threshold: 0.3,
            location: 0,
            distance: 800,
            maxPatternLength: 32,
            minMatchCharLength: 1,
            keys: [
                "title",
                "author",
                "description",
                "createdFor",
            ]
        };

        let recipesTmp = [];
        for (let i = 0; i < this.props.recipes.length; i++) {
            let recipe = this.props.recipes[i];
            if (this.props.favs.indexOf(recipe.source) > -1) {
                recipesTmp.push(recipe);
            }
        }
        if (this.state.filter.freeSearch.length > 0) {
            var fuse = new Fuse(recipesTmp, options);
            recipesTmp = fuse.search(this.state.filter.freeSearch);
        }
        let demoRecipe = null;
        if (this.props.recipes.length > 0) {
            demoRecipe = this.props.recipes[this.props.recipes.length - 1];
            demoRecipe.title = "Exempel på recept";
            demoRecipe.source = "#";
            demoRecipe.description = "Du har inga sparade favoritrecept. För att spara ett recept klickar du på hjärtat upp till höger. Detta är bara ett exempel. Gå till sök recept för att hitta dina favoriter.";
        }
        return (
            <div className="container my_recipes-container">
                <div className="row">
                    <div className="col-xs-12">
                        <h2 className="page-title">Mina sparade favoriter</h2>
                        <TextField className="my_recipes-search"
                            label="Sök"
                            value={this.state.filter.freeSearch}
                            onChange={this.handleSearch}
                            margin="normal"
                        />
                    </div>
                    {demoRecipe && recipesTmp.length === 0 ? (
                        <Recipe demo={true} transitionDelay={12} isFav={false} recipe={demoRecipe} filter={this.state.filter} setSnackbar={this.dummy} units={this.props.units}/>
                    )
                        : (recipesTmp.map((recipe, index) =>
                        <Recipe key={recipe.source} filter={this.state.filter} ref="child" grocerylists={this.props.grocerylists}
                        recipe={recipe} transitionDelay={index} isFav={true} setSnackbar={this.props.setSnackbar} units={this.props.units} />
                        )
                        )}
                </div>
            </div>
        );
        //fixa till en bild som visar hur man lägger till favoritrecept?
        //visa även en bild om hur man söker vid reload första gången?
        //visa den för nya användare första gången?
    }


}
export default Favorites;