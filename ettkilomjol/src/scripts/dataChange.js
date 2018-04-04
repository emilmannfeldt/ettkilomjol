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
let filename = "foodslessthan4uses";
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
        existingFoods.splice(0, 0, child.val().name);
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
  let namel = 0;
  foodRef.once('value', function (snapshot) {
    snapshot.forEach(function (child) {
      let food = child.val();
      if (food.uses < 4) {
        if(food.name.length > namel){
          namel = food.name.length;
          console.log(food.name)
        }
        
        let pointer = "---------------------------------------------------->"
        pointer = pointer.substring(food.name.length);
        log.push(food.name + pointer + food.uses);

       //child.remove();
      }

    });
    fs.writeFile("C:/react/datachange" + filename + "-LOG.json", JSON.stringify(log), function (err) {
      if (err) {
        return console.log(err);
      }
      log.push("logfile saved!");
    });

  });


  console.log("done");
  console.log("recipes fetched");

}