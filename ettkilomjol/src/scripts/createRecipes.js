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
let existingRecipeSources = [];
let existingFoods = [];
let existingTags = [];
let foodLoaded = false;
let tagLoaded = false;
let recipeLoaded = false;
let log = [];
let filename = "tasteline/tasteline-all";

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
    fs.readFile('C:/react/' + filename + '.json', 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        let result = JSON.parse(data);
        let nrOfRecipesCreated = 0;
        for (let i = 0; i < result.length; i++) {
            let recipe = result[i];
            let msg = validateRecipe(recipe);
            if (msg.cause.length > 0) {
                log.push(msg);
                continue;
            }
            if(recipe.title.indexOf("&amp;") > -1){
                recipe.title = recipe.title.replace("&amp;","&");
            }
            for (let h = 0; h < recipe.ingredients.length; h++) {
                if (recipe.ingredients[h].unit && recipe.ingredients[h].unit.trim() == "") {
                    delete recipe.ingredients[h].unit;
                }
                if (recipe.ingredients[h].amount && recipe.ingredients[h].amount.trim() == "") {
                    delete recipe.ingredients[h].amount;
                }
            }
            //time temporary
            if (recipe.time && isNaN(recipe.time)) {
                let timeNumber;
                if (recipe.source.indexOf("www.ica.se") > -1) {
                    let timeString = recipe.time;
                    console.log(recipe.source);
                    if (timeString.indexOf("MIN") > -1) {
                        timeNumber = timeString.split(" ")[0] - 0;
                    } else if (timeString.indexOf("TIM")) {
                        let parts = timeString.split(" ")[0].split("-");
                        if (parts.length === 1) {
                            timeNumber = (timeString.split(" ")[0] - 0) * 60;
                        } else {
                            timeNumber = (((parts[0] - 0) + (parts[1] - 0)) / 2) * 60;
                        }
                    } else {
                        log.push("kunde inte förstå time ICA:" + recipe.time + ": recipe:" + recipe.source);
                        continue;
                    }
                    result[i].time = timeNumber;
                    recipe.time = timeNumber;

                } else if (recipe.source.indexOf("www.koket.se") > -1 && recipe.time) {
                    let timenr = 0;
                    let timeString = recipe.time + "";
                    parts = timeString.replace("ca", '').replace(",", ".").trim().split(" ");
                    for (let j = 0; j < parts.length; j++) {
                        if (Number.isInteger(parts[j] - 0) || parts[j].indexOf(".") > -1) {
                            if (!parts[j + 1] || parts[j + 1].indexOf("min") > -1 || parts[j + 1].indexOf("m") > -1) {
                                timenr += parts[j] - 0;
                            } else if (parts[j + 1].indexOf("dagar") > -1 || parts[j + 1].indexOf("dygn") > -1) {
                                timenr += parts[j] * 60 * 24;
                            } else if (parts[j + 1].indexOf("h") > -1) {
                                timenr += parts[j] * 60;
                            } else {
                                log.push("kunde inte förstå time KOKET:" + recipe.time + ": recipe:" + recipe.source);
                                break;
                            }
                            j++;
                        } else {
                            if (parts[j].indexOf("-") > -1) {
                                let nrparts = parts[j].split("-");
                                if (!parts[j + 1] || parts[j + 1].indexOf("m") > -1 || parts[j + 1].indexOf("min") > -1) {
                                    timenr += ((nrparts[0] - 0) + (nrparts[1] - 0)) / 2;
                                } else if (parts[j + 1].indexOf("h") > -1) {
                                    timenr += (((nrparts[0] - 0) + (nrparts[1] - 0)) / 2) * 60;
                                } else if (parts[j + 1].indexOf("d") > -1) {
                                    timenr += ((((nrparts[0] - 0) + (nrparts[1] - 0)) / 2) * 60) * 24;
                                }
                            } else if (parts[j].indexOf("h") > -1) {
                                timenr += (parts[j].substring(0, parts[j].indexOf("h")) - 0) * 60;
                            } else if (parts[j].indexOf("m") > -1) {
                                timenr += parts[j].substring(0, parts[j].indexOf("m")) - 0;
                            } else if (parts[j].indexOf("min") > -1) {
                                timenr += parts[j].substring(0, parts[j].indexOf("min")) - 0;
                            } else {
                                log.push("kunde inte förstå time KOKET:" + recipe.time + ": recipe:" + recipe.source);
                                break;
                            }
                        }
                    }
                    if (timenr === 0 || !Number.isInteger(timenr)) {
                        log.push("kunde inte förstå time KOKET:" + recipe.time + ": recipe:" + recipe.source);
                        continue;
                    }
                    timeNumber = timenr;
                    result[i].time = timeNumber;
                    recipe.time = timeNumber;
                } else if (recipe.source.indexOf("http://www.tasteline.com") > -1 && recipe.time) {
                    let timeString = recipe.time;
                    if (timeString.indexOf("minut") > -1) {
                        timeNumber = timeString.split(" ")[0] - 0;
                    } else if (timeString.indexOf("timm") > -1) {
                        timeNumber = (timeString.split(" ")[0] - 0) * 60;
                    } else {
                        log.push("kunde inte förstå time TASTELINE:" + recipe.time + ": recipe:" + recipe.source);
                        continue;
                    }
                    result[i].time = timeNumber;
                    recipe.time = timeNumber;
                }
            }

            recipe.ingredients = checkGrammar(recipe.ingredients);
            for (let f = 0; f < recipe.ingredients.length; f++) {
                //capitalize first letter
                if (!validateIngredient(recipe.ingredients[f])) {
                    log.push("invalid ingredient:" + recipe.ingredients[f].name);
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
                    //remove tags that already are ingredients
                    let tag = property.charAt(0).toUpperCase() + property.slice(1);
                    if (existingFoods.indexOf(tag) > -1) {
                        log.push("tag already exists as food: " + tag);
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
            nrOfRecipesCreated++;
            recipesRef.push(recipe);
            existingRecipeSources.push(recipe.source);
        }

        log.push("input nr: " + result.length);
        log.push("created recipes: " + nrOfRecipesCreated);
        console.log("input nr: " + result.length);
        console.log("created recipes: " + nrOfRecipesCreated);
        fs.writeFile("C:/react/" + filename + "-LOG.json", JSON.stringify(log), function (err) {
            if (err) {
                return console.log(err);
            }
            log.push("logfile saved!");
        });
        fs.writeFile("C:/react/recipesbackup/" + filename + ".json", JSON.stringify(result), function (err) {
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
    if ((recipe.ingredients.length / invalidIngredients) < 5) {
        msg.cause = "recipe contains to many wierd ingredients";
        return msg;
    }
    if (!recipe.votes || (recipe.votes && recipe.votes < 2)) {
        msg.cause = "recipe has less than 2 votes";
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