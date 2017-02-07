import React from 'react';
import ReactDOM from 'react-dom';
import FilterableRecipeList from './FilterableRecipeList';
import DataChange from './DataChange';
import './index.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import * as firebase from 'firebase';
import injectTapEventPlugin from 'react-tap-event-plugin';
import RaisedButton from 'material-ui/RaisedButton';


injectTapEventPlugin();

let config = {
  apiKey: "AIzaSyCgKVqOu_D9jemhDwm5PC3Tll50T15OOlM",
  authDomain: "ettkilomjol-10ed1.firebaseapp.com",
  databaseURL: "https://ettkilomjol-10ed1.firebaseio.com",
  storageBucket: "ettkilomjol-10ed1.appspot.com",
  messagingSenderId: "1028199106361"
};
firebase.initializeApp(config);

let foodNames = JSON.parse(localStorage.getItem('foodnames')) || [];
let units = JSON.parse(localStorage.getItem('units')) || [];
let tags = JSON.parse(localStorage.getItem('tags')) || [];
let users = JSON.parse(localStorage.getItem('users')) || [];

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

let signIn = function() {
firebase.auth().signInAnonymously().catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
});};

let localIsOld = function (localVar){
  let yesterday = new Date();
  yesterday.setDate(yesterday.getDate()-DAYS_TO_SAVE_LOCALSTORAGE);
  let storage = JSON.parse(localStorage.getItem(localVar)) || '';
  if(storage<yesterday.getTime()){
    return true;
  }
  return false;
}

// let signOut = function() {
//   // Sign out of Firebase.
//   firebase.auth.signOut();
// };

// Triggers when the auth state change for instance when the user signs-in or signs-out.
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    let foodRef = firebase.database().ref("foods");
    let unitsRef = firebase.database().ref("units");
    let tagsRef = firebase.database().ref("tags");
    let usersRef = firebase.database().ref("users");


    if(foodNames.length< 1 || localIsOld('lastupdatedfoodnames')){
      console.log("LOADING NEW FOODS");
      foodRef.orderByChild("uses").on("child_added", function(snapshot) {
        foodNames.splice(0, 0, snapshot.val().name);
        localStorage.setItem('foodnames', JSON.stringify(foodNames));
      });
      localStorage.setItem('lastupdatedfoodnames', JSON.stringify(Date.now()));
    }

    if(units.length< 1 || localIsOld('lastupdatedunits')){
      console.log("LOADING NEW UNITS");
      unitsRef.on("child_added", function(snapshot) {
        let unitArray = Object.keys(snapshot.val()).map(function (key) { return snapshot.val()[key]; });
          unitArray.sort(function(a,b){
         return a.ref - b.ref;
        });
        units.push(unitArray);  
        localStorage.setItem('units', JSON.stringify(units));
      });
      localStorage.setItem('lastupdatedunits', JSON.stringify(Date.now()));
    }

    if(tags.length< 1 || localIsOld('lastupdatedtags')){
      console.log("LOADING NEW TAGS");
      tagsRef.on("child_added", function(snapshot) {
        tags.push(snapshot.val());    
        localStorage.setItem('tags', JSON.stringify(tags));
      });
      localStorage.setItem('lastupdatedtags', JSON.stringify(Date.now()));
    }
    if(users.length< 1 || localIsOld('lastupdatedusers')){
      console.log("LOADING NEW USERS");
      usersRef.on("child_added", function(snapshot) {
        users.push(snapshot.val());    
        localStorage.setItem('users', JSON.stringify(users));
      });
      localStorage.setItem('lastupdatedusers', JSON.stringify(Date.now()));
    }
  // User is signed in.
  } else {
    // No user is signed in.
    console.log("bye" + user);
  }
});

const Applicaption = () => (
  <MuiThemeProvider>
  <div>
  <RaisedButton label="login" primary={ true } onTouchTap={ signIn } />
    <DataChange foods={foodNames} tags = {tags} units = {units} users={users}/>
    <FilterableRecipeList foods={foodNames} recipes={{}}/>
    </div>
  </MuiThemeProvider>
);

ReactDOM.render(<Applicaption />,document.getElementById('root')
);
