var firebase = require('firebase');
var fs = require('fs');
let Fuse = require('fuse.js');


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
let existingRecipes = [];
let filename = "countingrecpie";
let log = [];
let foodLoaded = false;
let tagLoaded = false;
let recipeLoaded = false;
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
      if (foodLoaded && tagLoaded && recipeLoaded) {
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
      if (foodLoaded && tagLoaded && recipeLoaded) {
        runRecipes();
      }
    });
    recipesRef.once('value', function (snapshot) {
      snapshot.forEach(function (child) {
        existingRecipes.push(child.val());

      });
      recipeLoaded = true;
      if (foodLoaded && tagLoaded && recipeLoaded) {
        runRecipes();
      }
    });
  }
});

function runRecipes() {
  let namel = 0;
  let numberRec = 0;
  let invalids = [",", "+", "$", "#", "[", "]", "."];
  var options = {
    threshold: 0.1,
    location: 0,
    distance: 800,
    maxPatternLength: 32,
    minMatchCharLength: 2,
    includeScore: true,
    keys: [
      "title",
      "author",
      "createdFor",
      "tags"
    ]
  };
  console.log(existingRecipes.length + " existrinrec")

  recipesRef.once('value', function (snapshot) {
    console.log("receipes hämtade");
    snapshot.forEach(function (child) {
      //kanske kan använda Fuse.js? som används i favorites.js? för att testa likehten på hela recept.
      let busted = false;
      let recipe = child.val();
      let deleteRecipe = false;
      let pinne = "--------------";
      let cause = "";

      if (recipe.rating < 2) {
        deleteRecipe = true;
        cause = cause + "-----låg rating-----"
      }
      if (recipe.votes < 3) {
        deleteRecipe = true;
        cause = cause + "-----låg votes-----"
      }
      let missingFoods = 0;
      for (let i = 0; i < recipe.ingredients.length; i++) {
        let ingredient = recipe.ingredients[i];
        if (existingFoods.indexOf(ingredient.name) === -1) {
          missingFoods++;
        }
      }
      if ((missingFoods / recipe.ingredients.length) > 0.2) {
        deleteRecipe = true;
        cause = cause + "-----saknade ingredienser i foods: " + (missingFoods / recipe.ingredients.length) + "-----";
      }
      if (recipe.time && !isNaN(recipe.time) && recipe.time < 1) {
        deleteRecipe = true;
        cause = cause + "-----time less than 1 -----";
      }
      if (recipe.time && isNaN(recipe.time)) {
        deleteRecipe = true;
        cause = cause + "-----time isNaN -----";
      }
      if (!recipe.tags) {
        deleteRecipe = true;
        cause = cause + "-----saknar tags -----";
      }
      if (recipe.description && recipe.description.length > 300 && recipe.rating < 4) {
        deleteRecipe = true;
        cause = cause + "-----lång desc -----";
      }
      /*
            for (let i = 0; i < existingRecipes.length; i++) {
              let existingRecipe = existingRecipes[i];
              if (existingRecipe.source === recipe.source) {
                continue;
              }
              if(existingRecipe.description && existingRecipe.description === recipe.existingRecipe && existingRecipe.title === recipe.title){
                deleteRecipe = true;
                cause = cause + "-----samma desc och title som: "+ existingRecipe.source +" -----";
              }
              if (recipe.ingredients.length > 14) {
                let sameIngredientNames = 0;
                for (let j = 0; j < existingRecipe.ingredients.length; j++) {
                  let existingIngredient = existingRecipe.ingredients[j];
                  for (let h = 0; h < recipe.ingredients.length; h++) {
                    let ing = recipe.ingredients[h];
                    if (ing.name === existingIngredient.name) {
                      sameIngredientNames++;
                    }
                  }
                }
                if ((sameIngredientNames / existingRecipe.ingredients.length) > 0.8 && (sameIngredientNames / recipe.ingredients.length) > 0.8) {
                  deleteRecipe = true;
                  cause = cause + "-----liknande ingredienser som" + existingRecipe.source + "-----";
                  break;
                }
              }
            }
            */



      numberRec++;
      if (numberRec % 100 == 0) {
        console.log(numberRec);
      }
      if (deleteRecipe) {
        //recipesRef.child(child.key).remove();
        log.push("Deleteing:" + recipe.source);
        log.push("cause:" + cause)

      }

    });
    console.log("recipes: " + numberRec);
    fs.writeFile("C:/react/removebadRecipes" + filename + "-LOG.json", JSON.stringify(log), function (err) {
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