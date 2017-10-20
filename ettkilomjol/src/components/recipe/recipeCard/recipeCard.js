import React, { Component } from 'react';
import './recipeCard.css';
import IngredientTag from '../ingredientTag/ingredientTag';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import BakeTime from '../bakeTime/bakeTime';

class RecipeCard extends Component {
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
    for (let property in this.props.recipe.ingredients) {
      if (this.props.recipe.ingredients.hasOwnProperty(property)) {
        if (this.props.filter.ingredients.indexOf(property) > -1) {
          matchedIngredients.push(property);
        }
        else {
          missingIngredients.push(property);
        }
      }
    }

    return (<div className="col-lg-4 col-md-4 col-sm-4 col-xs-6 list-item" style={this.styles.wrapper}> <Card className="recipecard-content" style={this.styles.recipeCard}>
      <div className="recipe-card-image">
        <img src={this.props.recipe.image} />
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