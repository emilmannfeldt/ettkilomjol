import React, { Component } from 'react';
import ShoppingBasketIcon from 'material-ui/svg-icons/action/shopping-basket';
import LinearProgress from 'material-ui/LinearProgress';
import FlatButton from 'material-ui/FlatButton';

class IngredientProgress extends Component {
  handleTouchTap = (event) => {
    event.preventDefault();
    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  };

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };

  render() {
    let progress = this.props.matchedIngredients.length / (this.props.matchedIngredients.length + this.props.missingIngredients.length) * 100;
    return (<div>
      <LinearProgress mode="determinate" value={progress} onClick={this.props.toggleIngredientlist} />
      <FlatButton onClick={this.props.toggleIngredientlist}
        target="_blank"
        label="Se ingredienser"
        className="recipecard-expand-btn"
        primary={true}
        icon={<ShoppingBasketIcon />}
      />
    </div>);
  }
}
export default IngredientProgress;