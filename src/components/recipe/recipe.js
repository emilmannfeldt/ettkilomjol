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
import { Card, CardText } from 'material-ui/Card';
import Fade from '@material-ui/core/Fade';
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';
import IconButton from '@material-ui/core/IconButton';
import AddGroceryDialog from './addGroceryDialog';


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
    //en tanke är att sätta this.props.recipe = till state igen. och sen ändra de faktiska amount/unit i denna metod på this.state.recipe så slipper jag skicka runt multipliern
    let recipe = this.state.recipe;
    for(let i = 0; i<recipe.ingredients.length; i++){
      if(recipe.ingredients[i].amount){
        recipe.ingredients[i].amount = recipe.ingredients[i].amount * (newPortionMultiplier / this.state.portionsMultiplier);
        if(recipe.ingredients[i].unit){
          //recipe.ingredients[i] = Util.checkUnit(recipe.ingredients[i], this.props.units);
          //kollar om uniten känns igen, och om den överskrider någon min- max värde. och såfall sätts unit om och amount korreigeras där efter
          //finns mycket att ta av från mina script.

          //finns lite problm med att ingredienserna sorteras om vid ändrat portins
          //kanske behöver något mer urskiljande styling för de portions som bara blir en sträng ohc inte en select. flytter igohp lite med ingredienserna?+ kanske inte
        }
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

    /*                todo:
      1. kolla upp buggen med render som körs vid snackbar/dialoger när inga states/props ändras? lägg till componentshouldupdate
      2. Fixa appbar
      3. Lägg funktion att ändra portions på receptet. fungerar det då automatiskt med ingredientsToAdd? behöver spara portionsMultiplyer i Recipe.state kanske?
      4. Man ska även kunna ändra portions i dialogen?
      5. Lägg till varning om att "du redan har lagt till detta recept i denna inköpslista"
      6. Kolla om ingrediensen man försöker lägga till redan finns i listan med samma Enhet isåfall så updatera bara amount och ev unit . använd util.js för att lägga till metoder kring unit och amount konvertering. kan även användas i portions. metoden tar in this.props.units
      7. importera dev till prod datbas
      8.positionen av action knapparna är berodne på hur lång description är....
      */
    //börja med att strukturera om components. ta bort mappar och slå ihop css.
    //en knapp "lägg till i inköslistan" som alltid visas men likt favorit så fungerar den bara när man är inloggad.
    //den fungerar likt ica där man får upp en dialog och får välja inköpslista eller skapa en ny som sedan ingredienserna läggs till som items på
    //snackbar säger att ingredienserna lagts till. kanske lägga till en genväg till inköslistan knapp? hur funkar det? måste lyfta currentList från state då? l'nka bara till mygrocerylists kanske?
    //ytterligare en funkton på varje individuell ingrediens. använd samma funktion som i recipecard. skicka med den funktionen som prop ner till ingredientlist
    return (<div className="col-xs-12 list-item" style={this.styles.wrapper}>
      <Fade in={true} style={{ transitionDelay: this.props.transitionDelay * 200 }}
        timeout={500}>
        <Card className="recipecard-content" style={this.styles.recipeCard}>
          <CardText className="recipe-card-info row">
            <div className="recipecard-title col-xs-12">
              {this.props.demo ? (<h3>{this.state.recipe.title}</h3>
              ) : (<h3><a onClick={this.visitSource} target='_blank'
                href={this.state.recipe.source.indexOf('tasteline.com') > -1 ? '//www.' + this.state.recipe.source : '//' + this.state.recipe.source}>{this.state.recipe.title}</a></h3>
                )}
            </div>
            <div className="col-xs-12 recipecard-author">
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
            <div className="col-xs-12 recipecard-description">{this.state.recipe.description} </div>
            <div className="col-xs-12 recipecard-rating">
              <Rating value={this.state.recipe.rating} votes={this.state.recipe.votes} />
            </div>
            <div className="col-md-4 col-xs-12">
              <Time time={this.state.recipe.time} />
              <Level index={this.state.recipe.level} />
            </div>
            <div className="col-md-8 col-xs-12 recipecard-ingredients">
              <IngredientProgress matchedIngredients={matchedIngredients} missingIngredients={missingIngredients} toggleIngredientlist={this.toggleIngredientlist} />
              {this.state.recipe.expanded && <Portion portionsUpdate={this.updatePortions} portions={this.state.recipe.portions} />}
            </div>
            <div className="col-md-8 col-xs-12 ingredient-list">
              {this.state.recipe.expanded && <Ingredientlist handleAddItem={this.showGroceryListDialog} portionsMultiplier={this.state.portionsMultiplier}
                ingredients={this.state.recipe.ingredients} missing={missingIngredients} />}
            </div>
            <div className="col-xs-12">
              <Tags matchedTags={matchedTags} recipeTags={this.state.recipe.tags} recipeKey={this.state.recipe.source} />
            </div>
          </CardText>
        </Card>
      </Fade>
      <AddGroceryDialog open={!!this.state.showGroceryDialog} onClose={this.closeGrocerylistDialog} grocerylists={this.props.grocerylists}
        itemsToAdd={this.state.itemsToAdd} recipeToAdd={this.state.recipeToAdd} setSnackbar={this.props.setSnackbar} />
    </div>);
  }
}
export default Recipe;