import React, { Component } from 'react';
import './ingredientlist.css';
import Badge from 'material-ui/Badge';
import IconButton from 'material-ui/IconButton';
import ShoppingBasketIcon from 'material-ui/svg-icons/action/shopping-basket';
import RestaurantMenuIcon from 'material-ui/svg-icons/maps/restaurant-menu';
import AddIcon from 'material-ui/svg-icons/content/add-box';
import DoneIcon from 'material-ui/svg-icons/action/done';
import Popover from 'material-ui/Popover';
import Divider from 'material-ui/Divider';
import { List, ListItem } from 'material-ui/List';
import LinearProgress from 'material-ui/LinearProgress';


class Ingredientlist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }
  styles = {
    chip: {
      margin: 4,
    },
    wrapper: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    badge: {
      top: 4,
      right: 4,
      fontSize: 10,
      width: 28,
      height: 28,
      backgroundColor: '#ff9800',
    },
    hide: {
      display: 'none',
    },
    show: {
      display: 'inline-block',
    }
  };


  render() {
    function IngredientList(props) {
      let ingredients = props.ingredients;
      let missing = props.missing;
      //försöker sortra så att de ingredienser som saknas hamnar sists/först den lyckas flytta men inte tillräckligt bra
      //https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value-in-javascript
      let prev = ingredients[0].name;
      for(let i = 0; i<ingredients.length; i++){
          ingredients[i].missing=missing.indexOf(ingredients[i].name) > -1;
      }
      function compare(a,b) {
        if (a.missing && !b.missing)
          return 1;
        if (!a.missing && b.missing)
          return -1;
        return 0;
      }
      
      ingredients.sort(compare);

      let listItems;
        listItems = ingredients.map((ingredient, index) =>
        <div key={index}>
          <div className="col-xs-10">{ingredient.amount + " " + ingredient.unit +" "+ ingredient.name}</div>
          <div className="col-xs-2 add-shopingcart-btn">
          <IconButton onTouchTap={console.log("ADDED: " + ingredient.name)} >
          {ingredient.missing ? <AddIcon /> : <DoneIcon/>}
          </IconButton></div>
        </div>
        );
      

      //vid klick på add så ska ingrediensen läggas till i inköpslistan, behålla kopplingen till receptet för att kunna länka tillbaka/underlätta kvanitet
      return (
        <List>{listItems}</List>
      );
    }

    function IngredientDivider(props) {
      const render = props.render;
      if (render) {
        return (<Divider />);
      } else {
        return (<Divider className="hidden" />);
      }

    }
    //Ingredienserna ska visas på en progress component. Klickar man på den så ska man få se exakt vilka ingredienser som finns/saknas
    //Det ska visas under prograssbaren. Animeras ner. en rad per ingrediens där man kan välja "add uingredient"
    return (<div>
        <IngredientList ingredients={this.props.ingredients} missing={this.props.missing}/>
    </div>);
  }
}
export default Ingredientlist;