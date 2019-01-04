const firebase = require('firebase');
let fs = require('fs');
const importUtil = require('./importUtil.js');

// Prod
const prodConfig = {
  apiKey: 'AIzaSyAPoXwInGdHakbqWzlhH62qSRBSxljMNn8',
  authDomain: 'ettkilomjol-10ed1.firebaseapp.com',
  databaseURL: 'https://ettkilomjol-10ed1.firebaseio.com',
  storageBucket: 'ettkilomjol-10ed1.appspot.com',
  messagingSenderId: '1028199106361',
};
// Dev
const devConfig = {
  apiKey: 'AIzaSyCRcK1UiO7j0x9OjC_8jq-kbFl9r9d38pk',
  authDomain: 'ettkilomjol-dev.firebaseapp.com',
  databaseURL: 'https://ettkilomjol-dev.firebaseio.com',
  projectId: 'ettkilomjol-dev',
  storageBucket: 'ettkilomjol-dev.appspot.com',
  messagingSenderId: '425944588036',
};
const enviromentArg = process.argv[2];
if (enviromentArg === 'dev') {
  firebase.initializeApp(devConfig);
} else if (enviromentArg === 'prod') {
  firebase.initializeApp(prodConfig);
} else {
  console.log('missing enviroment arguement: dev / prod');
  process.exit();
}
const recipesRef = firebase.database().ref('recipes');
const foodRef = firebase.database().ref('foods');
const tagRef = firebase.database().ref('tags');

const existingFoods = [];
const existingTags = [];
const existingRecipes = [];
const filename = 'countingrecpie';
const log = [];
let foodLoaded = false;
let tagLoaded = false;
let recipeLoaded = false;
firebase.auth().signInAnonymously().catch((error) => { });
firebase.auth().onAuthStateChanged((user) => {
  console.log('start');
  if (user) {
    foodRef.orderByChild('uses').once('value', (snapshot) => {
      snapshot.forEach((child) => {
        existingFoods.splice(0, 0, child.val().name);
      });

      foodLoaded = true;
      if (foodLoaded && tagLoaded && recipeLoaded) {
        runRecipes();
      }
    });
    tagRef.orderByChild('uses').once('value', (snapshot) => {
      snapshot.forEach((child) => {
        existingTags.splice(0, 0, child.val().name);
      });

      tagLoaded = true;
      if (foodLoaded && tagLoaded && recipeLoaded) {
        runRecipes();
      }
    });
    recipesRef.once('value', (snapshot) => {
      snapshot.forEach((child) => {
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
  let numberRec = 0;

  console.log(`${existingRecipes.length} existrinrec`);
  console.log(`existing foods:${existingFoods.length}`);
  recipesRef.once('value', (snapshot) => {
    console.log('receipes hämtade');
    snapshot.forEach((child) => {
      const recipe = child.val();
      let deleteRecipe = false;
      let cause = '';

      if (recipe.rating < 2) {
        deleteRecipe = true;
        cause += '-----låg rating-----';
      }
      if (recipe.votes < 2) {
        deleteRecipe = true;
        cause += '-----låg votes-----';
      }
      let missingFoods = 0;
      for (let i = 0; i < recipe.ingredients.length; i++) {
        const ingredient = recipe.ingredients[i];
        if (existingFoods.indexOf(ingredient.name) === -1) {
          missingFoods++;
        }
      }
      if ((missingFoods / recipe.ingredients.length) > 0.3) {
        deleteRecipe = true;
        cause = `${cause}-----saknade ingredienser i foods: ${missingFoods / recipe.ingredients.length}-----`;
      }
      if (recipe.time && !isNaN(recipe.time) && recipe.time < 1) {
        deleteRecipe = true;
        cause += '-----time less than 1 -----';
      }
      if (recipe.time && isNaN(recipe.time)) {
        deleteRecipe = true;
        cause += '-----time isNaN -----';
      }
      if (!recipe.tags) {
        deleteRecipe = true;
        cause += '-----saknar tags -----';
      }
      if (recipe.description && recipe.description.length > 320 && recipe.rating < 3) {
        deleteRecipe = true;
        cause += '-----lång desc -----';
      }

      numberRec++;
      if (numberRec % 100 == 0) {
        console.log(numberRec);
      }
      if (deleteRecipe) {
        recipesRef.child(child.key).remove();
        log.push(`Deleteing:${recipe.source}`);
        log.push(`cause:${cause}`);
      }
    });
    console.log(`recipes: ${numberRec}`);
    fs.writeFile(`C:/dev/ettkilomjol resources/removebadRecipes${filename}-LOG.json`, JSON.stringify(log), (err) => {
      if (err) {
        return console.log(err);
      }
      console.log('logilfe save');
      log.push('logfile saved!');
    });
    const baseDelay = existingRecipes.length;
    setTimeout(importUtil.recountUsage, baseDelay + 2000);
    setTimeout(process.exit, baseDelay * 2 + 5000);
  });


  console.log('done');
  console.log('recipes fetched');
}
