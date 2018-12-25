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
    mappedIngredients.sort((a, b) => a.missing - b.missing);

    const listItems = mappedIngredients.map((ingredient, index) => (
      <Grid item container xs={12} md={6} xl={4} key={`${ingredient.name}${index}`}>
        <Grid item className="add-shopingcart-btn">
          <IconButton onClick={() => { this.handleClick(ingredient); }}>
            {ingredient.missing ? <AddIcon /> : <DoneIcon />}
          </IconButton>
        </Grid>
        <Grid item className="ingredient-text">
          <Typography variant="body2">
            {(ingredient.amount ? `${ingredient.amount} ` : '') + (ingredient.unit ? `${ingredient.unit} ` : '') + ingredient.name}
          </Typography>
        </Grid>
      </Grid>
    ));

    return (
      <List><Grid container xs={12}>{listItems}</Grid></List>
    );
  }
}
Ingredientlist.propTypes = {
  ingredients: PropTypes.array.isRequired,
  missing: PropTypes.array.isRequired,
  handleAddItem: PropTypes.func.isRequired,

};
export default Ingredientlist;
