import React, { Component } from 'react';
import './recipeList.css';
import RecipeCard from '../recipeCard/recipeCard';
import LinearProgress from 'material-ui/LinearProgress';

class RecipeList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recipes: this.props.recipes,
            isLoading: false,
        };
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


        //filterar bort alla recept som inte är tillräcklig matchning för att inte behöva sortera på tusentals recept. 
        //lägg till easter egg. Om man sökt på tag: gryta, ing: söjabönor, vodka. och inget annat så redirecta till en rolig google bild? eller visa upp den nere
        //i render här

        //ändra så att recpeten måste ha minst en taghits om dett finns tags i filtret. annars är ju vegetarisk helt onödigt.
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
            return this.simpleFilter(filter.ingredients.length, recipe.ingredients.length, ingredientHits) && ingredientHits / recipe.ingredients.length > 0.2;
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
        let filterTags = this.props.filter.tags;
        let filterIngredients = this.props.filter.ingredients;

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

    sortOnTid(a, b) {
        if(!b.time && !a.time){
            return 0;
        }
        if(!b.time){
            return -1;
        }
        if(!a.time){
            return 1;
        }
        return a.time - b.time;
    }

    sortRecipes(a, b) {
        if (this.props.filter.sort === 'Relevans') {
            return this.sortOnRelevans(a, b);
        } else if (this.props.filter.sort === 'Betyg') {
            return this.sortOnBetyg(a, b);
        }else if (this.props.filter.sort === 'Snabbast'){
            return this.sortOnTid(a, b);
        }

    }

    render() {
        let that = this;
        let recipes = [];
        let l = this.props.recipes.length;
        let easterEgg = false;
        //filtrera bort alla recipt  som inte ska vara med
        if (this.props.filter.tags.indexOf("Gryta") > -1 &&
            this.props.filter.tags.indexOf("Påsk") > -1 &&
            this.props.filter.tags.indexOf("Hemmagjord") > -1 &&
            this.props.filter.tags.indexOf("Mustig") > -1 &&
            this.props.filter.tags.length === 4 &&
            this.props.filter.ingredients.indexOf("Sojabönor") > -1 &&
            this.props.filter.ingredients.indexOf("Ägg") > -1 &&
            this.props.filter.ingredients.length === 2) {
            easterEgg = true;
        }
        for (let i = 0; i < l; i++) {
            if (this.runFilter(this.props.recipes[i], this.props.filter)) {
                recipes.push(this.props.recipes[i]);
            }
        }
        //sortera recept
        recipes.sort(function (a, b) {
            return that.sortRecipes(a, b);
        });
        if (recipes.length > this.props.maxHits) {
            recipes.length = this.props.maxHits;
        }

        return (
            <div><div className="col-md-12 app-stats">{this.props.recipes.length > 0 ? this.props.recipes.length + ' recept i databasen' : ''}</div>
                {easterEgg ? <img src="http://i.imgur.com/W43yLfJ.jpg" height="100%" width="100%"></img> : recipes.map((recipe, index) =>
                    <RecipeCard key={index} filter={this.props.filter}
                        recipe={recipe} />
                )}</div>);
    }
}
export default RecipeList;
