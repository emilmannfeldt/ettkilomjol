const firebase = require('firebase');
const fs = require('fs');
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
let recipes;

const existingFoods = [];
const existingTags = [];
const filename = 'sources';
const log = [];
let foodLoaded = false;
let tagLoaded = false;
firebase.auth().signInAnonymously().catch((error) => { });
firebase.auth().onAuthStateChanged((user) => {
  console.log('start');
  if (user) {
    foodRef.orderByChild('uses').once('value', (snapshot) => {
      console.log('startfood');
      snapshot.forEach((child) => {
        existingFoods.splice(0, 0, child.val().name);
      });
      console.log('fooddone');

      foodLoaded = true;
      if (foodLoaded && tagLoaded) {
        // runRecipes();
      }
    });
    tagRef.orderByChild('uses').once('value', (snapshot) => {
      console.log('tagstart');

      snapshot.forEach((child) => {
        existingTags.splice(0, 0, child.val().name);
      });
      console.log('tagdone');

      tagLoaded = true;
      if (foodLoaded && tagLoaded) {
        // runRecipes();
      }
    });
    fs.readFile('./recipes.json', (err, data) => {
      if (err) {
        throw err;
      }
      recipes = JSON.parse(data);

      runRecipes(); // Or put the next step in a function and invoke it
    });
  }
});


function runRecipes() {
  // script för att  hitta alla recept som har någon ingrediens med ett visst antal uses
  const namel = 0;
  const numberRec = 0;
  const invalids = [',', '+', '$', '#', '[', ']', '.'];
  const len = recipes.length;
  console.log(`${len}recipes`);

  for (let i = 0; i < len; i++) {
    recipesRef.push(recipes[i]);
  }

  console.log('done');
  console.log('recipes fetched');
}
