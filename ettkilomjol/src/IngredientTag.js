import React, { Component } from 'react';
import './App.css'; //fixa en egen css för varje komponent?
import Badge from 'material-ui/Badge';
import IconButton from 'material-ui/IconButton';
import ShoppingBasketIcon from 'material-ui/svg-icons/action/shopping-basket';
import RestaurantMenuIcon from 'material-ui/svg-icons/maps/restaurant-menu';
import AddIcon from 'material-ui/svg-icons/content/add';
import Popover from 'material-ui/Popover';
import Divider from 'material-ui/Divider';
import { List, ListItem } from 'material-ui/List';




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
    }
  };


  handleTouchTap = (event) => {
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
        const matched = props.matched;
        if (ingredients.length < 1) {
          return (<List className="hidden"/>);
        }
        let listItems;
        if (matched) {
          listItems = ingredients.map((ingredient, index) =>
            <ListItem key={index} primaryText={ingredient} />
          );
        }
        else {
          listItems = ingredients.map((ingredient, index) =>
              <ListItem key={index} primaryText={ingredient} rightIconButton={<IconButton onTouchTap={console.log("ADDED: " +{ingredient})} ><AddIcon /></IconButton>} />
          );
        }
        //vid klick på add så ska ingrediensen läggas till i inköpslistan, behålla kopplingen till receptet för att kunna länka tillbaka/underlätta kvanitet
     
        return (
          <List>{listItems}</List>
        );

      }

    
      function IngredientDivider(props) {
      const render = props.render;
      if (render) {
        return(<Divider />);
      }else{
        return (<Divider className="hidden"/>);
      }
    
  }
    return (<div style={this.styles.wrapper}>
                  <Badge className="ingredient-badge"
                    badgeContent={this.props.matchedIngredients.length+'/'+(this.props.matchedIngredients.length+this.props.missingIngredients.length)}
                    primary={true}
                    badgeStyle={this.styles.badge}>
                    <IconButton onTouchTap={ this.handleTouchTap} style={this.props.missingIngredients.length === 0 ? this.styles.hide : ''}>
                      <ShoppingBasketIcon />
                    </IconButton>
                    <IconButton onTouchTap={ this.handleTouchTap} style={this.props.missingIngredients.length === 0 ? '' : this.styles.hide}>
                      <RestaurantMenuIcon />
                    </IconButton>
                    <Popover
                      open={this.state.open}
                      anchorEl={this.state.anchorEl}
                      anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                      targetOrigin={{horizontal: 'left', vertical: 'top'}}
                      onRequestClose={this.handleRequestClose}>
                        <div className="matched-ingredients-list">
                          <IngredientList ingredients={this.props.matchedIngredients} matched={true}/>
                        </div>
                        <IngredientDivider render={this.props.matchedIngredients.length > 0 && this.props.missingIngredients.length > 0}/>
                        <div className="missing-ingredients-list">
                         <IngredientList ingredients={this.props.missingIngredients} matched={false}/>

                        </div>
                    </Popover>
                  </Badge>
            </div>);
  }
}
export default IngredientTag;
