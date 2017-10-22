import React from 'react';
import ReactDOM from 'react-dom';
import FilterableRecipeList from './components/filterableRecipeList';
import DataChange from './scripts/dataChange';
import './index.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import * as firebase from 'firebase';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

//browser key: AIzaSyCgKVqOu_D9jemhDwm5PC3Tll50T15OOlM
//server key: AIzaSyAPoXwInGdHakbqWzlhH62qSRBSxljMNn8
//https://stackoverflow.com/questions/35418143/how-to-restrict-firebase-data-modification
let config = {
  apiKey: "AIzaSyCgKVqOu_D9jemhDwm5PC3Tll50T15OOlM",
  authDomain: "ettkilomjol-10ed1.firebaseapp.com",
  databaseURL: "https://ettkilomjol-10ed1.firebaseio.com",
  storageBucket: "ettkilomjol-10ed1.appspot.com",
  messagingSenderId: "1028199106361"
};
if(location.hostname ==='localhost'){
  config.apiKey = "AIzaSyAPoXwInGdHakbqWzlhH62qSRBSxljMNn8";
}
firebase.initializeApp(config);

let foodNames = JSON.parse(localStorage.getItem('foodnames')) || [];
let units = JSON.parse(localStorage.getItem('units')) || [];
let tagNames = JSON.parse(localStorage.getItem('tags')) || [];
let users = JSON.parse(localStorage.getItem('users')) || [];
let recipes = JSON.parse(localStorage.getItem('recipes')) || [];

const DAYS_TO_SAVE_LOCALSTORAGE = 1;

// let createUser = function(email, password) {
//   firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
//     // Handle Errors here.
//     var errorCode = error.code;
//     var errorMessage = error.message;
//     console.log(errorMessage + errorCode + email + password);
//   // ...
//   });
// }

window.onload = function () {
  firebase.auth().signInAnonymously().catch(function (error) {
    // Handle Errors here.

    // ...
  });
};

let localIsOld = function (localVar) {
  let yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - DAYS_TO_SAVE_LOCALSTORAGE);
  let storage = JSON.parse(localStorage.getItem(localVar)) || '';
  if (storage < yesterday.getTime()) {
    return true;
  }
  return false;
}

// let signOut = function() {
//   // Sign out of Firebase.
//   firebase.auth.signOut();
// };

// Triggers when the auth state change for instance when the user signs-in or signs-out.
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    let foodRef = firebase.database().ref("foods");
    let unitsRef = firebase.database().ref("units");
    let tagsRef = firebase.database().ref("tags");
    let usersRef = firebase.database().ref("users");
    let recipeRef = firebase.database().ref("recipes");

    if (foodNames.length < 1 || localIsOld('lastupdatedfoodnames')) {
      console.log("LOADING NEW FOODS");

      foodRef.orderByChild("uses").once("value", function (snapshot) {
        foodNames.length = 0;
        snapshot.forEach(function (child) {
          foodNames.splice(0, 0, child.val().name);
        });
        localStorage.setItem('foodnames', JSON.stringify(foodNames));
      });
      localStorage.setItem('lastupdatedfoodnames', JSON.stringify(Date.now()));
    }

    if (units.length < 1 || localIsOld('lastupdatedunits')) {
      console.log("LOADING NEW UNITS");
      unitsRef.once("value", function (snapshot) {
        units.length = 0;
        snapshot.forEach(function (child) {
          units = Object.keys(snapshot.val()).map(function (key) { return snapshot.val()[key]; });
          units.sort(function (a, b) {
            return a.ref - b.ref;
          });
        });
        localStorage.setItem('units', JSON.stringify(units));
      });
      localStorage.setItem('lastupdatedunits', JSON.stringify(Date.now()));
    }

    if (tagNames.length < 1 || localIsOld('lastupdatedtags')) {
      console.log("LOADING NEW TAGS");
      tagsRef.orderByChild("uses").once("value", function (snapshot) {
        tagNames.length = 0;
        snapshot.forEach(function (child) {
          tagNames.splice(0, 0, child.val().name);
        });
        localStorage.setItem('tagNames', JSON.stringify(tagNames));
      });

      localStorage.setItem('lastupdatedtags', JSON.stringify(Date.now()));
    }
    if (users.length < 1 || localIsOld('lastupdatedusers')) {
      console.log("LOADING NEW USERS");
      usersRef.once('value', function (snapshot) {
        users.length = 0;
        snapshot.forEach(function (child) {
          users.splice(0, 0, child.val());
        });
        localStorage.setItem('users', JSON.stringify(users));
      });
      localStorage.setItem('lastupdatedusers', JSON.stringify(Date.now()));
    }
    if (recipes.length < 1 || localIsOld('lastupdatedrecipes')) {
      console.log("LOADING NEW RECIPES");
      recipeRef.once('value', function (snapshot) {
        recipes.length = 0;
        snapshot.forEach(function (child) {
          recipes.push(child.val());
        });
        localStorage.setItem('recipes', JSON.stringify(recipes));
      });
      localStorage.setItem('lastupdatedrecipes', JSON.stringify(Date.now()));
    }
    // User is signed in.
  }
  else {
    // No user is signed in.
    console.log("bye" + user);
  }
});
//https://www.youtube.com/watch?v=_Fzl0Cim6F8
//lägg till nav.js component. och routing här. Likt app.js i videon.
//filterablerecipelist blir en route
//createRecipeForm blir en route
//etc...
//visa detaljer på recipe blir nog en route till /recipe med <recipe id={-Kgkgdfir24j} /> och sen i den recipe komponenten får jag göra anropp till firebase för att hämta hela receptet på det id.
const Applicaption = () => (
  <MuiThemeProvider>
    <div>
      <DataChange foods={foodNames} tags={tagNames} units={units} users={users} />
      <FilterableRecipeList tags={tagNames} foods={foodNames} recipes={recipes} />
    </div>
  </MuiThemeProvider>
);
ReactDOM.render(<Applicaption />, document.getElementById('root'));