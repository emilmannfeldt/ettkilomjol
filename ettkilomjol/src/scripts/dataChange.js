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
let filename = "changeName";
let log = [];
let foodLoaded = false;
let tagLoaded = false;
firebase.auth().signInAnonymously().catch(function (error) { });
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    foodRef.orderByChild("uses").once("value", function (snapshot) {
      snapshot.forEach(function (child) {
        existingFoods.splice(0, 0, child.val().name);
      });
      foodLoaded = true;
      if (foodLoaded && tagLoaded) {
        runRecipes();
      }
    });
    tagRef.orderByChild("uses").once("value", function (snapshot) {
      snapshot.forEach(function (child) {
        existingTags.splice(0, 0, child.val().name);
      });
      tagLoaded = true;
      if (foodLoaded && tagLoaded) {
        runRecipes();
      }
    });
  }
});

function runRecipes() {
  recipesRef.once('value', function (snapshot) {
    snapshot.forEach(function (child) {
      let recipe = child.val();
      if(recipe.source.indexOf("mittkok") > -1){
        console.log(recipe.source + ": ---->" +child.key);
        recipesRef.child(child.key).remove();

      }

    });


  });
  tagRef.once('value', function (snapshot) {
    snapshot.forEach(function (child) {
      let tag = child.val();
      if (tag.name && tag.name !== tag.name.charAt(0).toUpperCase() + tag.name.slice(1)) {
        //console.log(tag.name);
        //child.remove();
      }

    });


  });
  foodRef.once('value', function (snapshot) {
    snapshot.forEach(function (child) {
      let food = child.val();
      if (food.name && food.name !== food.name.charAt(0).toUpperCase() + food.name.slice(1)) {
        //console.log(food.name);

       //child.remove();
      }

    });


  });
  fs.writeFile("C:/react/datachange" + filename + "-LOG.json", JSON.stringify(log), function (err) {
    if (err) {
      return console.log(err);
    }
    log.push("logfile saved!");
  });

  console.log("done");
  console.log("recipes fetched");

}