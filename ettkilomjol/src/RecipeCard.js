import React, { Component } from 'react';
import './App.css'; //fixa en egen css för varje komponent?
import IngredientTag from './IngredientTag';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';




class RecipeCard extends Component {
      constructor(props) {
    super(props);
  }

  styles = {
    recipeCard: {
      margin: 4,
     
    },
    wrapper: {

    },
    title:{
      fontSize: 14,
      lineHeight:1
    }
  };
  render() {

    let matchedIngredients = [];
    let missingIngredients = [];
    for (let property in this.props.recipe.ingredients) {
        if (this.props.recipe.ingredients.hasOwnProperty(property)) {
            if(this.props.filter.ingredients.indexOf(property)>-1){
                matchedIngredients.push(property);
            }else{
                missingIngredients.push(property);
            }
        }
    }
    //snygga till lite här. skulle även behöva filter för att styla cardet utefter matchande ingredienser, skriva hur många/vilka som matchade i cardet
    //koll på material ui cards. 
    //efter att ajg fått till en hyfsad presentation här så ska jag gå på skapandet av egna recept. Innan den fulla recepy vyn. Behöver kanske routing till både skapa och visa vyerna?
    //dra ner på storleken, responsiv, margins, 
    //skapa component för att visa filtertagar, RecipeCardTagChip döp om andra till REcipeCardIngredientChip

    //det är bara en tag som skrivs ut. matchedIngredient har bara en length på 1 fast det finns fler?? ja det är felet
    // ös på med bootstrap

    //mindksa ner titeln line-height och fontsize lite. snygga till ingredient-tag. kolla på koket.se m.m. efter snygga kort

    return ( <div className="col-lg-4 col-md-4 col-sm-4 col-xs-6 list-item" style={this.styles.wrapper}> <Card style={this.styles.recipeCard}>
               
                <img src={this.props.recipe.image} className="recipe-card-image"/>
                <CardText>
                <div className="recipecard-title">{this.props.recipe.title} </div>
                
          <IngredientTag
                  matchedIngredients={matchedIngredients} missingIngredients={missingIngredients}/>
                </CardText>
              </Card>
              </div>
);
  }
}
export default RecipeCard;
