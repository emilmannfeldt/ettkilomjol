import React, { Component } from 'react';
import './recipeList.css';
import RecipeCard from '../recipeCard/recipeCard';

class RecipeList extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                {this.props.recipes.map((recipe, index) =>
                    <RecipeCard key={index} filter={this.props.filter} ref="child"
                        recipe={recipe} isFav={this.props.favs.indexOf(recipe.source) > -1} />
                )}</div>);
    }
}
export default RecipeList;
