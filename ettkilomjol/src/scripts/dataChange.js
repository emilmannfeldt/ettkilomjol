import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import * as firebase from 'firebase';
import IconButton from 'material-ui/IconButton';
import DashboardIcon from 'material-ui/svg-icons/action/dashboard';
import CodeIcon from 'material-ui/svg-icons/action/code';



const DIETARY = 0;
const DISHTYPE = 1;
const ORIGIN = 2;
const OTHER = 3;
let SORTEDUNITS = [];



class DataChange extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ipsum: 'Bacon ipsum dolor amet kielbasa beef porchetta tri-tip shank leberkas ham hock, beef ribs tenderloin bresaola sirloin corned beef doner. Shankle picanha ham hock jerky, shank pork loin ground round. Meatball brisket cow meatloaf short loin, leberkas frankfurter ground round boudin. Short ribs spare ribs hamburger biltong ham landjaeger, pig ham hock alcatra cow shank pork chop. Kielbasa andouille boudin swine bacon chicken flank doner sirloin pork salami capicola brisket tenderloin. Prosciutto meatloaf ham, sausage porchetta boudin spare ribs drumstick meatball frankfurter. Ham tail biltong, sausage cow rump strip steak pancetta sirloin frankfurter. Kielbasa leberkas spare ribs short loin prosciutto tri-tip. Leberkas jerky meatball cow corned beef brisket capicola andouille. Meatball biltong prosciutto, porchetta capicola kielbasa pastrami swine meatloaf turkey tri-tip. Bacon tail kevin, chicken pastrami kielbasa pancetta filet mignon tenderloin turducken alcatra. Pork belly beef pork chop, fatback swine short loin bresaola ground round jerky flank. Bacon pork belly short loin ground round strip steak sausage tri-tip tail pork chop chicken boudin shankle filet mignon jerky pig. Pancetta pork jowl salami bacon, meatloaf strip steak sausage alcatra boudin pork chop ham hock tail jerky tenderloin. Jowl chicken biltong kielbasa hamburger landjaeger beef doner jerky burgdoggen. Pork belly pig jerky meatloaf, shoulder andouille shank. Shank burgdoggen boudin venison ground round. Chuck swine venison, prosciutto ham pork turkey jerky alcatra. Short loin frankfurter salami tail pork loin. Ribeye bresaola corned beef ball tip strip steak venison rump. Jerky pork loin bacon ham kielbasa.',
    };
    this.runDataChange = this.runDataChange.bind(this);

  }

  runDataChange() {


    //firebase.database().ref("recipeCards").remove();
    //firebase.database().ref("recipes").remove();
    return;
    let recipesRef = firebase.database().ref("recipes");

    for (let i = 0; i < 1000; i++) {

      let recipe = {
        tags: {},

      };
      let recipeCard = {};

      recipe.title = this.getIpsum(Math.floor((Math.random() * 80) + 5));
      recipe.rating = Math.floor((Math.random() * 51) + 0) / 10;
      recipe.votes = Math.floor((Math.random() * 20) + 0);
      recipe.image = this.getImage();
      recipe.preptime = this.getPrepTime();
      recipe.baketime = Math.floor((Math.random() * 120) + 1);
      recipe.resttime = this.getRestTime();
      recipe.creator = Math.floor((Math.random() * 2) + 1) === 3 ? "system" : "system";
      recipe.created = firebase.database.ServerValue.TIMESTAMP;
      recipe.quote = this.getQuote();
      recipe.dietary = this.getDietaryTags();
      recipe.tags = this.getOtherTags();
      recipe.origin = this.getOriginTag();
      recipe.dishtype = this.getDishtypeTag();
      recipe.ingredients = this.getIngredients();
      recipe.instructions = this.getInstructions(recipe.ingredients);
      recipe.comments = this.getComments(recipe.votes);
      recipe.level = this.getLevel(recipe);


      //varför blir det knasiga object när jag sätter properties innifrån firebase .then? hur ska jag göra?
      //det har med tiden att göra. Jag måste sätta variabler direkt. All data från databasen jag behöver får jag skicka in hit som props. sen vid klick använder jag popsen, då är det klara.
      //en prop.tags, prop.foods prop.users, prop.units.

      recipeCard.title = recipe.title;
      recipeCard.image = recipe.image;
      recipeCard.level = recipe.level;
      recipeCard.rating = recipe.rating;
      recipeCard.time = recipe.preptime + recipe.baketime + recipe.resttime;
      recipeCard.tags = this.getTags(recipe);
      recipeCard.ingredients = this.copyIngredients(recipe.ingredients);//problem de blir inte riktiga boject av recipe.tags etc?
      // recipeCard.ingredients = this.getFoods(); // skapa det i recipe först och sedan ta namnet in här bara.
      // recipeCard.recipeId = newPostKey;
      // console.log(recipe);
      // console.log(recipeCard);
      //testa firebase, tomma properties kommer de sparas ändå?



      let newKey = recipesRef.push().key;
      recipeCard.recipeId = newKey;
      firebase.database().ref("recipes/" + newKey).set(recipe);

      console.log(newKey);
      firebase.database().ref("recipeCards/" + newKey).set(recipeCard);
      //fungerar men lite konstigt. timestamp på commentarer fugnerar intealls.
      //kommentarer samt recieppart på ingredienser finns inte? recipepart saknas på instructions ockås.
      //jag har githubpages men det fungerar inte med firebase verkar det som??+


    }

  }
  getImage() {
    let images = ["http://i.imgur.com/bnk9xiJ.jpg", "http://i.imgur.com/9vdMMbi.jpg", "http://i.imgur.com/Sd7mc16.jpg", "http://i.imgur.com/zQhbkgg.jpg", "http://i.imgur.com/kia9DQ0.jpg", "http://i.imgur.com/QQWAL3n.jpg",
      "http://i.imgur.com/LXn8wNr.jpg", "http://i.imgur.com/8JBzKgf.jpg", "http://i.imgur.com/k7wSrvS.jpg", "http://i.imgur.com/2DgWs7j.jpg", "http://i.imgur.com/wZg9kZZ.jpg", "http://i.imgur.com/TEV8CT3.jpg",
      "http://i.imgur.com/IbQMQ1C.jpg", "http://i.imgur.com/cZaSjfy.jpg", "http://i.imgur.com/v5eBDLa.jpg", "http://i.imgur.com/0XhVlLB.jpg", "http://i.imgur.com/sb1iHC0.jpg", "http://i.imgur.com/PVIFzlX.jpg", "http://i.imgur.com/SsnG1el.jpg?1",
      "http://i.imgur.com/AgOTYu5.jpg", "http://i.imgur.com/44yh9WB.jpg", "http://i.imgur.com/27exWsc.jpg", "http://i.imgur.com/uxO0SJK.jpg"];
    return images[Math.floor((Math.random() * images.length) + 0)];

  }
  getInstructions(ingredients) {
    let instructions = [];
    let nrOfInstructions = Math.floor((Math.random() * 20) + 1);
    if (nrOfInstructions > 14) {
      nrOfInstructions = Math.floor((Math.random() * 20) + 1);
    }
    for (let i = 0; i < nrOfInstructions; i++) {
      let instruction = {};
      instruction.instruction = this.getIpsum(Math.floor((Math.random() * 30) + 3));
      for (let j = 0; j < instruction.instruction.length; j++) {
        if (Math.floor((Math.random() * 25) + 1) === 2) {
          instruction.instruction = instruction.instruction.slice(0, j) + " " + ingredients[Math.floor((Math.random() * ingredients.length) + 0)].name + " " + instruction.instruction.slice(j);
        }
      }
      instruction.order = i;
      let recipeParts = [];
      for (let j = 0; j < ingredients.length; j++) {
        if (ingredients[j].hasOwnProperty("recipePart")) {
          recipeParts.push(ingredients[j].recipePart);
        }
      }
      for (let j = 0; j < recipeParts.length; j++) {
        if (Math.floor((Math.random() * 2) + 1) === 1) {
          instruction.recipePart = recipeParts[j];

          break;
        }
        if (j + 1 === recipeParts.length) {
          //sista loopen
          if (Math.floor((Math.random() * 3) + 1) === 1) {
            instruction.recipePart = "instruktion för potatismos";

            break;
          }
        }
      }
      instructions.push(instruction);
    }
    return instructions;
  }

  getComments(votes) {

    let comments = [];
    if (Math.floor((Math.random() * 2) + 1) === 1) {
      return comments;
    }
    for (let i = 0; i < votes; i++) {
      let comment = {};
      comment.rating = Math.floor((Math.random() * 6) + 0);
      comment.comment = this.getIpsum(Math.floor((Math.random() * 50) + 5));
      comment.timestamp = firebase.database.ServerValue.TIMESTAMP;
      comment.user = this.getRandomUser();
      comments.push(comment);
    }
    return comments;

  }

  getQuote() {
    if (Math.floor((Math.random() * 2) + 1)) {
      return null;
    }
    return this.state.ipsum.substring(0, Math.floor((Math.random() * 60) + 5));

  }

  getRestTime() {
    if (Math.floor((Math.random() * 2) + 1)) {
      return 0;
    }
    return Math.floor((Math.random() * 60) + 0);
  }

  getPrepTime() {
    if (Math.floor((Math.random() * 2) + 1)) {
      return 0;
    }
    return Math.floor((Math.random() * 60) + 0);
  }

  getIpsum(index) {
    return this.state.ipsum.substring(0, index * 5);
  }
  getLevel(recipe) {
    // let creatorLevel = Math.floor((Math.random() * 5) + 1); //lägg till användarens uppskattning och väg det högt
    //tyo creatorlevel*20
    //i min testdata har jag många svåra recept, jhag har taggat ner level lite för att få några lätta ändå
    let nrOfInstructions = recipe.instructions.length;
    let nrOfIngredients = recipe.ingredients.length;
    let instructionLength = 0;
    let skillTime = recipe.baketime + recipe.preptime;
    for (let i = 0; i < nrOfInstructions; i++) {
      instructionLength = instructionLength + recipe.instructions[i].instruction.length;
    }
    instructionLength = instructionLength - nrOfInstructions * 10;

    let levelIndex = skillTime / 6 + (nrOfIngredients * 8) + (instructionLength / 14);
    if (levelIndex < 100) {
      return 'lätt';
    }
    if (levelIndex < 200) {
      return 'medel';
    }
    return 'svår';
  }

  getDietaryTags() {
    let dietry = {};
    let dietaryDb = this.props.tags[DIETARY];
    if (Math.floor((Math.random() * 5) + 1) === 1) {
      return dietry;
    }
    for (let tag in dietaryDb) {
      if (Math.floor((Math.random() * 4) + 1) === 3) {
        dietry[tag] = dietaryDb[tag];
      }
    }
    return dietry;
  }

  getOtherTags() {
    let other = {};
    let otherDb = this.props.tags[OTHER];
    if (Math.floor((Math.random() * 5) + 1) === 1) {
      return other;
    }
    for (let tag in otherDb) {
      if (Math.floor((Math.random() * 4) + 1) === 3) {
        other[tag] = otherDb[tag];
      }
    }
    return other;
  }
  getDishtypeTag() {
    let dishtype = {};
    let dishtypeDb = this.props.tags[DISHTYPE];
    if (Math.floor((Math.random() * 5) + 1) === 1) {
      return dishtype;
    }
    for (let tag in dishtypeDb) {
      if (Math.floor((Math.random() * 4) + 1) === 3) {
        dishtype[tag] = dishtypeDb[tag];
        if (Math.floor((Math.random() * 2) + 1) === 1) {
          break;
        }
      }
    }
    return dishtype;
  }

  getOriginTag() {

    let origin = {};
    let originDb = this.props.tags[ORIGIN];
    if (Math.floor((Math.random() * 10) + 1) === 1) {
      return origin;
    }
    for (let tag in originDb) {
      if (Math.floor((Math.random() * 3) + 1) === 3) {
        origin[tag] = originDb[tag];
        if (Math.floor((Math.random() * 2) + 1) === 1) {
          break;
        }
      }
    }
    return origin;
  }

  getIngredients() {
    let ingredients = [];
    let nrOfIngredients = Math.floor((Math.random() * 12) + 1);
    let foods = [];
    for (let i = 0; i < nrOfIngredients; i++) {
      let ingredient = {};
      let food = this.props.foods[Math.floor((Math.random() * this.props.foods.length) + 0)];

      if (foods.indexOf(food) > -1) {
        continue;
      }
      ingredient.name = food;
      if (Math.floor((Math.random() * 5) + 1) > 2) {
        ingredient.amount = Math.floor((Math.random() * 100) + 1) / 10;
        ingredient.unit = this.getRandomUnit().name;
        if (ingredient.unit === 'g') {
          ingredient.amount = ingredient.amount * 10;
        }
        ingredient = this.checkUnit(ingredient);
      }

      foods.push(food);
      ingredients.push(ingredient);
    }
    if (Math.floor((Math.random() * 3) + 1) === 3) {
      for (let j = 0; j < ingredients.length; j++) {
        if (Math.floor((Math.random() * 2) + 1) === 1) {
          let start = Math.floor((Math.random() * 200) + 0);
          ingredients[j].recipePart = this.state.ipsum.substring(start, Math.floor((Math.random() * 15) + start + 5));

        }
      }
    }
    if (Math.floor((Math.random() * 3) + 1) === 3) {
      for (let j = 0; j < ingredients.length; j++) {
        if (Math.floor((Math.random() * 2) + 1) === 1) {
          ingredients[j].comment = "tvättade";
        }
      }
    }

    return ingredients;
  }

  getRandomUnit() {
    let unitType = this.props.units[Math.floor((Math.random() * 2) + 0)];
    let keys = Object.keys(unitType);
    let unit = unitType[keys[keys.length * Math.random() << 0]];
    return unit;

  }
  getRandomUser() {
    let user = this.props.users[Math.floor((Math.random() * this.props.users.length) + 0)];
    return user.username;
  }

  //för över de olika tagsen från recipe obj
  getTags(recipe) {
    let tags = {};

    for (let prop in recipe.dietary) {

      if (recipe.dietary.hasOwnProperty(prop)) {

        tags[prop] = recipe.dietary[prop];
      }
    }

    for (let prop in recipe.dishtype) {

      if (recipe.dishtype.hasOwnProperty(prop)) {

        tags[prop] = recipe.dishtype[prop];
      }
    }

    for (let prop in recipe.tags) {

      if (recipe.tags.hasOwnProperty(prop)) {

        tags[prop] = recipe.tags[prop];
      }
    }

    for (let prop in recipe.origin) {

      if (recipe.origin.hasOwnProperty(prop)) {

        tags[prop] = recipe.origin[prop];
      }

    }
    return tags;

  }
  copyIngredients(recipeIngredients) {
    let ingredients = {};
    for (let i = 0; i < recipeIngredients.length; i++) {
      ingredients[recipeIngredients[i].name] = true;
    }
    return ingredients;
  }

  getFoods() {
    let ingredients = {};
    let foodsRef = firebase.database().ref("foods");
    let nrOfIngredients = Math.floor((Math.random() * 20) + 1);
    foodsRef.once("value")
      .then(function (snapshot) {
        let nrOfFoods = snapshot.numChildren();
        let foodsToAdd = [];
        let currentFoodNr = 0;
        for (let i = 0; i < nrOfIngredients; i++) {
          let foodToAdd = Math.floor((Math.random() * nrOfFoods) + 0);
          if (!(foodsToAdd.indexOf(foodToAdd) > -1)) {
            foodsToAdd.push(Math.floor((Math.random() * nrOfFoods) + 0));
          }
        }
        snapshot.forEach(function (childSnapshot) {
          let food = childSnapshot.val();

          if (foodsToAdd.indexOf(currentFoodNr) > -1) {
            ingredients[food.name] = true;
          }

          currentFoodNr += 1;
        });
      });
    return ingredients;
  }

  findLowerUnit(ingredient, selectedUnit) {
    let selectedRef = ingredient.amount * selectedUnit.ref;
    let finalIngredient = ingredient;
    let newUnit;
    let unitsIndex;
    if (selectedUnit.type === 'volume') {
      unitsIndex = 0;
    } else if (selectedUnit.type === 'weight') {
      unitsIndex = 1;
    }
    for (let unit in this.props.units[unitsIndex]) {
      let curUnit = this.props.units[unitsIndex][unit];
      if ((selectedRef / curUnit.ref < curUnit.max)) {
        newUnit = curUnit;
        break;
      }
    }
    finalIngredient.amount = selectedRef / newUnit.ref;
    finalIngredient.unit = newUnit.name;
    return finalIngredient;
  }


  findHigherUnit(ingredient, selectedUnit) {
    let selectedRef = ingredient.amount * selectedUnit.ref;
    let finalIngredient = ingredient;
    let newUnit;
    let unitsIndex;
    if (selectedUnit.type === 'volume') {
      unitsIndex = 0;
    } else if (selectedUnit.type === 'weight') {
      unitsIndex = 1;
    }
    for (let unit in this.props.units[unitsIndex]) {
      let curUnit = this.props.units[unitsIndex][unit];
      if ((selectedRef / curUnit.ref < curUnit.max)) {
        newUnit = curUnit;
        break;
      }
    }
    finalIngredient.amount = selectedRef / newUnit.ref;
    finalIngredient.unit = newUnit.name;
    return finalIngredient;
  }

  checkUnit(ingredient) { //fortfarande lite konstigt här. det går att få resultat som 0.2kg, 5.25tsk
    let foundUnit = {};
    for (let i = 0; i < this.props.units.length; i++) {
      for (let unit in this.props.units[this.props.units[i]]) {
        let curUnit = this.props.units[this.props.units[i]][unit];
        if (curUnit.name === ingredient.unit) {
          foundUnit = curUnit;
        }
      }
    }
    if (ingredient.amount >= foundUnit.max) {
      ingredient = this.findHigherUnit(ingredient, foundUnit);
    }
    else if (ingredient.amount <= foundUnit.min) {
      ingredient = this.findLowerUnit(ingredient, foundUnit);
    }
    //här använder jag även lib fraction.js för att hantera decimaler till bråkdelar
    //avrunda till närmsta 1/16 del? 0.0625 
    //http://stackoverflow.com/questions/1506554/how-to-round-a-decimal-to-the-nearest-fraction
    //if decimaler finns så fixa fractions istället. 1/16 är det lägsta
    ingredient.amount = this.closestDecimals(ingredient.amount);
    return ingredient;
  }
  closestDecimals(num) {
    let arr;
    num = num.toFixed(3);
    if (num > 1) {
      arr = [0, 0.25, 0.33, 0.5, 0.66, 0.75];
    } else {
      arr = [0, 0.2, 0.25, 0.33, 0.4, 0.5, 0.6, 0.66, 0.75, 0.8];
    }
    let decimal = num - (Math.floor(num));
    var curr = arr[0];
    var diff = Math.abs(decimal - curr);
    for (var val = 0; val < arr.length; val++) {
      var newdiff = Math.abs(decimal - arr[val]);
      if (newdiff < diff) {
        diff = newdiff;
        curr = arr[val];
      }
    }
    return num - decimal + curr;
  }



  render() {

    return (
      <div>

        <a href="https://tree.taiga.io/project/ettkilomjol-ett-kilo-mjol/">
          <IconButton tooltip="Project backlog">
            <DashboardIcon />
          </IconButton>
        </a>
        <a href="https://github.com/emilmannfeldt/ettkilomjol">
          <IconButton tooltip="gitHub">
            <CodeIcon />
          </IconButton>
        </a>

        <RaisedButton label="Run datachange" secondary={true} onTouchTap={this.runDataChange} />
      </div>
    );
  }
}
export default DataChange;
