import React, { Component } from 'react';
import './recipeList.css';
import RecipeCard from '../recipeCard/recipeCard';

class RecipeList extends Component {
    render() {
        return (
            <div>
                {this.props.recipes.map((recipe, index) =>
                    <RecipeCard key={index} filter={this.props.filter} ref="child"
                        recipe={recipe} transitionDelay={index} isFav={this.props.favs.indexOf(recipe.source) > -1} setSnackbar={this.props.setSnackbar}/>
                )}</div>);
    }
}
export default RecipeList;
