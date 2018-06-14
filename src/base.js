import firebase from 'firebase';

let config = {
    apiKey: "AIzaSyCgKVqOu_D9jemhDwm5PC3Tll50T15OOlM",
    authDomain: "ettkilomjol-10ed1.firebaseapp.com",
    databaseURL: "https://ettkilomjol-10ed1.firebaseio.com",
    storageBucket: "ettkilomjol-10ed1.appspot.com",
    messagingSenderId: "1028199106361"
  };
  if (window.location.hostname === 'localhost') {
    config.apiKey = "AIzaSyAPoXwInGdHakbqWzlhH62qSRBSxljMNn8";
  }
const fire = firebase.initializeApp(config);

export {fire}