import React, { Component } from 'react';
import './App.css'; //fixa en egen css för varje komponent?


class RecipeCard extends Component {
      constructor(props) {
    super(props);

  }


  render() {
    //snygga till lite här. skulle även behöva filter för att styla cardet utefter matchande ingredienser, skriva hur många/vilka som matchade i cardet
    //koll på material ui cards. 
    //efter att ajg fått till en hyfsad presentation här så ska jag gå på skapandet av egna recept. Innan den fulla recepy vyn. Behöver kanske routing till både skapa och visa vyerna?
    return (<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">{this.props.recipe.title}</div>);
  }
}
export default RecipeCard;
