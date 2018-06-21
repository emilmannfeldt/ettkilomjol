import React, { Component } from 'react';
import './recipeCard.css';
import { fire } from '../../../base';
import Time from './time/time';
import Tags from './tags/tags';
import Favorite from './favorite/favorite';
import Level from './level/level';
import Rating from './rating/rating';
import Portion from './portion/portion';
import FlatButton from 'material-ui/FlatButton';
import Ingredientlist from './ingredientlist/ingredientlist';
import IngredientProgress from './ingredientProgress/ingredientProgress';
import { Card, CardText } from 'material-ui/Card';
import Fade from '@material-ui/core/Fade';

class RecipeCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
    this.toggleIngredientlist = this.toggleIngredientlist.bind(this);
    this.closeIngredientlist = this.closeIngredientlist.bind(this);
    this.visitSource = this.visitSource.bind(this);
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

  toggleIngredientlist() {
    this.setState({
      expanded: !this.state.expanded,
    });
  }

  closeIngredientlist() {
    this.setState({
      expanded: false,
    });
  }

  visitSource() {
    let recipeRef = fire.database().ref("recipes");
    recipeRef.orderByChild('source').equalTo(this.props.recipe.source).once("value", function (snapshot) {
      snapshot.forEach(function (child) {
        let recipeTmp = child.val();
        console.log("visiting " + child.val().source);
        if (recipeTmp.visits) {
          recipeTmp.visits = recipeTmp.visits + 1;
        } else {
          recipeTmp.visits = 1;
        }
        recipeRef.child(child.key).update(recipeTmp);
      });
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
      } else {
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
        return (<Ingredientlist ingredients={props.ingredients} missing={props.missing} />);
      } else {
        return (null);
      }
    }
    function PortionComponent(props) {
      const render = props.render;
      if (render && props.portions) {
        return (<Portion portions={props.portions} />);
      } else {
        return (null);
      }
    }
    return (<div className="col-xs-12 list-item" style={this.styles.wrapper}>
      <Fade in={true} style={{ transitionDelay: this.props.transitionDelay * 200 }}
        timeout={500}>
        <Card className="recipecard-content" style={this.styles.recipeCard}>
          <CardText className="recipe-card-info row">
            <div className="recipecard-title col-xs-12">
              {this.props.demo ? (<h2>{this.props.recipe.title}</h2>
              ) : (<h2><a onClick={this.visitSource} target='_blank' href={'//' + this.props.recipe.source}>{this.props.recipe.title}</a></h2>
                )}
            </div>
            <div className="col-xs-12 recipecard-author">
              <span>
                {this.props.recipe.author}
                {this.props.recipe.createdFor ? ', ' + this.props.recipe.createdFor : ''}
                {this.props.recipe.created ? ' - ' + this.props.recipe.created : ''}
              </span>
            </div>
            <div className="col-xs-12 recipecard-favorite">
              <Favorite source={this.props.recipe.source} isFav={this.props.isFav} setSnackbar={this.props.setSnackbar} />
            </div>
            <div className="col-xs-12 recipecard-description">{this.props.recipe.description} </div>
            <div className="col-xs-12 recipecard-rating">
              <Rating value={this.props.recipe.rating} votes={this.props.recipe.votes} />
            </div>
            <div className="col-md-4 col-xs-12">
              <Time time={this.props.recipe.time} />
              <Level index={this.props.recipe.level} />
            </div>
            <div className="col-md-8 col-xs-12 recipecard-ingredients">
              <IngredientProgress matchedIngredients={matchedIngredients} missingIngredients={missingIngredients} toggleIngredientlist={this.toggleIngredientlist} />
              <PortionComponent portions={this.props.recipe.portions} render={this.state.expanded} />
            </div>
            <div className="col-md-8 col-xs-12 ingredient-list">
              <IngredientlistComponent
                ingredients={this.props.recipe.ingredients} missing={missingIngredients} render={this.state.expanded} />
            </div>
            <div className="col-xs-12">
              <Tags matchedTags={matchedTags} recipeTags={this.props.recipe.tags} recipeKey={this.props.recipe.source} />
            </div>
          </CardText>
        </Card>
      </Fade>
    </div>);
  }
}
//hur ska detta columnerna ändras i detail?? bootstrap 4?
export default RecipeCard;
