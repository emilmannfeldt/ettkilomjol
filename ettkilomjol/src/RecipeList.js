import React, { Component } from 'react';
import './App.css'; //fixa en egen css för varje komponent?


class RecipeList extends Component {
  render() {
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
    return (<div>recipeList</div>);
  }
}
export default RecipeList;
