import React, { Component } from 'react';
import './App.css'; //fixa en egen css för varje komponent?
import Badge from 'material-ui/Badge';
import IconButton from 'material-ui/IconButton';
import ShoppingBasketIcon from 'material-ui/svg-icons/action/shopping-basket';
import Popover from 'material-ui/Popover';
import Divider from 'material-ui/Divider';
import {List, ListItem} from 'material-ui/List';




class IngredientTag extends Component {
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
    badge:{
      top: 4,
      right: 4,
      fontSize: 10,
      width: 28,
      height: 28,
    },
  };


  handleTouchTap = (event) => {
    console.log("clicked");
    console.log(this.props.missingIngredients);
    console.log(this.props.matchedIngredients);
    // This prevents ghost click.
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
      function IngredientList(props) {
    const ingredients = props.ingredients;
    const listItems = ingredients.map((ingredient, index) =>
      <ListItem key={index} primaryText={ingredient} />
    );
    return (
      <List>{listItems}</List>
    );
  }
    return (<div style={this.styles.wrapper}>
                  <Badge className="ingredient-badge"
                    badgeContent={this.props.matchedIngredients.length+'/'+(this.props.matchedIngredients.length+this.props.missingIngredients.length)}
                    secondary={true}
                    badgeStyle={this.styles.badge}>
                    <IconButton onTouchTap={ this.handleTouchTap } >
                      <ShoppingBasketIcon />
                    </IconButton>
                    <Popover
                      open={this.state.open}
                      anchorEl={this.state.anchorEl}
                      anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                      targetOrigin={{horizontal: 'left', vertical: 'top'}}
                      onRequestClose={this.handleRequestClose}>
                        <div className="matched-ingredients-list">
                          <IngredientList ingredients={this.props.matchedIngredients}/>
                        </div>
                        <Divider />
                        <div className="missing-ingredients-list">
                         <IngredientList ingredients={this.props.missingIngredients}/>
                        </div>
                    </Popover>
                  </Badge>
            </div>);
  }
}
export default IngredientTag;
