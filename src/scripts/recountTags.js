var firebase = require('firebase');
var fs = require('fs');

let config = {
    apiKey: "AIzaSyAPoXwInGdHakbqWzlhH62qSRBSxljMNn8",
    authDomain: "ettkilomjol-10ed1.firebaseapp.com",
    databaseURL: "https://ettkilomjol-10ed1.firebaseio.com",
    storageBucket: "ettkilomjol-10ed1.appspot.com",
    messagingSenderId: "1028199106361"
};
firebase.initializeApp(config);
let recipesRef = firebase.database().ref("recipes");
let foodsRef = firebase.database().ref("foods");
let tagsRef = firebase.database().ref("tags");

var fs = require('fs');
let existingFoods = [];
let existingTags = [];
let recipes = [];
let removedTags = [];
let foods = {};
let tags = {};
let filename = "test";
let log = [];
let foodLoaded = false;
let recipeLoaded = false;
//var väldig tid och skapar extremt många transactions.
//alt1. dela upp så man kör 1000 i taget i loopen
//skriv om scriptet så att vi skapar ett stort tags och foods objekt i javascript här och sen lägger in den en gång i firebase när allt är klart
firebase.auth().signInAnonymously().catch(function (error) {
    console.log("error:" + error)
});
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        console.log("Start");
        firebase.database().ref("tags").remove();
        //firebase.database().ref("recipes").remove();
        foodsRef.orderByChild("uses").once("value", function (snapshot) {
            snapshot.forEach(function (child) {
                if (child.val().uses > 1) {
                    existingFoods.splice(0, 0, child.val().name);
                }
            });
            console.log("foods:" + existingFoods.length);
            foodLoaded = true;
            if (foodLoaded && recipeLoaded) {
                runRecipes();
            }
        });
        recipesRef.once('value', function (snapshot) {
            snapshot.forEach(function (child) {
                recipes.push(child.val());
            });
            recipeLoaded = true;
            if (foodLoaded && recipeLoaded) {
                runRecipes();
            }
        });
    }
});

function runRecipes() {
    console.log("Recipes loaded");
    log.push("starting");
    for (let j = 0; j < recipes.length; j++) {
        recipe = recipes[j];
        for (let property in recipe.tags) {
            if (recipe.tags.hasOwnProperty(property)) {
                let tag = property;
                if (existingFoods.indexOf(tag) > -1) {
                    if (removedTags.indexOf(tag) == -1) {
                        removedTags.push(tag);
                    }
                    continue;
                } else {
                    if (existingTags.indexOf(tag) > -1) {
                        tags[tag].uses = tags[tag].uses + 1;
                    } else {
                        tags[tag] = {
                            name: tag,
                            uses: 0
                        };
                        existingTags.push(tag);
                    }
                }
            }
        }
    }

    for (let prop in tags) {
        let tag = tags[prop];
        if (tag.uses < 5) {
            delete tags[prop];
        }
    }
    tagsRef.set(tags);
    console.log("Success!");
}