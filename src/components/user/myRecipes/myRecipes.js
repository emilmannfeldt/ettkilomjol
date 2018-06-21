import React, { Component } from 'react';
import { fire } from '../../../base';
import RecipeList from '../../recipe/recipeList/recipeList';
import './myRecipes.css'
import TextField from '@material-ui/core/TextField';
import Fuse from 'fuse.js';
import { Card, CardText } from 'material-ui/Card';
import Fade from '@material-ui/core/Fade';
import RecipeCard from '../../recipe/recipeCard/recipeCard';

class MyRecipes extends Component {
    state = {
        filter: {
            ingredients: [],
            tags: [],
            freeSearch: ''
        },
    };

    handleSearch = event => {
        //lägg till funktionalitet för att hantera freeSearch i recipeList.
        //det är lite deplay mellan att spinnern försvinner och recpten visas?
        //en egen spinner här?
        //dör spinnern lite för tidigt egentligen?
        //lägg till hideSpinner här? och ignorera hideSPinner i home.js om urlen slutar på /favorites?
        //styla likt automcpletten, sno några rader css från den
        //en annan backgrundbild på denna sida? något som inte behöver vara en bild. 
        //något finnt mönster eller enfrärgad
        //fixa en information på ett card om det saknas favoriter.
        this.setState({
            filter: {
                freeSearch: event.target.value,
                ingredients: [],
                tags: [],
            },
        })
    };
    dummy() {
        console.log("dummy");
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
            console.log(recipesTmp);
        }
        let demoRecipe = null;
        if (this.props.recipes.length > 0) {
            demoRecipe = this.props.recipes[this.props.recipes.length-1];
            demoRecipe.title = "Exempel på recept";
            demoRecipe.source="#";
            demoRecipe.description = "Du har inga sparade favoritrecept. För att spara ett recept klickar du på hjärtat upp till höger. Detta är bara ett exempel. Gå till sök recept för att hitta dina favoriter.";
        }
        return (
            <div className="container my_recipes-container">
                <div className="row">
                    <div className="col-xs-12">
                        <h2 className="my_recipes-title">Mina sparade favoriter</h2>
                        <TextField className="my_recipes-search"
                            label="Sök"
                            value={this.state.filter.freeSearch}
                            onChange={this.handleSearch}
                            margin="normal"
                        />
                    </div>
                    {demoRecipe && recipesTmp.length === 0 ? (
                        <RecipeCard demo={true} transitionDelay={8} isFav={false} recipe={demoRecipe} filter={this.state.filter} setSnackbar={this.dummy} />
                    )
                        : (<RecipeList recipes={recipesTmp} filter={this.state.filter} favs={this.props.favs} />
                        )}
                </div>
            </div>
        );
        //fixa till en bild som visar hur man lägger till favoritrecept?
        //visa även en bild om hur man söker vid reload första gången?
        //visa den för nya användare första gången?
    }


}
export default MyRecipes;