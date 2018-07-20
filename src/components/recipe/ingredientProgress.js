import React, { Component } from 'react';
import ShoppingBasketIcon from '@material-ui/icons/List';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';

class IngredientProgress extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.matchedIngredients.length !== this.props.matchedIngredients.length) {
      return true;
    }
    if (nextProps.missingIngredients.length !== this.props.missingIngredients.length) {
      return true;
    }
    return false;
  }
  render() {
    let progress = this.props.matchedIngredients.length / (this.props.matchedIngredients.length + this.props.missingIngredients.length) * 100;
    return (<div>
      <LinearProgress variant="determinate" value={progress} onClick={this.props.toggleIngredientlist} />
      <Button onClick={this.props.toggleIngredientlist}
        color="primary"
        className="recipecard-expand-btn">
        <ShoppingBasketIcon />
        Se ingredienser
      </Button>
    </div>);
  }
}
export default IngredientProgress;