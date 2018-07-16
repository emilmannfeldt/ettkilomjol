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
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import AssignmentIcon from '@material-ui/icons/Assignment';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import { encodeSource, millisecToDateString } from '../../util';


class Recipe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
    this.toggleIngredientlist = this.toggleIngredientlist.bind(this);
    this.closeIngredientlist = this.closeIngredientlist.bind(this);
    this.visitSource = this.visitSource.bind(this);
    this.showGroceryListDialog = this.showGroceryListDialog.bind(this);
    this.addItemsToGroceryList = this.addItemsToGroceryList.bind(this);
    this.showGroceryListDialogInternal = this.showGroceryListDialogInternal.bind(this);
    this.closeGrocerylistDialog = this.closeGrocerylistDialog.bind(this);
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
  addItemsToGroceryList(grocerylist) {
    let ref = fire.database().ref('users/' + fire.auth().currentUser.uid + '/grocerylists/' + grocerylist);
    var updates = {};
    for (let i = 0; i < this.state.itemsToAdd.length; i++) {
      updates['/items/' + ref.push().key] = this.state.itemsToAdd[i];
    }
    updates['/recipes/' + encodeSource(this.state.recipeToAdd.source)] = true;
    let that = this;
    ref.update(updates, function (error) {
      if (error) {
        console.log('Error has occured during saving process');
      }
      else {
      }
    });
    that.props.setSnackbar('recipe_added_grocerylist');
    that.setState({
      itemsToAdd: [],
      showGroceryDialog: false,
    })
  }
  showGroceryListDialogInternal() {
    this.showGroceryListDialog(this.props.recipe, this.props.recipe.ingredients);
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
      recipeToAdd: {}
    })
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
    function GrocerylistComponent(props) {
      return (<List className="grocerylist-itemlist">
        {props.grocerylists.map((grocerylist, index) =>
          <ListItem key={index} onClick={() => { props.handleClick(grocerylist.name) }} disableGutters={true}>
            <Avatar>
              <AssignmentIcon />
            </Avatar>
            <ListItemText primary={grocerylist.name} secondary={millisecToDateString(grocerylist.created)} />
          </ListItem>
        )}
      </List>);

    }
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
              {this.props.demo ? (<h2>{this.props.recipe.title}</h2>
              ) : (<h2><a onClick={this.visitSource} target='_blank'
                href={this.props.recipe.source.indexOf('tasteline.com') > -1 ? '//www.' + this.props.recipe.source : '//' + this.props.recipe.source}>{this.props.recipe.title}</a></h2>
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
              <Button onClick={this.showGroceryListDialogInternal} color="primary" variant="contained">Lägg till i inköpslistan</Button>
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
      <Dialog className="grocerylist-dialog" open={!!this.state.showGroceryDialog} aria-labelledby="form-dialog-title" onClose={this.closeGrocerylistDialog}>
        <DialogTitle id="simple-dialog-title">Välj inköpslista</DialogTitle>
        <DialogContent className="recipecard-grocerylist-content">
          <DialogContentText>
            snygga till. Fixa this.encoding som finns både här och i favorite.js till en util.js fil?? importeras likt base.js.

          </DialogContentText>
          <GrocerylistComponent grocerylists={this.props.grocerylists} handleClick={this.addItemsToGroceryList} />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.newGroceryList} color="primary" variant="contained">Ny lista</Button>
        </DialogActions>
      </Dialog>
    </div>);
  }
}
export default Recipe;