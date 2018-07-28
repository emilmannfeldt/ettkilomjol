import React, { Component } from 'react';
import { fire } from '../../base';
import './recipe.css';
import Time from './time';
import Tags from './tags';
import Favorite from './favorite';
import Level from './level';
import Rating from './rating';
import Portion from './portion';
import Ingredientlist from './ingredientlist';
import IngredientProgress from './ingredientProgress';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Fade from '@material-ui/core/Fade';
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';
import IconButton from '@material-ui/core/IconButton';
import AddGroceryDialog from './addGroceryDialog';
import Utils from '../../util';


class Recipe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      portionsMultiplier: 1,
      recipe: this.props.recipe,
    };
    this.toggleIngredientlist = this.toggleIngredientlist.bind(this);
    this.closeIngredientlist = this.closeIngredientlist.bind(this);
    this.visitSource = this.visitSource.bind(this);
    this.showGroceryListDialog = this.showGroceryListDialog.bind(this);
    this.showGroceryListDialogInternal = this.showGroceryListDialogInternal.bind(this);
    this.closeGrocerylistDialog = this.closeGrocerylistDialog.bind(this);
    this.updatePortions = this.updatePortions.bind(this);
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
    let recipe = this.state.recipe;
    recipe.expanded = !recipe.expanded;
    this.setState({
      recipe: recipe,
    });
  }

  closeIngredientlist() {
    this.setState({
      expanded: false,
    });
  }
  updatePortions(newPortionMultiplier) {
    let recipe = this.state.recipe;
    for (let i = 0; i < recipe.ingredients.length; i++) {
      if (recipe.ingredients[i].amount) {
        recipe.ingredients[i].amount = Utils.closestDecimals(recipe.ingredients[i].amount * (newPortionMultiplier / this.state.portionsMultiplier));
        if (recipe.ingredients[i].unit) {
          recipe.ingredients[i] = Utils.correctIngredientUnit(recipe.ingredients[i], this.props.units);
//8. recepten som tillhör inköslistan ska bara finnas med under en knapp. "visa recept" klickar man där visas alla recipecards som grocerylist.recipes har.
          //gå ut med detta till gruppen i helgen. vår chatgrupp först kanske :)
          // fixa bättre felhantering på grocerylists. felmeddelandet ska skrivas intill fältet. kanske en required på amount som name och unit finns: required={name && unit}
        }//kolla best pracite för felmeddelanden. Alert? rödfärg vid knappen? vid fältet? snackbar? toaster?
        //felmeddelanden: männskilga, humor, placera vid relevant fält. 
      }
    }
    this.setState({
      portionsMultiplier: newPortionMultiplier,
      recipe: recipe
    });
  }

  visitSource() {
    let recipeRef = fire.database().ref("recipes");
    recipeRef.orderByChild('source').equalTo(this.state.recipe.source).once("value", function (snapshot) {
      snapshot.forEach(function (child) {
        let recipeTmp = child.val();
        //console.log("visiting " + child.val().source);
        if (recipeTmp.visits) {
          recipeTmp.visits = recipeTmp.visits + 1;
        } else {
          recipeTmp.visits = 1;
        }
        recipeRef.child(child.key).update(recipeTmp);
      });
    });
  }
  showGroceryListDialogInternal() {
    this.showGroceryListDialog(this.state.recipe, this.state.recipe.ingredients);
  }
  showGroceryListDialog(recipe, items) {
    if (fire.auth().currentUser.isAnonymous) {
      this.props.setSnackbar('login_required');
    } else {
      this.setState({
        showGroceryDialog: true,
        itemsToAdd: items,
        recipeToAdd: recipe,
      });
    }
  }
  closeGrocerylistDialog() {
    this.setState({
      itemsToAdd: [],
      showGroceryDialog: false,
      recipeToAdd: {},
    });
  }

  render() {
    let matchedIngredients = [];
    let missingIngredients = [];
    let matchedTags = [];
    for (let i = 0; i < this.state.recipe.ingredients.length; i++) {
      let name = this.state.recipe.ingredients[i].name;
      if (this.props.filter.ingredients.indexOf(name) > -1) {
        matchedIngredients.push(this.state.recipe.ingredients[i]);
      } else {
        missingIngredients.push(name);
      }
    }
    for (let tag in this.state.recipe.tags) {
      if (this.state.recipe.tags.hasOwnProperty(tag)) {
        if (this.props.filter.tags.indexOf(tag) > -1) {
          matchedTags.push(tag);
        }
      }
    }
    return (<div className="col-xs-12 list-item" style={this.styles.wrapper}>
      <Fade in={true} style={{ transitionDelay: this.props.transitionDelay * 200 }}
        timeout={500}>
        <Card className="recipecard-content" style={this.styles.recipeCard}>
          <CardContent className="recipe-card-info row">
            <div className="recipecard-title col-xs-12">
              {this.props.demo ? (<h3 className="text-big">{this.state.recipe.title}</h3>
              ) : (<h3 className="text-big"><a onClick={this.visitSource} target='_blank'
                href={this.state.recipe.source.indexOf('tasteline.com') > -1 ? '//www.' + this.state.recipe.source : '//' + this.state.recipe.source}>{this.state.recipe.title}</a></h3>
                )}
            </div>
            <div className="col-xs-12 recipecard-author text-medium">
              <span>
                {this.state.recipe.author}
                {this.state.recipe.createdFor ? ', ' + this.state.recipe.createdFor : ''}
                {this.state.recipe.created ? ' - ' + this.state.recipe.created : ''}
              </span>
            </div>
            <div className="col-xs-12 recipecard-favorite">
              <Favorite source={this.state.recipe.source} isFav={this.props.isFav} setSnackbar={this.props.setSnackbar} />
              <IconButton onClick={this.showGroceryListDialogInternal} color="secondary" className="recipe-grocerylist--btn">
                <ShoppingCartOutlinedIcon />
              </IconButton>
            </div>
            <div className="col-xs-12 recipecard-description text-medium">{this.state.recipe.description} </div>
            <div className="col-xs-12 recipecard-rating text-small">
              <Rating value={this.state.recipe.rating} votes={this.state.recipe.votes} />
            </div>
            <div className="col-md-4 col-xs-12 text-small">
              <Time time={this.state.recipe.time} />
              <Level index={this.state.recipe.level} />
            </div>
            <div className="col-md-8 col-xs-12 recipecard-ingredients text-medium">
              <IngredientProgress matchedIngredients={matchedIngredients} missingIngredients={missingIngredients} toggleIngredientlist={this.toggleIngredientlist} />
              {this.state.recipe.expanded && <Portion portionsUpdate={this.updatePortions} portions={this.state.recipe.portions} />}
            </div>
            <div className="col-md-8 col-xs-12 ingredient-list text-medium">
              {this.state.recipe.expanded && <Ingredientlist handleAddItem={this.showGroceryListDialog} portionsMultiplier={this.state.portionsMultiplier}
                ingredients={this.state.recipe.ingredients} missing={missingIngredients} />}
            </div>
            <div className="col-xs-12 text-small">
              <Tags matchedTags={matchedTags} recipeTags={this.state.recipe.tags} recipeKey={this.state.recipe.source} />
            </div>
          </CardContent>
        </Card>
      </Fade>
      <AddGroceryDialog units={this.props.units} open={!!this.state.showGroceryDialog} onClose={this.closeGrocerylistDialog} grocerylists={this.props.grocerylists}
        itemsToAdd={this.state.itemsToAdd} recipeToAdd={this.state.recipeToAdd} setSnackbar={this.props.setSnackbar} />
    </div>);
  }
}
export default Recipe;