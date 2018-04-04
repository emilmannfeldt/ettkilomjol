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
let foodRef = firebase.database().ref("foods");
let tagRef = firebase.database().ref("tags");
var fs = require('fs');
let existingFoods = [];
let existingTags = [];
//fixa en array med tags som ska tas bort helt? "smarrigt"
let tagsFrom = [""];
let tagsTo = [""];
let foodChanges = [
    {from: "test", to: "test2"},
];
let foodsFrom = [""];
let foodsTo = [""];
let filename = "changeName";
let log = [];
let foodLoaded = false;
let tagLoaded = false;
firebase.auth().signInAnonymously().catch(function (error) { });
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        foodRef.orderByChild("uses").once("value", function (snapshot) {
            snapshot.forEach(function (child) {
                existingFoods.splice(0, 0, child.val().name);
            });
            foodLoaded = true;
            if (foodLoaded && tagLoaded) {
                runRecipes();
            }
        });
        tagRef.orderByChild("uses").once("value", function (snapshot) {
            snapshot.forEach(function (child) {
                existingTags.splice(0, 0, child.val().name);
            });
            tagLoaded = true;
            if (foodLoaded && tagLoaded) {
                runRecipes();
            }
        });
    }
});

function runRecipes() {
    console.log("logged in,");
    recipesRef.once('value', function (snapshot) {
        console.log("fetching recipes");
        snapshot.forEach(function (child) {
            let usedTagsTo = [];
            let recipe = child.val();
            let changesmade = false;
            let tagsToRemove = [];
       //     for (let i = 0; i < recipe.ingredients.length; i++) {
       //         let ingredientName = recipe.ingredients[i].name;
       //         if (foodsFrom.indexOf(ingredientName) > -1) {
       //             let newFoodName = foodsTo[foodsFrom.indexOf(ingredientName)];
       //             recipe.ingredients[i].name = newFoodName;
       //             changesmade = true;
       //             log.push("From food:" + ingredientName + " toFood:" + newFoodName + " src:" + recipe.source + " key:" + child.key);
       //         }
       //     }
            for (let i = 0; i < recipe.ingredients.length; i++) {
                let ingredientName = recipe.ingredients[i].name;
                for(let j = 0; j < foodChanges.length; j++){
                    let change = foodChanges[i];
                    if(change.from === ingredientName){
                        recipe.ingredients[i].name = change.to;
                        changesmade = true;
                        log.push("From food:" + ingredientName + " toFood:" + newFoodName + " src:" + recipe.source + " key:" + child.key);
                    }
                }
            }

            for (let property in recipe.tags) {
                if (recipe.tags.hasOwnProperty(property)) {
                    let tagName = property;
                    if (tagsFrom.indexOf(tagName) > -1) {
                        let newTagName = tagsTo[tagsFrom.indexOf(tagName)];
                        //om det redan finns entag med det namnet så ta bara bort den felaktiga
                        if (usedTagsTo.indexOf(newTagName) > -1) {
                            console.log(tagName);
                            delete recipe.tags[tagName];
                            changesmade = true;
                            continue;
                        }
                        delete recipe.tags[tagName];
                        recipe.tags[newTagName] = true;
                        changesmade = true;
                        usedTagsTo.push(newTagName);
                        log.push("From tag:" + tagName + " to tag:" + newTagName + " src:" + recipe.source + " key:" + child.key);
                    }
                }
            }
            if (changesmade) {
                var recipeRef = recipesRef.child(child.key);
                log.push(JSON.stringify(recipe));
                recipeRef.update(recipe);
            }
        });

        fs.writeFile("C:/react/changesLog" + filename + "-LOG.json", JSON.stringify(log), function (err) {
            if (err) {
                return console.log(err);
            }
            log.push("logfile saved!");
        });

        console.log("done");
    });
    console.log("recipes fetched");

}