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







    //klick på bild eller titel ska vara vägen in till recipe. antingen länk till ny sida (routing) eller så fälls en detailvy ut.
    //skapa recept kan också vara routing/modalt fönster/formuilär fälls ut.
    //mer som ska till recipecard: betyg, tidsåtgång, lägg till i favoriter (koket.se hjärta). 
    //
    return ( <div className="col-lg-4 col-md-4 col-sm-4 col-xs-6 list-item" style={this.styles.wrapper}> <Card className="recipecard-content" style={this.styles.recipeCard}>
                <div className="recipe-card-image">
                <img src={this.props.recipe.image}/>
                </div>
                <CardText className="recipe-card-info">
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
