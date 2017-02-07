import React, { Component } from 'react';
import './App.css'; //fixa en egen css för varje komponent?
import RecipeCard from './RecipeCard';


class RecipeList extends Component {
      constructor(props) {
    super(props);

  }

  // filterIsEmpty(filter){
  //   if(filter.ingredients.length<1){
  //       return true;
  //   }
  // }
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
    // if(this.filterIsEmpty(filter)){
    //     return false;
    // }

    let ingredientHits= this.runIngredientFilter(recipe.ingredients, filter.ingredients);

    return ingredientHits===filter.ingredients.length;
  }



  render() {


    let recipes = [];
    for(let i =0; i<this.props.recipeCards.length; i++){
        if(this.runFilter(this.props.recipeCards[i],this.props.filter)){
            recipes.push(this.props.recipeCards[i]);
        }
    }
    if(this.props.recipeCards.length===recipes.length){
        //inget filter finns, eller inget har fitlrerats bort rättare sagt.
        recipes = [];
    }
    console.log(recipes);

    // här i render ska jag använda propsen för att filtrera fram och sortera de mest relevanta recepten efter någon algoritm. 
    // sedan ska jag skriva ut ett RecipeCard component för varje. ATT TÄNKA PÅ. 
    // det är listan med minimalla infon jag ska fitlrera på och skicka till recipeCard. sen i Recipe card ska länken gå till fulla versionen
    //börja knåpa på scripta in testdata recipe och recipeCards
    // om bandbrädden börjar dra mycket får jag kolla över det med att spara datat i sessionen eller coockies 
    //Set
    // localStorage.setItem("lastname", "Smith");

    //Get
    // var lastName = localStorage.getItem("lastname");

    // var testObject = { 'one': 1, 'two': 2, 'three': 3 };
//React.findDOMNode(this.refs.myInput)
// Put the object into storage
// localStorage.setItem('testObject', JSON.stringify(testObject));

// Retrieve the object from storage
// var retrievedObject = localStorage.getItem('testObject');

// console.log('retrievedObject: ', JSON.parse(retrievedObject));
//https://jsfiddle.net/kyanny/1guv5g4w/
//jag kan spara alla ingredienser + receipt lokalt. ladda om/lägg till i local store om användaren skapar nytt recept.
//lokalstore ska hålla en dag typ. annars missar man nyligen tillagda recept.

    return (<div>{recipes.map((recipe,index) =>
        <RecipeCard key={index}
                  recipe={recipe}/>
      )}</div>);
  }
}
export default RecipeList;
