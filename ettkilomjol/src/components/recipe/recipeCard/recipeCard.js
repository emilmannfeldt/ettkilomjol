import React, { Component } from 'react';
import './recipeCard.css';
import IngredientTag from '../ingredientTag/ingredientTag';
import { Card, CardText } from 'material-ui/Card';
import BakeTime from '../bakeTime/bakeTime';

class RecipeCard extends Component {
  //onödigt med constructor om det bara är super(props)?
  constructor(props) {
    super(props);
  }

  styles = {
    recipeCard: {
      margin: 4,
    },
    wrapper: {
    },
    title: {
      fontSize: 14,
      lineHeight: 1
    }
  };

  render() {
    let matchedIngredients = [];
    let missingIngredients = [];
    for (let i = 0; i < this.props.recipe.ingredients.length; i++) {
      let name = this.props.recipe.ingredients[i].name;
      if (this.props.filter.ingredients.indexOf(name) > -1) {
        matchedIngredients.push(name);
      }
      else {
        missingIngredients.push(name);
      }

    }

    return (<div className="col-lg-4 col-md-4 col-sm-4 col-xs-6 list-item" style={this.styles.wrapper}> <Card className="recipecard-content" style={this.styles.recipeCard}>
      <div className="recipe-card-image">
        <img src={this.props.recipe.image} alt="recipe" />
      </div>
      <CardText className="recipe-card-info">
        <div className="recipecard-title">{this.props.recipe.title} </div>
        <IngredientTag
          matchedIngredients={matchedIngredients} missingIngredients={missingIngredients} />
        <BakeTime time={this.props.recipe.time} />
      </CardText>
    </Card>
    </div>);
  }
}
export default RecipeCard;