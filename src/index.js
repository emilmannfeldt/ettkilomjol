import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app';
import './index.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { firebaseApp } from './base';
import { PropagateLoader } from 'react-spinners';

let indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

//browser key: AIzaSyCgKVqOu_D9jemhDwm5PC3Tll50T15OOlM
//server key: AIzaSyAPoXwInGdHakbqWzlhH62qSRBSxljMNn8
//https://stackoverflow.com/questions/35418143/how-to-restrict-firebase-data-modification

let foods = JSON.parse(localStorage.getItem('foods')) || [];
let units = JSON.parse(localStorage.getItem('units')) || [];
let tags = JSON.parse(localStorage.getItem('tags')) || [];
let users = JSON.parse(localStorage.getItem('users')) || [];
//möjligt att jag i framtiden bygger om så att det finns "searchableRecipe" som bara innehåller de sökbara attributen. Ingredienser, tags, time, level, och sen körs frågor till firebase för att hämta hela recpeten för de som blir träff.
// Kan dock bli mer krävande i mb/user?
let recipes = [];
let MIN_USES_FOOD = 5;
let MIN_USES_TAG = 8;
let MIN_ACCEPTED_RECIPES = 17000;
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
//https://www.npmjs.com/package/react-loading-animation

window.onload = function () {
  firebaseApp.auth().signInAnonymously().catch(function (error) {
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
//testa mer. målet är att recipeRef.once bara ska köras första gången.
//
function getRecipesIndexedDB() {

  let recipeRef = firebaseApp.database().ref("recipes");
  let open = indexedDB.open("RecipeDatabase", 1);
  let upgraded = false;
  open.onupgradeneeded = function (e) {
    upgraded = true;
    console.log("INDEXDB upgrade")
    var db = open.result;
    var store = db.createObjectStore("RecipeStore", { keyPath: "source" });
  }
  open.onsuccess = function () {
    console.log("INDEXDB sucess")
    let db = open.result;
    let reloadedFromFirebase = false;
    if (upgraded || localIsOld('lastupdatedrecipes')) {
      recipeRef.once('value', function (snapshot) {
        recipes.length = 0;
        snapshot.forEach(function (child) {
          recipes.push(child.val());
        });
        console.log(recipes.length + " Recept laddade från firebase");
        for (let i = 0; i < recipes.length; i++) {
          let tx = db.transaction("RecipeStore", "readwrite");
          let store = tx.objectStore("RecipeStore");
          store.put(recipes[i]);
        }
      });
      localStorage.setItem('lastupdatedrecipes', JSON.stringify(Date.now()));
      reloadedFromFirebase = true;
      hideSpinner();


    }

    if (!reloadedFromFirebase && recipes.length < 1) {
      let tx = db.transaction("RecipeStore", "readwrite");
      let store = tx.objectStore("RecipeStore");
      let recipedb = store.getAll();

      recipedb.onsuccess = function () {
        if (recipedb.result.length < MIN_ACCEPTED_RECIPES) {
          recipeRef.once('value', function (snapshot) {
            recipes.length = 0;
            snapshot.forEach(function (child) {
              recipes.push(child.val());
            });

            console.log(recipes.length + " Recept laddade från firebase pga result endast var " + recipedb.result.length);
            for (let i = 0; i < recipes.length; i++) {
              let tx = db.transaction("RecipeStore", "readwrite");
              let store = tx.objectStore("RecipeStore");
              store.put(recipes[i]);
            }
          });
          localStorage.setItem('lastupdatedrecipes', JSON.stringify(Date.now()));
          hideSpinner();
        } else {

          for (let i = 0; i < recipedb.result.length; i++) {
            recipes.push(recipedb.result[i]);
          }
          console.log(recipes.length + " Recept laddade från indexedDB");
          hideSpinner();

        }
        //tar väldigt lång tid att komma till onsucess andra gången. Och det är endast 3-40 recept som finns i storen på getAll...
        //funkar men recipes som går in i filteredrecipescomponent är tom?
        //varför funkar det inte här men när det är helt ny store så funkar det.
        //behöver jag göra detta till en react component och använda state?
      };
    }

    // Close the db when the transaction is done

  }
}

function hideSpinner(){
  document.querySelector(".spinner").style.display='none';
  document.querySelector("#loading-text").style.display='none';

}
// let signOut = function() {
//   // Sign out of Firebase.
//   firebase.auth.signOut();
// };
//testa indexdb, funkar det? gå tillbaka till localcache... Snygga till cards
// Triggers when the auth state change for instance when the user signs-in or signs-out.
firebaseApp.auth().onAuthStateChanged(function (user) {
  if (user) {
    getRecipesIndexedDB();

    let foodRef = firebaseApp.database().ref("foods");
    let unitsRef = firebaseApp.database().ref("units");
    let tagsRef = firebaseApp.database().ref("tags");
    let usersRef = firebaseApp.database().ref("users");
    let recipeRef = firebaseApp.database().ref("recipes");

    if (foods.length < 1 || localIsOld('lastupdatedfoods')) {
      console.log("LOADING NEW FOODS");

      foodRef.orderByChild("uses").once("value", function (snapshot) {
        foods.length = 0;
        snapshot.forEach(function (child) {
          if (child.val().uses >= MIN_USES_FOOD) {
            foods.splice(0,0,child.val());
          }
        });
        localStorage.setItem('foods', JSON.stringify(foods));
      });
      localStorage.setItem('lastupdatedfoods', JSON.stringify(Date.now()));
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

    if (tags.length < 1 || localIsOld('lastupdatedtags')) {
      console.log("LOADING NEW TAGS");
      tagsRef.orderByChild("uses").once("value", function (snapshot) {
        tags.length = 0;
        snapshot.forEach(function (child) {
          if (child.val().uses >= MIN_USES_TAG) {
            tags.splice(0,0,child.val());
          }
        });
        localStorage.setItem('tags', JSON.stringify(tags));
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
    <div className='spinner'>
        <PropagateLoader
          color={'#00bcd4'} 
        />
      </div>
      <div className='spinner' id="loading-text">Fixa en snyggare info text hör. om de tar mer än x sekunder så rensa användarens cookies och ladda om? Någon som byter varannan sekund random från en array med text, typing? eller animering, : Letar recept på nätet, googlar vegansk bacon, ringer mannerström, sträcktittar masterchef, ringer mamma, undersöker linas matkassar, frågar grannen,</div>

    <App foods={foods} tags={tags} units={units} users={users} recipes={recipes}></App>
    </div>
  </MuiThemeProvider>
);
ReactDOM.render(<Applicaption />, document.getElementById('root'));