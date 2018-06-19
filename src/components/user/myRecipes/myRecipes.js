import React, { Component } from 'react';
import { fire } from '../../../base';
import RecipeList from '../../recipe/recipeList/recipeList';
import './myRecipes.css'
class MyRecipes extends Component {
    state = {
        filter: {
            ingredients: [],
            tags: [],
        },
        MyRecipes: []
    };

    componentDidMount() {
        let recipesTmp = [];
        for (let i = 0; i < this.props.recipes.length; i++) {
            let recipe = this.props.recipes[i];
            if (this.props.favs.indexOf(recipe.source) > -1) {
                recipesTmp.push(recipe);
            }
        }
        this.setState({
            MyRecipes: recipesTmp,
        });
    }

    render() {
        return (
            <div className="container my_recipes-container">
                <div className="col-xs-12">
                    <h2 className="my_recipes-title">Mina sparade favoriter</h2>
                </div>
                <RecipeList recipes={this.state.MyRecipes} filter={this.state.filter} favs={this.props.favs} />
            </div>
        );
    }
}
export default MyRecipes;