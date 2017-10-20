import React, { Component } from 'react';
import './recipeList.css';
import RecipeCard from '../recipeCard/recipeCard';

class RecipeList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recipeCards: this.props.recipeCards,
        };
    }

    filterIsEmpty(filter) {
        if (filter.ingredients.length < 1) {
            return true;
        }
    }
    
    runIngredientFilter(recipeIngredients, filterIngredients) {
        let ingredientHits = 0;
        for (let i = 0; i < filterIngredients.length; i++) {
            if (recipeIngredients.hasOwnProperty(filterIngredients[i])) {
                ingredientHits++;
            }
        }
        return ingredientHits;
    }

    runFilter(recipe, filter) {
        if (this.filterIsEmpty(filter)) {
            return false;
        }
        //filterar bort alla recept som inte har någon matchning alls. 
        //och om mer än 10/20 ingredienser angetts filtrera även bort alla som bara har 1/2 matchning med undantag för i fall där recept är kompletta
        let ingredientHits = this.runIngredientFilter(recipe.ingredients, filter.ingredients);
        if (filter.ingredients.length > 20) {
            return ingredientHits > 2 || (ingredientHits === Object.keys(recipe.ingredients).length);
        }
        if (filter.ingredients.length > 10) {
            return ingredientHits > 1 || (ingredientHits === Object.keys(recipe.ingredients).length);
        }
        return ingredientHits > 0;
    }

    sortRecipeCards(a, b) {
        let filterIngredients = this.props.filter.ingredients;
        //return -1 om a är sämtre än b
        //return 1 om a är bättre än b
        //return 0 om de är lika
        let l = filterIngredients.length;
        let ingredientHitsA = 0;
        let ingredientHitsB = 0;
        for (let i = 0; i < l; i++) {
            if (a.ingredients.hasOwnProperty(filterIngredients[i])) {
                ingredientHitsA++;
            }
            if (b.ingredients.hasOwnProperty(filterIngredients[i])) {
                ingredientHitsB++;
            }
        }
        let aIngredients = Object.keys(a.ingredients).length;
        let bIngredients = Object.keys(b.ingredients).length;
        let missingA = aIngredients - ingredientHitsA;
        let missingB = bIngredients - ingredientHitsB;

        //om båda är full match: Välj den som har flest antal ingredienser
        if (missingA === 0 && missingB === 0) {
            return ingredientHitsB - ingredientHitsA;
        }
        //om båda har lika många matchningar: Välj den som saknar minst antal ingredienser
        if (ingredientHitsA === ingredientHitsB) {
            return missingA - missingB;
        }
        //Annars: Välj den med flest matchande ingredienser
        return ((ingredientHitsB - 0.1) / bIngredients) - ((ingredientHitsA - 0.1) / aIngredients);
    }

    render() {

        let that = this;
        let recipes = [];
        let l = this.props.recipeCards.length;
        for (let i = 0; i < l; i++) {
            if (this.runFilter(this.props.recipeCards[i], this.props.filter)) {
                recipes.push(this.props.recipeCards[i]);
            }
        }
        recipes.sort(function (a, b) {
            return that.sortRecipeCards(a, b);
        });
        if (recipes.length > this.props.maxHits) {
            recipes.length = this.props.maxHits;
        }

        return (<div>{recipes.map((recipe, index) =>
            <RecipeCard key={index} filter={this.props.filter}
                recipe={recipe} />
        )}</div>);
    }
}
export default RecipeList;