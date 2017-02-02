import React from 'react';
import ReactDOM from 'react-dom';
import FilterableRecipeList from './App';
import './index.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import * as firebase from 'firebase';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

let config = {
  apiKey: "AIzaSyCgKVqOu_D9jemhDwm5PC3Tll50T15OOlM",
  authDomain: "ettkilomjol-10ed1.firebaseapp.com",
  databaseURL: "https://ettkilomjol-10ed1.firebaseio.com",
  storageBucket: "ettkilomjol-10ed1.appspot.com",
  messagingSenderId: "1028199106361"
};
firebase.initializeApp(config);

let foodBase = {};
let foods = [];

let createUser = function(email, password) {
  firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorMessage + errorCode + email + password);
  // ...
  });
}

let signIn = function(email, password) {
  firebase.auth.EmailAuthProvider.credential(email, password);
};

let signOut = function() {
  // Sign out of Firebase.
  firebase.auth.signOut();
};

// Triggers when the auth state change for instance when the user signs-in or signs-out.
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log("welcome" + user);
    foodBase = firebase.database().ref("foods");
    foodBase.orderByChild("uses").on("child_added", function(snapshot) {
      foods.splice(0, 0, snapshot.val().name);
    });
  // User is signed in.
  } else {
    // No user is signed in.
    console.log("bye" + user);
  }
});

const Applicaption = () => (
  <MuiThemeProvider>
    <FilterableRecipeList foods={foods} recipes={{}}/>
  </MuiThemeProvider>
);

ReactDOM.render(<Applicaption />,document.getElementById('root')
);
