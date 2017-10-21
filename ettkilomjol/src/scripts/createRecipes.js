var firebase = require('firebase');
var fs = require('fs');

let config = {
    apiKey: "AIzaSyCgKVqOu_D9jemhDwm5PC3Tll50T15OOlM",
    authDomain: "ettkilomjol-10ed1.firebaseapp.com",
    databaseURL: "https://ettkilomjol-10ed1.firebaseio.com",
    storageBucket: "ettkilomjol-10ed1.appspot.com",
    messagingSenderId: "1028199106361"
};
firebase.initializeApp(config);
let foodRef = firebase.database().ref("foods");
let unitsRef = firebase.database().ref("units");
let tagRef = firebase.database().ref("tags");
let recipesRef = firebase.database().ref("recipes");

let existingRecipeSources = [];
let existingFoods = [];
let existingTags = [];
let foodLoaded = false;
let tagLoaded = false;
let recipeLoaded = false;

firebase.auth().signInAnonymously().catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
});

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        //firebase.database().ref("recipes").remove();

        recipesRef.once('value', function (snapshot) {
            snapshot.forEach(function (child) {
                existingRecipeSources.push(child.val().source);
            });
            recipeLoaded = true;
            if (foodLoaded && tagLoaded && recipeLoaded) {
                createRecipes();
            }
        });

        tagRef.orderByChild("uses").once("value", function (snapshot) {
            snapshot.forEach(function (child) {
                existingTags.splice(0, 0, child.val().name);
            });
            tagLoaded = true;
            if (foodLoaded && tagLoaded && recipeLoaded) {
                createRecipes();
            }
        });

        foodRef.orderByChild("uses").once("value", function (snapshot) {
            snapshot.forEach(function (child) {
                existingFoods.splice(0, 0, child.val().name);
            });
            foodLoaded = true;
            if (foodLoaded && tagLoaded && recipeLoaded) {
                createRecipes();
            }
        });
        console.log("LOGGED IN");
    }
    else {
        console.log("bye" + user);
    }
});
//kolla in de konstiga foods. Sök på dem i recipe.json och för att hitta source. 
//konstiga saker i foods...
//Citron / person att pressa över. esacpe "/"?
//kolla igenom all data lite snabbt. sen fortsätt med nedan för att fixa appen
//koppla om webbappen till att gå mot recipes/ istället för recipecards
//ändra baketime
//ta bort bild
//skapa night2.js för ica.se
function createRecipes() {
    fs.readFile('C:/react/recipes.json', 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        let result = JSON.parse(data);
        console.log("lengths")

        for (let i = 0; i < result.length; i++) {
            let recipe = result[i];
            if (!recipe) {
                continue;
            }
            if (existingRecipeSources.indexOf(recipe.source) > -1) {
                console.log(recipe.source + " already exists");
                continue;
            }
            console.log(recipe.source + " new recipe");
            for (let f = 0; f < recipe.ingredients.length; f++) {
                //capitalize first letter

                let food = recipe.ingredients[f].name.charAt(0).toUpperCase() + recipe.ingredients[f].name.slice(1).replace(/[.#$]/g,'');
                console.log("checking food " + food);

                if (existingFoods.indexOf(food) > -1) {
                    console.log("adding uses to " + food);
                    let databaseRef = firebase.database().ref('foods').child(food).child('uses');
                    databaseRef.transaction(function (uses) {
                        if (uses) {
                            uses = uses + 1;
                        }
                        return (uses || 0) + 1;
                    });
                } else {
                    console.log("creating food " + food);

                    firebase.database().ref("foods/" + food).set({
                        name: food,
                        uses: 0
                    })
                    existingFoods.push(food);
                }
            }
            console.log("tags " + recipe.tags)

            for (let property in recipe.tags) {
                if (recipe.tags.hasOwnProperty(property)) {
                    let tag = property.charAt(0).toUpperCase() + property.slice(1);
                    console.log("checking tag " + tag);
                    if (existingTags.indexOf(tag) > -1) {
                        console.log("adding uses to " + tag);
                        let databaseRef = firebase.database().ref('tags').child(tag).child('uses');
                        databaseRef.transaction(function (uses) {
                            if (uses) {
                                uses = uses + 1;
                            }
                            return (uses || 0) + 1;
                        });
                    } else {
                        console.log("creating tag " + tag);
                        firebase.database().ref("tags/" + tag).set({
                            name: tag,
                            uses: 0
                        })
                        existingTags.push(tag);
                    }
                    console.log("prop: " + property);
                }
            }
            recipesRef.push(recipe);
            //save ingredients.name to foodRef (create if new, update uses if exists)
            //same for tags as for foods
            //någon validering? 

            //recipesRef.push(recipe);
        }
        console.log(result.length);

    });
}