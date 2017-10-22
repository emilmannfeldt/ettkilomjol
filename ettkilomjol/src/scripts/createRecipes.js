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
        firebase.database().ref("recipes").remove();
        firebase.database().ref("foods").remove();
        firebase.database().ref("tags").remove();

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
    fs.readFile('C:/react/testdata.json', 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        let result = JSON.parse(data);
        let validationMsgs = [];
        console.log("lengths")
        let nrOfRecipesCreated = 0;

        for (let i = 0; i < result.length; i++) {
            let recipe = result[i];
            let msg = validateRecipe(recipe);
            if (msg.cause.length > 0) {
                validationMsgs.push(msg);
                console.log("Invalid recipe: " + msg.source);
                continue;
            }
            for (let f = 0; f < recipe.ingredients.length; f++) {
                //capitalize first letter
                if (!validateIngredient(recipe.ingredients[f])) {
                    console.log("invalid ingredient:" + recipe.ingredients[f].name);
                    continue;
                }
                let food = recipe.ingredients[f].name;

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
                    let tag = property.charAt(0).toUpperCase() + property.slice(1);
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
            nrOfRecipesCreated++;
            recipesRef.push(recipe);
            existingRecipeSources.push(recipe.source);
            //save ingredients.name to foodRef (create if new, update uses if exists)
            //same for tags as for foods
            //någon validering? 

            //recipesRef.push(recipe);
        }

        console.log("input nr: " + result.length);
        console.log("created recipes: " + nrOfRecipesCreated);


        fs.writeFile("C:/react/validation.json", JSON.stringify(validationMsgs), function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("logfile saved!");
        });
    });
}
function validateRecipe(recipe) {
    let msg = { recipeSrc: "", cause: "" };
    if (!recipe) {
        msg.cause = "recipe is null";
        return msg;
    }
    msg.recipeSrc = recipe.source;
    if (existingRecipeSources.indexOf(recipe.source) > -1) {
        msg.cause = "recipe already exists";
        return msg;
    }
    let invalidIngredients = 0;
    for (let i = 0; i < recipe.ingredients.length; i++) {
        if (!validateIngredient(recipe.ingredients[i])) {
            invalidIngredients++;
        }
    }
    if ((recipe.ingredients.length / invalidIngredients) < 3) {
        msg.cause = "recipe contains to many wierd ingredients";
        return msg;
    }

    //recept med många konstiga ingredienser (långa namn, siffror i namn, specialtecken i namn,)
    return msg;
    //fortsätt med mer validering. 
}

function validateIngredient(ingredient) {
    let nameLength = ingredient.name.length;
    let nameWordCount = ingredient.name.split(" ").length;
    let nameSpecialChars = ingredient.name.match(/^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/);
    let containsNumbers = /\d/.test(ingredient.name);
    if (nameLength > 40 || nameLength < 1) {
        return false;
    }
    if (nameWordCount > 2) {
        return false;
    }
    if (nameSpecialChars && nameSpecialChars.length > 0) {
        return false;
    }
    if (containsNumbers) {
        return false;
    }
    return true;
}