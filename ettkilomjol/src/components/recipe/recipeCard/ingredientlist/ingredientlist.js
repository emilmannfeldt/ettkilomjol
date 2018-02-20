import React, { Component } from 'react';
import './ingredientlist.css';
import Badge from 'material-ui/Badge';
import IconButton from 'material-ui/IconButton';
import ShoppingBasketIcon from 'material-ui/svg-icons/action/shopping-basket';
import RestaurantMenuIcon from 'material-ui/svg-icons/maps/restaurant-menu';
import AddIcon from 'material-ui/svg-icons/content/add';
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

    //Ingredienserna ska visas på en progress component. Klickar man på den så ska man få se exakt vilka ingredienser som finns/saknas
    //Det ska visas under prograssbaren. Animeras ner. en rad per ingrediens där man kan välja "add uingredient"
    return (<div style={this.styles.wrapper}>
      <div className="col-xs-4">{this.props.ingredients[0].amount}</div>
      <div className="col-xs-4">{this.props.ingredients[0].unit}</div>
      <div className="col-xs-4">{this.props.ingredients[0].name}</div>
      <IconButton onTouchTap={console.log("ADDED: " + this.props.ingredients[0].name)} ><AddIcon /></IconButton>
    </div>);
  }
}
export default Ingredientlist;