import React, { Component } from 'react';
import './ingredientProgress.css';
import IconButton from 'material-ui/IconButton';
import ShoppingBasketIcon from 'material-ui/svg-icons/action/shopping-basket';
import LinearProgress from 'material-ui/LinearProgress';
import FlatButton from 'material-ui/FlatButton';


class IngredientProgress extends Component {
  constructor(props) {
    super(props);
  }

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
    //Ingredienserna ska visas på en progress component. Klickar man på den så ska man få se exakt vilka ingredienser som finns/saknas
    //Det ska visas under prograssbaren. Animeras ner. en rad per ingrediens där man kan välja "add uingredient"
    return (<div>
<LinearProgress mode="determinate" value={progress} onTouchTap={this.props.toggleIngredientlist}/>
<FlatButton onTouchTap={this.props.toggleIngredientlist}
            target="_blank"
            label="Se ingredienser"
            className="recipecard-save-btn"
            secondary={true}
            icon={<ShoppingBasketIcon/>}
          />
    </div>);
  }
}
export default IngredientProgress;