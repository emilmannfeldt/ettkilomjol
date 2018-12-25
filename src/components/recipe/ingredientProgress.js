import React, { Component } from 'react';
import ShoppingBasketIcon from '@material-ui/icons/List';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';

class IngredientProgress extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    const { matchedIngredients, missingIngredients } = this.props;
    if (nextProps.matchedIngredients.length !== matchedIngredients.length) {
      return true;
    }
    if (nextProps.missingIngredients.length !== missingIngredients.length) {
      return true;
    }
    return false;
  }

  render() {
    const { matchedIngredients, missingIngredients, toggleIngredientlist } = this.props;
    const progress = matchedIngredients.length / (matchedIngredients.length + missingIngredients.length) * 100;
    return (
      <div>
        <LinearProgress variant="determinate" value={progress} onClick={toggleIngredientlist} />
        <Button
          onClick={toggleIngredientlist}
          color="primary"
          className="recipecard-expand-btn"
        >
          <ShoppingBasketIcon />
        Se ingredienser
        </Button>
      </div>
    );
  }
}
IngredientProgress.propTypes = {
  matchedIngredients: PropTypes.array.isRequired,
  missingIngredients: PropTypes.array.isRequired,
  toggleIngredientlist: PropTypes.func.isRequired,
};
export default IngredientProgress;
