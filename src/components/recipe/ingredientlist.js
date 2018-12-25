/* eslint react/no-array-index-key: 0 */
import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/AddShoppingCart';
import DoneIcon from '@material-ui/icons/ShoppingCartOutlined';
import List from '@material-ui/core/List';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';


class Ingredientlist extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(ingredient) {
    const { handleAddItem } = this.props;
    handleAddItem(null, [ingredient]);
  }

  render() {
    const { ingredients, missing } = this.props;
    const mappedIngredients = ingredients.map(x => ({ ...x, missing: missing.includes(x.name) }));
    // for (let i = 0; i < ingredients.length; i++) {
    //   ingredients[i].missing = missing.indexOf(ingredients[i].name) > -1;
    // }
    mappedIngredients.sort((a, b) => a.missing - b.missing);

    const listItems = mappedIngredients.map((ingredient, index) => (
      <Grid item container key={`${ingredient.name}${index}`}>
        <Grid item xs={10} className="ingredient-text">
          <Typography variant="body2">
            {(ingredient.amount ? `${ingredient.amount} ` : '') + (ingredient.unit ? `${ingredient.unit} ` : '') + ingredient.name}
          </Typography>
        </Grid>
        <Grid item xs={2} className="add-shopingcart-btn">
          <IconButton onClick={() => { this.handleClick(ingredient); }}>
            {ingredient.missing ? <AddIcon /> : <DoneIcon />}
          </IconButton>
        </Grid>
      </Grid>
    ));

    return (
      <List>{listItems}</List>
    );
  }
}
Ingredientlist.propTypes = {
  ingredients: PropTypes.array.isRequired,
  missing: PropTypes.array.isRequired,
  handleAddItem: PropTypes.func.isRequired,

};
export default Ingredientlist;
