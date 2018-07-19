var firebase = require('firebase');
var fs = require('fs');

//Prod
let prodConfig = {
  apiKey: "AIzaSyAPoXwInGdHakbqWzlhH62qSRBSxljMNn8",
  authDomain: "ettkilomjol-10ed1.firebaseapp.com",
  databaseURL: "https://ettkilomjol-10ed1.firebaseio.com",
  storageBucket: "ettkilomjol-10ed1.appspot.com",
  messagingSenderId: "1028199106361"
};
//Dev
let devConfig = {
  apiKey: "AIzaSyCRcK1UiO7j0x9OjC_8jq-kbFl9r9d38pk",
  authDomain: "ettkilomjol-dev.firebaseapp.com",
  databaseURL: "https://ettkilomjol-dev.firebaseio.com",
  projectId: "ettkilomjol-dev",
  storageBucket: "ettkilomjol-dev.appspot.com",
  messagingSenderId: "425944588036"
};
let enviromentArg = process.argv[2];
if (enviromentArg === "dev") {
  firebase.initializeApp(devConfig);

} else if (enviromentArg === "prod") {
  firebase.initializeApp(prodConfig);

} else {
  console.log("missing enviroment arguement: dev / prod");
  process.exit();
}
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
  let invalids = [",", "+", "$", "#", "[", "]", "."];

  recipesRef.once('value', function (snapshot) {
    console.log("receipes hämtade");
    snapshot.forEach(function (child) {

      let busted = false;
      let recipe = child.val();
      let changesmade = false;
      let pinne = "--------------";

      if (recipe.portions && isNaN(recipe.portions)) {
        log.push(recipe.source);
        log.push(recipe.portions);

      }
      if (false) {
        numberRec++;

        recipesRef.child(child.key).set(recipe, function (error) {
          if (error) {
            console.log('Error has occured during saving process');
          }
          else {
            console.log("Data hss been dleted succesfully");

          }
        })
        log.push(recipe.source);

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