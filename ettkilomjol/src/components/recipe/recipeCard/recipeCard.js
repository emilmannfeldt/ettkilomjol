import React, { Component } from 'react';
import './recipeCard.css';
import Time from './time/time';
import Tags from './tags/tags';
import Level from './level/level';
import Rating from './rating/rating';

import FavoriteIcon from 'material-ui/svg-icons/action/favorite-border';
import FlatButton from 'material-ui/FlatButton';

import Ingredientlist from './ingredientlist/ingredientlist';
import IngredientProgress from './ingredientProgress/ingredientProgress';

import { Card, CardText } from 'material-ui/Card';

class RecipeCard extends Component {
  //onödigt med constructor om det bara är super(props)?
  //ha en state här som är true/false om detailview visas. 
  //nvänd den för att visa mer/mindre i komponenterna
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
    this.toggleIngredientlist = this.toggleIngredientlist.bind(this);
    this.closeIngredientlist = this.closeIngredientlist.bind(this);


  }
  //if expanded visa ännu en komponent (lista med ingredienser)
  //stäng alla andra expanded när denna blir true?
  //det som nu är ingredients kan duppliceras till ingredientlist


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

  toggleIngredientlist(){
    this.setState({
      expanded: !this.state.expanded,
    });
  }

  closeIngredientlist(){
    this.setState({
      expanded: false,
    });
  }

  render() {
    let matchedIngredients = [];
    let missingIngredients = [];
    let matchedTags = [];
    //length undefined
    for (let i = 0; i < this.props.recipe.ingredients.length; i++) {
      let name = this.props.recipe.ingredients[i].name;
      if (this.props.filter.ingredients.indexOf(name) > -1) {
        matchedIngredients.push(this.props.recipe.ingredients[i]);
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
    function IngredientlistComponent(props) {
      const render = props.render;
      if (render) {
        return (<div><Ingredientlist ingredients={props.ingredients} missing={props.missing}/></div>);
      } else {
        return (<div className="hidden"/>);
      }

    }

    return (<div className="col-xs-12 list-item" style={this.styles.wrapper}> <Card className="recipecard-content" style={this.styles.recipeCard}>
      <CardText className="recipe-card-info row">
        <div className="recipecard-title col-xs-12"><h2>
          <a target='_blank' href={this.props.recipe.source}>{this.props.recipe.title}</a></h2>
          
        </div>
        <div className="col-xs-12 recipecard-author">
          <i>
            {this.props.recipe.author}
            {this.props.recipe.createdFor ? ', ' + this.props.recipe.createdFor : ''}
            {this.props.recipe.created ? ' - ' + this.props.recipe.created : ''}
          </i>
        </div>
        <FlatButton
            label="Spara"
            className="recipecard-save-btn"
            secondary={true}
            icon={<FavoriteIcon/>}/>
        <div className="col-xs-12 recipecard-description">{this.props.recipe.description} </div>
        <div className="col-xs-12">
          <Rating
          value={this.props.recipe.rating}
          votes={this.props.recipe.votes}
          />
        </div>
        <div className="col-xs-4">
          <Time time={this.props.recipe.time} />
          <Level index={this.props.recipe.level} />
        </div>
        <div className="col-md-8 col-xs-12">
          <IngredientProgress
            matchedIngredients={matchedIngredients} missingIngredients={missingIngredients} toggleIngredientlist={this.toggleIngredientlist}/>
        </div>
        <div className="col-md-8 col-xs-12 ingredient-list">
        <IngredientlistComponent
            ingredients={this.props.recipe.ingredients} missing={missingIngredients} render={this.state.expanded}/>
        </div>
        <div className="col-xs-12">
          <Tags matchedTags={matchedTags} recipeTags={this.props.recipe.tags} recipeKey={this.props.recipe.source}/>
        </div>

      </CardText>
    </Card>
    </div>);
  }
}
//hur ska detta columnerna ändras i detail?? bootstrap 4?
export default RecipeCard;
