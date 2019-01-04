import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

// PROD
const prodConfig = {
  apiKey: 'AIzaSyCgKVqOu_D9jemhDwm5PC3Tll50T15OOlM',
  authDomain: 'ettkilomjol-10ed1.firebaseapp.com',
  databaseURL: 'https://ettkilomjol-10ed1.firebaseio.com',
  storageBucket: 'ettkilomjol-10ed1.appspot.com',
  messagingSenderId: '1028199106361',
};
if (window.location.hostname === 'localhost') {
  prodConfig.apiKey = 'AIzaSyAPoXwInGdHakbqWzlhH62qSRBSxljMNn8';
}

// DEV
const devConfig = {
  apiKey: 'AIzaSyCRcK1UiO7j0x9OjC_8jq-kbFl9r9d38pk',
  authDomain: 'ettkilomjol-dev.firebaseapp.com',
  databaseURL: 'https://ettkilomjol-dev.firebaseio.com',
  projectId: 'ettkilomjol-dev',
  storageBucket: 'ettkilomjol-dev.appspot.com',
  messagingSenderId: '425944588036',
};
const fire = firebase.initializeApp(prodConfig);

export { fire };
