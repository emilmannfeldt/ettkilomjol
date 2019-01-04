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

firebase.auth().signInAnonymously().catch((error) => { });
firebase.auth().onAuthStateChanged((user) => {
  console.log('start');
  if (user) {
    const baseDelay = 5000;
    setTimeout(importUtil.changeName, baseDelay);
    setTimeout(importUtil.fixFaultyIngredients, baseDelay * 2 + 10000);
    setTimeout(importUtil.recountUsage, baseDelay * 3 + 20000);
    setTimeout(process.exit, baseDelay * 4 + 30000);

    console.log('done');
  }
});
