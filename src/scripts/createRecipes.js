var firebase = require('firebase');
var fs = require('fs');

//Prod
// let config = {
//     apiKey: "AIzaSyAPoXwInGdHakbqWzlhH62qSRBSxljMNn8",
//     authDomain: "ettkilomjol-10ed1.firebaseapp.com",
//     databaseURL: "https://ettkilomjol-10ed1.firebaseio.com",
//     storageBucket: "ettkilomjol-10ed1.appspot.com",
//     messagingSenderId: "1028199106361"
// };
//Dev
let config = {
    apiKey: "AIzaSyCRcK1UiO7j0x9OjC_8jq-kbFl9r9d38pk",
    authDomain: "ettkilomjol-dev.firebaseapp.com",
    databaseURL: "https://ettkilomjol-dev.firebaseio.com",
    projectId: "ettkilomjol-dev",
    storageBucket: "ettkilomjol-dev.appspot.com",
    messagingSenderId: "425944588036"
  };
firebase.initializeApp(config);
let foodRef = firebase.database().ref("foods");
let unitsRef = firebase.database().ref("units");
let tagRef = firebase.database().ref("tags");
let recipesRef = firebase.database().ref("recipes");
//AUTOMATISERA
//börja med att merga ica.js med createrecipes.js 
//man ska utifrån en url kunna skapa upp ett recept i databasen i ett ändå steg
//om det lyckas så lägg till en knapp som gör detta
//om det lyckas lägg till en textruta där man kan klistra in comma separerad string som prasas och används i scritpet
//om det lyckas lägg till att den kollar på varje url och avgör vilken nightmarescript som ska köras
//presentera resultatet för användaren. Hur många recept las till, och hela loggen antingen utskriven i alert eller nedladdad
//https://stackoverflow.com/questions/11944932/how-to-download-a-file-with-node-js-without-using-third-party-libraries

//lägg till createrecipe funktionerna createRecipes() där filen skapas just nu.
// i .evaluate kan jag börja med en ifsats som avgör om hrefen är ica, taste eller koket. 
//utmaningen är att se om detta går att köra i en reactkomponent? annars kanske den kan ligga som en .js utanför komponenten men frotfarande ha åtkomst till metoden?
//typ som jag gjorde med angular i csri? declare var result = createRecipes(urls);
//kan man få tillbaka ett svar på något sätt? eller se progress?
//spara ner även recipes.json som tidigare till användaren?
//om det inte går att automatisera i guit så fixa iaf så det endast finns en .js för allt.
//som beskrivet ovan förutom att fortfarande använda urls arrayen och kör det i konsolen. spara ner log och recepten.json
let existingRecipes = [];
let existingFoods = [];
let existingTags = [];
let foodLoaded = false;
let tagLoaded = false;
let recipeLoaded = false;
let log = [];
let filename = "ica/updateAll8-2018-06-21";

firebase.auth().signInAnonymously().catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
});

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        //firebase.database().ref("recipes").remove();
        //firebase.database().ref("foods").remove();
        //firebase.database().ref("tags").remove();

        recipesRef.once('value', function (snapshot) {
            snapshot.forEach(function (child) {
                existingRecipes.push(child.val());

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
function createRecipes() {
    fs.readFile('C:/react/' + filename + '.json', 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        let result = JSON.parse(data);
        console.log("input recipes: " + result.length);
        let nrOfRecipesCreated = 0;
        let nrOfRecipesUpdated = 0;
        let final = [];
        for (let i = 0; i < result.length; i++) {
            let recipe = result[i];
            let msg = validateRecipe(recipe);
            if (msg.cause.length > 0) {
                log.push(msg);
                continue;
            }
            if (recipe.title.indexOf("&amp;") > -1) {
                recipe.title = recipe.title.replace(/&amp;/g, '&');
                //lägg tilll /g så det blir replace all
                //fortsätt kollla på recplace i andra scripts
            }
            for (let h = 0; h < recipe.ingredients.length; h++) {
                if (recipe.ingredients[h].unit && recipe.ingredients[h].unit.trim() == "") {
                    delete recipe.ingredients[h].unit;
                }
                if (recipe.ingredients[h].amount && recipe.ingredients[h].amount.trim() == "") {
                    delete recipe.ingredients[h].amount;
                }
                if(recipe.ingredients[h].amount && isNaN(recipe.ingredients[h].amount)){
                    recipe.ingredients[h].amount = recipe.ingredients[h].amount.replace(",/g",".");
                }
            }
            //time temporary
            recipe.ingredients = checkGrammar(recipe.ingredients);
            let exists = false;
            for (let i = 0; i < existingRecipes.length; i++) {
                if (existingRecipes[i].source === recipe.source) {
                    exists = true;
                    //säkerställ att visits inte försvinner vid update
                    //update funkar inte. behöver ha den riktiga referensen till childen
                    //inte som här till child.val()
                    //skap aen till array i början med alla keys?
                    //skapa någon metod som query till firebase som hämtar rätt child utefter source
                    //när det funkar kör mittkok11 och nya ica urls
//måste testas mer noga med att läsa in ett recept från backup med +1 på något etc
                    recipesRef.orderByChild('source').equalTo(existingRecipes[i].source).once("value", function(snapshot) {
                        snapshot.forEach(function(child) {
                            let recipeTmp = child.val();
                            log.push("old recipe: " + JSON.stringify(recipeTmp));
                            recipesRef.child(child.key).update(recipe);
                            log.push("new recipe: " + JSON.stringify(recipe));
                        });
                    });
                    nrOfRecipesUpdated++;
                }
            }
            if(!exists){
                recipesRef.push(recipe);
                nrOfRecipesCreated++;
                existingRecipes.push(recipe);
            }
            final.push(recipe);
        }

        log.push("input nr: " + result.length);
        log.push("created recipes: " + nrOfRecipesCreated);
        log.push("updated recipes: " + nrOfRecipesUpdated);

        console.log("created recipes: " + nrOfRecipesCreated);
        console.log("Updated recipes: " + nrOfRecipesUpdated);

        console.log("success!");

        fs.writeFile("C:/react/" + filename + "-LOG.json", JSON.stringify(log), function (err) {
            if (err) {
                return console.log(err);
            }
            log.push("logfile saved!");
        });
        fs.writeFile("C:/react/recipesbackup/" + filename + ".json", JSON.stringify(final), function (err) {
            if (err) {
                return console.log(err);
            }
            log.push("backup saved!");
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
    let invalidIngredients = 0;
    for (let i = 0; i < recipe.ingredients.length; i++) {
        if (!validateIngredient(recipe.ingredients[i])) {
            invalidIngredients++;
        }
    }
    if ((recipe.ingredients.length / invalidIngredients) < 5) {
        msg.cause = "recipe contains to many wierd ingredients";
        return msg;
    }
    if (!recipe.votes || (recipe.votes && recipe.votes < 2)) {
        msg.cause = "recipe has less than 2 votes";
        return msg;
    }
    for (let i = 0; i < recipe.ingredients.length; i++) {
        if (recipe.ingredients[i].name === "Förp") {
            msg.cause = "recipe has faulty ingredient name:" + recipe.ingredients.name;
            return msg;
        }
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
function checkGrammar(ingredients) {
    let finalIngredients = [];
    for (let i = 0; i < ingredients.length; i++) {
        let name = ingredients[i].name;
        let lastTwo = name.slice(-2);
        if (lastTwo === "or") {
            let singular = name.slice(0, -2) + "a";
            if (existingFoods.indexOf(singular) > -1) {
                log.push("changed grammar from:" + ingredients[i].name + " to:" + singular);
                ingredients[i].name = singular;
                continue;
            }
        }
        else if (lastTwo === "ar") {
            let singular = name.slice(0, -2) + "e";
            if (existingFoods.indexOf(singular) > -1) {
                log.push("changed grammar from:" + ingredients[i].name + " to:" + singular);
                ingredients[i].name = singular;
                continue;
            }
            singular = name.slice(0, -2);
            if (existingFoods.indexOf(singular) > -1) {
                log.push("changed grammar from:" + ingredients[i].name + " to:" + singular);
                ingredients[i].name = singular;
                continue;
            }
            singular = name.slice(0, -3) + "el";
            if (existingFoods.indexOf(singular) > -1) {
                log.push("changed grammar from:" + ingredients[i].name + " to:" + singular);
                ingredients[i].name = singular;
                continue;
            }
        }
        else if (lastTwo === "er") {
            let singular = name.slice(0, -2);
            if (existingFoods.indexOf(singular) > -1) {
                log.push("changed grammar from:" + ingredients[i].name + " to:" + singular);
                ingredients[i].name = singular;
                continue;
            }
            singular = name.slice(0, -1);
            if (existingFoods.indexOf(singular) > -1) {
                log.push("changed grammar from:" + ingredients[i].name + " to:" + singular);
                ingredients[i].name = singular;
                continue;
            }
        }
        else if (lastTwo.slice(-1) === "n") {
            let singular = name.slice(0, -1);
            if (existingFoods.indexOf(singular) > -1) {
                log.push("changed grammar from:" + ingredients[i].name + " to:" + singular);
                ingredients[i].name = singular;
                continue;
            }
        }
    }
    return ingredients;
}