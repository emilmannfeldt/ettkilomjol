const firebase = require('firebase');
var fs = require('fs');
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
var fs = require('fs');

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
        runRecipes();
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
        runRecipes();
      }
    });
  }
});

function runRecipes() {
  // script för att  hitta alla recept som har någon ingrediens med ett visst antal uses
  const namel = 0;
  const numberRec = 0;
  const invalids = [',', '+', '$', '#', '[', ']', '.'];
  recipesRef.once('value', (snapshot) => {
    console.log('receipes hämtade');
    snapshot.forEach((child) => {
      const busted = false;
      const recipe = child.val();
      log.push(recipe.source);
      const changesmade = false;
      // lös problemte med 30-40 dumplings som inte blir rätt iscriptet här? why??
      // jag kan plocka ut alla recept vars portion är bara en siffra? ta ut de soruces för de ska updateras.
      // resulterar i 4 filer med sources som jag sedan ska köra om i respektiva ica.js script. se så att resultatet blir bra och sen updatera mot createrecipes.js
      //

      // läs om alla recept som finns från varje source.
      // ica done
      // tasteline påväg
      // mittkok behöver samla in hrefs, hitta script som funkar bra likt icas
      // koket.se samma som ovan
    });
    const uniqRecipes = [...new Set(log)]; 

    console.log("total recipes: " + log.length);
    console.log("uniq recipes: " + uniqRecipes.length);


    console.log(`recipes: ${numberRec}`);
    fs.writeFile(`C:/dev/datachange${filename}-LOG.json`, JSON.stringify(log), (err) => {
      if (err) {
        return console.log(err);
      }
      console.log('logilfe save');
      log.push('logfile saved!');
    });
  });

  console.log('done');
  console.log('recipes fetched');
}
