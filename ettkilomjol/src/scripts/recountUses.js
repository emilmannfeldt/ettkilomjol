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
var fs = require('fs');
let existingFoods = [];
let existingTags = [];
let recipes = [];
firebase.auth().signInAnonymously().catch(function (error) {
});
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        firebase.database().ref("tags").remove();
        firebase.database().ref("foods").remove();
        recipesRef.once('value', function (snapshot) {
            snapshot.forEach(function (child) {
                recipes.push(child.val());
            });
            runRecipes();
        });
    }
});

function runRecipes() {
    console.log("logged in,");
    for (let j = 0; j < recipes.length; j++) {
        recipe = recipes[j];
        for (let i = 0; i < recipe.ingredients.length; i++) {
            let food = recipe.ingredients[i].name;
            if (existingFoods.indexOf(food) > -1) {
                let databaseRef = firebase.database().ref('foods').child(food).child('uses');
                databaseRef.transaction(function (uses) {
                    if (uses) {
                        uses = uses + 1;
                    }
                    return (uses || 0) + 1;
                });
            } else {
                firebase.database().ref("foods/" + food).set({
                    name: food,
                    uses: 0
                })
                existingFoods.push(food);
            }
        }
        for (let property in recipe.tags) {
            if (recipe.tags.hasOwnProperty(property)) {
                let tag = property;
                if (existingFoods.indexOf(tag) > -1) {
                    continue;
                }
                if (existingTags.indexOf(tag) > -1) {
                    let databaseRef = firebase.database().ref('tags').child(tag).child('uses');
                    databaseRef.transaction(function (uses) {
                        if (uses) {
                            uses = uses + 1;
                        }
                        return (uses || 0) + 1;
                    });
                } else {
                    firebase.database().ref("tags/" + tag).set({
                        name: tag,
                        uses: 0
                    })
                    existingTags.push(tag);
                }
            }
        }
    }
    console.log("done");
}