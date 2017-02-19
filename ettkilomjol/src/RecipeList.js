import React, { Component } from 'react';
import './App.css'; //fixa en egen css för varje komponent?
import RecipeCard from './RecipeCard';


class RecipeList extends Component {
      constructor(props) {
    super(props);
    this.state = {
      recipeCards: this.props.recipeCards,
    };

  }

  filterIsEmpty(filter){
    if(filter.ingredients.length<1){
        return true;
    }
  }
runIngredientFilter(recipeIngredients, filterIngredients){
    let ingredientHits=0;
    for(let i =0; i<filterIngredients.length; i++){
        if(recipeIngredients.hasOwnProperty(filterIngredients[i])){
            ingredientHits++;
        }
    }
    return ingredientHits;
}
  runFilter(recipe, filter){ //gör denna smart, ska ta med alla som har det mesta antalet träffar
    //(om jag skriver in 3ingredienser men två receipt har två av dem så visa dessa två även om jag skirver in fler ingredienser)
    //lägg på någon sorts poäng på hur relevant träffen är? sedan sorteras det efter denna poäng?
    if(this.filterIsEmpty(filter)){
        return false;
    }

    let ingredientHits= this.runIngredientFilter(recipe.ingredients, filter.ingredients);

    return ingredientHits>0;
  }

  sortRecipeCards(a,b){
    //nångting är lite knasigt med sorteringen. den verkar frysa de som är höst upp och inte sortera om fullt ut?
     let filterIngredients= this.props.filter.ingredients;
        //return -1 om a är sämtre än b
        //return 1 om a är bättre än b
        //return 0 om de är lika
    let l = filterIngredients.lenght;
    let ingredientHitsA =0;
    let ingredientHitsB =0;
    for(let i =0; i<l; i++){
        if(a.hasOwnProperty(filterIngredients[i])){
            ingredientHitsA++;
        }
        if(b.hasOwnProperty(filterIngredients[i])){
            ingredientHitsB++;
        }
    }
    let aIngredients = Object.keys(a.ingredients).length;
    let bIngredients = Object.keys(b.ingredients).length;
    let missingA = aIngredients - ingredientHitsA;
    let missingB = bIngredients - ingredientHitsB;
    if(missingA===missingB){
        return bIngredients-aIngredients;
    }
    return missingA-missingB;
  }



  render() {

    let that = this;
    let recipes = [];
    let l=this.props.recipeCards.length;
    for(let i =0; i<l; i++){
        if(this.runFilter(this.props.recipeCards[i],this.props.filter)){
            recipes.push(this.props.recipeCards[i]);
        }
    }
    console.log("SORTING");
    recipes.sort(function(a,b){
        return that.sortRecipeCards(a,b);    
    });
    if(recipes.length>10){
        recipes.length=10;
    }



    console.log(recipes);
    
    return (<div>{recipes.map((recipe,index) =>
        <RecipeCard key={index} filter={this.props.filter}
                  recipe={recipe}/>
      )}</div>);
  }
}
export default RecipeList;
