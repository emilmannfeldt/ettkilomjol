import React, { Component } from 'react';
import './recipeCard.css';
import Time from './time/time';
import Ingredients from './ingredients/ingredients';
import { Card, CardText } from 'material-ui/Card';

class RecipeCard extends Component {
  //onödigt med constructor om det bara är super(props)?
  //ha en state här som är true/false om detailview visas. 
  //nvänd den för att visa mer/mindre i komponenterna
  constructor(props) {
    super(props);
  }

  styles = {
    recipeCard: {
      margin: 4,
    },
    wrapper: {},
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

    return (<div className="col-xs-12 list-item" style={this.styles.wrapper}> <Card className="recipecard-content" style={this.styles.recipeCard}>
      <CardText className="recipe-card-info">
        <div className="recipecard-title"><h2>
        <a target='_blank' href={this.props.recipe.source}>{this.props.recipe.title}</a>
        </h2> </div>
        <div className="recipecard-author"><i>
        {this.props.recipe.author} 
        {this.props.recipe.createdFor || ''}
        - {this.props.recipe.created}
        </i> </div>
        <div className="recipecard-description">{this.props.recipe.description} </div>

        <Ingredients
          matchedIngredients={matchedIngredients} missingIngredients={missingIngredients} />
        <Time time={this.props.recipe.time} />
      </CardText>
    </Card>
    </div>);
  }
}
export default RecipeCard;
