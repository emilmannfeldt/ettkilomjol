import React, { Component } from 'react';
import './recipeCard.css';
import Time from './time/time';
import Tags from './tags/tags';
import Level from './level/level';
import Rating from './rating/rating';

import FavoriteIcon from 'material-ui/svg-icons/action/favorite-border';
import FlatButton from 'material-ui/FlatButton';

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
    let matchedTags = [];
    //length undefined
    for (let i = 0; i < this.props.recipe.ingredients.length; i++) {
      let name = this.props.recipe.ingredients[i].name;
      if (this.props.filter.ingredients.indexOf(name) > -1) {
        matchedIngredients.push(name);
      }
      else {
        missingIngredients.push(name);
      }
    }
    for (let tag in this.props.recipe.tags) {
      if (this.props.recipe.tags.hasOwnProperty(tag)) {
        if (this.props.filter.tags.indexOf(tag) > -1) {
          matchedTags.push(tag);
        }
      }
    }

    return (<div className="col-xs-12 list-item" style={this.styles.wrapper}> <Card className="recipecard-content" style={this.styles.recipeCard}>
      <CardText className="recipe-card-info row">
        <div className="recipecard-title col-xs-12"><h2>
          <a target='_blank' href={this.props.recipe.source}>{this.props.recipe.title}</a>
        </h2> </div>
        <div className="col-xs-12 recipecard-author">
          <i>
            {this.props.recipe.author}
            {this.props.recipe.createdFor ? ', ' + this.props.recipe.createdFor : ''}
            {this.props.recipe.created ? ' - ' + this.props.recipe.created : ''}
          </i>
        </div>
        <div className="col-xs-12 recipecard-description">{this.props.recipe.description} </div>
        <div className="col-xs-8">
          <Rating
          value={this.props.recipe.rating}
          votes={this.props.recipe.votes}
          />
        </div>
        <div className="col-xs-4">
          <FlatButton
            href="https://github.com/callemall/material-ui"
            target="_blank"
            label="Spara"
            className="recipecard-save-btn"
            secondary={true}
            icon={<FavoriteIcon/>}
          />
        </div>
        <div className="col-xs-6">
          <Time time={this.props.recipe.time} />
          <Level index={this.props.recipe.level} />
        </div>
        <div className="col-xs-6">
          <Ingredients
            matchedIngredients={matchedIngredients} missingIngredients={missingIngredients} />
        </div>
        <div className="col-xs-6">
          <Tags matchedTags={matchedTags} />
        </div>

      </CardText>
    </Card>
    </div>);
  }
}
//hur ska detta columnerna ändras i detail?? bootstrap 4?
export default RecipeCard;
