var firebase = require('firebase');
var fs = require('fs');

let config = {
  apiKey: "AIzaSyAPoXwInGdHakbqWzlhH62qSRBSxljMNn8",
  authDomain: "ettkilomjol-10ed1.firebaseapp.com",
  databaseURL: "https://ettkilomjol-10ed1.firebaseio.com",
  storageBucket: "ettkilomjol-10ed1.appspot.com",
  messagingSenderId: "1028199106361"
};
firebase.initializeApp(config);
let recipesRef = firebase.database().ref("recipes");
let foodRef = firebase.database().ref("foods");
let tagRef = firebase.database().ref("tags");
var fs = require('fs');
let existingFoods = [];
let existingTags = [];
let filename = "countingrecpie";
let log = [];
let foodLoaded = false;
let tagLoaded = false;
firebase.auth().signInAnonymously().catch(function (error) { });
firebase.auth().onAuthStateChanged(function (user) {
  console.log("start");
  if (user) {
    foodRef.orderByChild("uses").once("value", function (snapshot) {
      console.log("startfood");

      snapshot.forEach(function (child) {
        if (child.val().uses == 0) {
          existingFoods.splice(0, 0, child.val().name);
        }
      });
      console.log("fooddone");

      foodLoaded = true;
      if (foodLoaded && tagLoaded) {
        runRecipes();
      }
    });
    tagRef.orderByChild("uses").once("value", function (snapshot) {
      console.log("tagstart");

      snapshot.forEach(function (child) {
        existingTags.splice(0, 0, child.val().name);
      });
      console.log("tagdone");

      tagLoaded = true;
      if (foodLoaded && tagLoaded) {
        runRecipes();
      }
    });
  }
});

function runRecipes() {
  //script för att  hitta alla recept som har någon ingrediens med ett visst antal uses
  let namel = 0;
  let numberRec = 0;
  recipesRef.once('value', function (snapshot) {
    console.log("receipes hämtade");
    snapshot.forEach(function (child) {
      let busted = false;
      let recipe = child.val();
      let changesmade = false;
      console.log("recipe running:" + recipe.source);
      for (let i = 0; i < recipe.ingredients.length; i++) {
        let ingredient = recipe.ingredients[i];
        if (ingredient.name.startsWith("Förp ") && (!ingredient.unit || ingredient.unit === "st")) {
          log.push("ingred changed from:" + ingredient.unit + ingredient.name);
          recipe.ingredients[i].name = ingredient.name.substring(5).trim();
          recipe.ingredients[i].name = recipe.ingredients[i].name.charAt(0).toUpperCase() + recipe.ingredients[i].name.slice(1);
          recipe.ingredients[i].unit = "förp";
          changesmade = true;
          log.push("to:" + recipe.ingredients[i].unit + " " + recipe.ingredients[i].name + "source:" + recipe.source);
        } else if (ingredient.name.startsWith("Port ")) {
          log.push("ingred changed from:" + ingredient.unit + ingredient.name);
          recipe.ingredients[i].name = ingredient.name.substring(5).trim();
          recipe.ingredients[i].name = recipe.ingredients[i].name.charAt(0).toUpperCase() + recipe.ingredients[i].name.slice(1);
          recipe.ingredients[i].unit = "port";
          changesmade = true;
          log.push("to:" + recipe.ingredients[i].unit + " " + recipe.ingredients[i].name + "source:" + recipe.source);
        } else if (ingredient.name.startsWith("Skivor ")) {
          log.push("ingred changed from:" + ingredient.unit + ingredient.name);
          recipe.ingredients[i].name = ingredient.name.substring(7).trim();
          recipe.ingredients[i].name = recipe.ingredients[i].name.charAt(0).toUpperCase() + recipe.ingredients[i].name.slice(1);
          recipe.ingredients[i].unit = "Skivor";
          changesmade = true;
          log.push("to:" + recipe.ingredients[i].unit + " " + recipe.ingredients[i].name + "source:" + recipe.source);
        }
      }
      if (changesmade) {
        var recipeRef = recipesRef.child(child.key);
        recipeRef.update(recipe);
      }

    });
    console.log("recipes: " + numberRec);
    fs.writeFile("C:/react/datachange" + filename + "-LOG.json", JSON.stringify(log), function (err) {
      if (err) {
        return console.log(err);
      }
      console.log("logilfe save")
      log.push("logfile saved!");
    });

  });


  console.log("done");
  console.log("recipes fetched");

}