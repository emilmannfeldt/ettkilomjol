import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/AddShoppingCart';
import DoneIcon from '@material-ui/icons/ShoppingCartOutlined';
import { List } from 'material-ui/List';

class Ingredientlist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(ingredient) {
    this.props.handleAddItem(null, [ingredient]);
  }

  render() {
    let ingredients = this.props.ingredients;
    let missing = this.props.missing;
    for (let i = 0; i < ingredients.length; i++) {
      ingredients[i].missing = missing.indexOf(ingredients[i].name) > -1;
    }
    function compare(a, b) {
      if (a.missing && !b.missing) {
        return 1;
      }
      if (!a.missing && b.missing) {
        return -1;
      }
      return 0;
    }

    ingredients.sort(compare);

    let listItems;
    listItems = ingredients.map((ingredient, index) =>
      <div key={ingredient.name + index}>
        <div className="col-xs-10 no-gutter ingredient-text">{(ingredient.amount ? ingredient.amount + " " : "") + (ingredient.unit ? ingredient.unit + " " : "") + ingredient.name}</div>
        <div className="col-xs-2 no-gutter add-shopingcart-btn">
          <IconButton onClick={() => { this.handleClick(ingredient) }}>
            {ingredient.missing ? <AddIcon /> : <DoneIcon />}
          </IconButton></div>
      </div>
    );

    return (
      <List>{listItems}</List>
    );

  }
}
export default Ingredientlist;