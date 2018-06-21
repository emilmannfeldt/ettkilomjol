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
let recipesRef = firebase.database().ref("recipes");
let foodRef = firebase.database().ref("foods");
let tagRef = firebase.database().ref("tags");
let unitsRef = firebase.database().ref("units");

var fs = require('fs');
let existingFoods = [];
let existingTags = [];
let units = {};
let filename = "fixFaultyIngredients";
let log = [];
let foodLoaded = false;
let tagLoaded = false;
let unitsLoaded = false;

firebase.auth().signInAnonymously().catch(function (error) { });
firebase.auth().onAuthStateChanged(function (user) {
  console.log("start");
  if (user) {
    foodRef.orderByChild("uses").once("value", function (snapshot) {

      snapshot.forEach(function (child) {
        if (child.val().uses == 0) {
          existingFoods.splice(0, 0, child.val().name);
        }
      });

      foodLoaded = true;
      if (foodLoaded && tagLoaded && unitsLoaded) {
        runRecipes();
      }
    });
    tagRef.orderByChild("uses").once("value", function (snapshot) {

      snapshot.forEach(function (child) {
        existingTags.splice(0, 0, child.val().name);
      });
      tagLoaded = true;
      if (foodLoaded && tagLoaded && unitsLoaded) {
        runRecipes();
      }
    });
    unitsRef.once("value", function (snapshot) {
      units.length = 0;
      snapshot.forEach(function (child) {
        units = Object.keys(snapshot.val()).map(function (key) { return snapshot.val()[key]; });
        units.sort(function (a, b) {
          return a.ref - b.ref;
        });

      });
      unitsLoaded = true;
      if (foodLoaded && tagLoaded && unitsLoaded) {

        runRecipes();
      }
    });
  }
});

function runRecipes() {
  //script för att  hitta alla recept som har någon ingrediens med ett visst antal uses
  let namel = 0;
  let numberRec = 0;
  recipesRef.once('value', function (snapshot) {
    console.log("Receipes loaded");
    snapshot.forEach(function (child) {
      let busted = false;
      let recipe = child.val();
      let originRecipe = child.val();
      let ingredientsFound = [];
      let ingredientToMerge = {};
      let ingredientIndexesToRemove = [];
      let ingredientsToSkip = [];
      let deleteRecipe = false;
      //lägg till funktion för att slå ihop dubletter av ignredienser...
      //om de har olika units så kolla om det täcks av min unit converter
      //tänk på att det kan vara tre av samma och fler till och med
      //tänker något sånt här:
      //loopa igenom ignredienser och spara undan namnen i en array. När en dubblet hittas så spara ner den ingrediensen i en variabel ingredientToMerge
      //ta sen bort den ingrediensen från receptet
      //sätta i = 0 och loopa igenom alla ingredienser igen. När man hittar matchningen för ingredientToMerge.name så adera amount från ingredientToMerge
      //om det är olika unit så hantera det i unit converter. om det itne går så återskapa ingrediensen ingredientToMerge till receptet. kolla hur ofta detta händer.
      // om det händer att det inte går att fixa så ta bort hela receptet
      //det får bli en egen metod för mergeIngredients() som kollar på unit och amount osv.
      //när loopen har gått igenom alla ingredienser så tyder det på att det inte finns några dubbletter att rätta till kvar.
      //snygga till så att rättnignen för förp osv är separerat i ev egen metod också.
      //lägg till allt detta i createRecipes.js?? nej måste vara efter changeName, kanske i changeName? eller inte
      //
      let changesmade = false;
      console.log("recipe running:" + recipe.source);

      for (let i = 0; i < recipe.ingredients.length; i++) {
        let ingredient = recipe.ingredients[i];

        if (ingredient.name.startsWith("Förp ") && (!ingredient.unit || ingredient.unit === "st")) {
          log.push("ingred changed from:" + ingredient.unit + ingredient.name);
          recipe.ingredients[i].name = ingredient.name.substring(5).trim();
          recipe.ingredients[i].name = recipe.ingredients[i].name.charAt(0).toUpperCase() + recipe.ingredients[i].name.slice(1);
          recipe.ingredients[i].unit = "förp";
          changesmade = true;
          log.push("to:" + recipe.ingredients[i].unit + " " + recipe.ingredients[i].name + "source:" + recipe.source);
        } else if (ingredient.name.startsWith("Port ")) {
          log.push("ingred changed from:" + ingredient.unit + ingredient.name);
          recipe.ingredients[i].name = ingredient.name.substring(5).trim();
          recipe.ingredients[i].name = recipe.ingredients[i].name.charAt(0).toUpperCase() + recipe.ingredients[i].name.slice(1);
          recipe.ingredients[i].unit = "port";
          changesmade = true;
          log.push("to:" + recipe.ingredients[i].unit + " " + recipe.ingredients[i].name + "source:" + recipe.source);
        } else if (ingredient.name.startsWith("Skivor ")) {
          log.push("ingred changed from:" + ingredient.unit + ingredient.name);
          recipe.ingredients[i].name = ingredient.name.substring(7).trim();
          recipe.ingredients[i].name = recipe.ingredients[i].name.charAt(0).toUpperCase() + recipe.ingredients[i].name.slice(1);
          recipe.ingredients[i].unit = "Skivor";
          changesmade = true;
          log.push("to:" + recipe.ingredients[i].unit + " " + recipe.ingredients[i].name + "source:" + recipe.source);
        }


      }

      for (let i = 0; i < recipe.ingredients.length; i++) {
        if (ingredientsToSkip.indexOf(i) > -1) {
          continue;

        }
        let ingredient = recipe.ingredients[i];
        if (ingredientToMerge.name == ingredient.name && ingredientIndexesToRemove.indexOf(i) < 0) {
          log.push("starting merge of: " + ingredientToMerge.name + " for recipe:" + recipe.source);
          if (ingredient.unit == ingredientToMerge.unit || (!ingredient.unit && !ingredientToMerge.unit && ingredientToMerge.amount && ingredient.amount)) {
            let amount1 = recipe.ingredients[i].amount ? +recipe.ingredients[i].amount : 1;
            let amount2 = ingredientToMerge.amount ? +ingredientToMerge.amount : 1;
            recipe.ingredients[i].amount = amount1 + amount2;
            ingredientIndexesToRemove.push(ingredientToMerge.index);
            //TESTKÖR DETTA UTAN CHANGESMADE AKTIV. SE HUR MÅNGA MERGE ERRORS SOM FINNS OCH HUR DE SER UT?
            //om unit skiljer sig så kolla om både units finns med i firebase.units. Om så är fallet så omvandla den den lägre valören till den högre och addera sen amounts
            //kan även köra en checkUnit() efteråt? ifall det skulle bli 20msk så vill jag ändra om det till något enklare
            //checkunit kan ju köras här var gång?? annars efteråt

            //finns ett tiotal recept som är fel vid unit volym - vikt. Går inte att lösa. Måste fixa i algoritmen att det endast räknas som en träff!!
            //finns även flera inom vikt och volym av olika kvaniteter dl - msk etc. detta kan vi merga med hjälp av units nedan.
            changesmade = true;
          } else if (!ingredient.unit && !ingredientToMerge.unit && !ingredientToMerge.amount && !ingredient.amount){
            ingredientIndexesToRemove.push(ingredientToMerge.index);
            changesmade = true; 
          }else if (isSameUnitScale(ingredient.unit, ingredientToMerge.unit)) {
            let mergedIngredient = mergeUnits(ingredient, ingredientToMerge);
            if(mergedIngredient && mergedIngredient.unit && mergedIngredient.amount && mergedIngredient.name){
              recipe.ingredients[i] = mergedIngredient;
              ingredientIndexesToRemove.push(ingredientToMerge.index);
              changesmade=true;
            }
            log.push("merge and checkunits done: " + JSON.stringify(ingredient));

          }
          else {
            log.push("merge error:" + ingredientToMerge.unit + " " + recipe.ingredients[i].unit + "source:" + recipe.source);
            if(ingredientToMerge.unit && recipe.ingredients[i].unit){
              deleteRecipe = true;
            }
            ingredientsToSkip.push(ingredientToMerge.index);
          }

          delete ingredientToMerge.index;
          ingredientToMerge = {};
        } else if (ingredientsFound.indexOf(ingredient.name) > -1 && ingredientIndexesToRemove.indexOf(i) < 0) {
          ingredientToMerge = ingredient;
          ingredientToMerge.index = i;
          i = 0;
          ingredientsFound.length = 0;
        } else {
          ingredientsFound.push(ingredient.name);
        }
      }

      if(ingredientsToSkip.length>0){
        //visa recept så är det ingrediensen i ingredientsSkip som har unit 
        //och inte den som är undefined. kan jag fixa det?
        //kanske använda en annan lista än ingredientsToSkip för att avgöra om receptet ska tas bort.
        //skapa en variabel deleteRecipe längre upp och sätt den till true om det merge error units på båda ingredienserna

        //ser bättre ut nu
        //nytt fel https://www.koket.se/skinkstek-fran-as "ca 5" har kommit in som amount från koket.se
        //skapa ärende på det och se över om det finns fler med ca i amount och hur det är möjligt??
        //borde vara numeriskt
        if(deleteRecipe){
          log.push("---------------------------------------------------------------------------------------------");
          log.push("DELETING recipe>" + recipe.source);
          log.push("IngredientsToSKip:" + JSON.stringify(ingredientsToSkip))
          log.push("---------------------------------------------------------------------------------------------");
          recipesRef.child(child.key).remove();
        }else{
          log.push("skip DELETING recipe>" + recipe.source);
        }
      }else if(changesmade) {
        for (let i = ingredientIndexesToRemove.length - 1; i >= 0; --i) {
          recipe.ingredients.splice(ingredientIndexesToRemove[i], 1);
          //flrändringads de andra indexarna nu då? tas fel bort? måste ta i rätt ordning? högst index först?
        }
        log.push("---------------------------------------------------------------------------------------------");
        log.push("changesmade:" + recipe.source);
        log.push(JSON.stringify(originRecipe.ingredients));
        log.push("result:");
        log.push(JSON.stringify(recipe.ingredients));
        log.push("---------------------------------------------------------------------------------------------");

      var recipeRef = recipesRef.child(child.key);
      recipeRef.update(recipe);
      }
      function mergeUnits(ingredientA, ingredientB) {
        log.push("merging units ingredient A " + JSON.stringify(ingredientA) + "----------- INgredient B " + JSON.stringify(ingredientB));
        let ingredientResult = {};
        ingredientResult.name = ingredientA.name;
        let foundUnitA;
        let foundUnitB;
        for (let i = 0; i < units.length; i++) {
          for (let unit in units[i]) {
            if (units[i].hasOwnProperty(unit)) {
              let curUnit = units[i][unit];
              if (curUnit.name === ingredientA.unit || curUnit.fullName === ingredientA.unit) {
                foundUnitA = curUnit;
              }
              if (curUnit.name === ingredientB.unit || curUnit.fullName === ingredientB.unit) {
                foundUnitB = curUnit;
              }
            }
          }
        }
        if (foundUnitA.ref > foundUnitB.ref) {
          let refDiff = foundUnitA.ref / foundUnitB.ref;
          ingredientA.amount = ingredientA.amount * refDiff;
          ingredientA.unit = ingredientB.unit;
        } else {
          let refDiff = foundUnitB.ref / foundUnitA.ref;
          ingredientB.amount = ingredientB.amount * refDiff;
          ingredientB.unit = ingredientA.unit;
        }
        ingredientResult.unit = ingredientA.unit;
        ingredientResult.amount = +ingredientA.amount + +ingredientB.amount;

        //den ingrediensen som har den högre uniten ska jag konvertera till den lägre och sen adderar jag amountsen när de är samma unit
        //efter addering så kan jag köra checkUnit() för att möjligen konvertera om det till en högra scale om det behövs
        log.push("merge fininshed: " + JSON.stringify(ingredientResult));

        return checkUnit(ingredientResult);

      }
      function isSameUnitScale(unitA, unitB) {
        let foundUnitA;
        let foundUnitB;
        for (let i = 0; i < units.length; i++) {
          for (let unit in units[i]) {
            if (units[i].hasOwnProperty(unit)) {
              let curUnit = units[i][unit];
              if (curUnit.name === unitA || curUnit.fullName === unitA) {
                foundUnitA = curUnit;
              }
              if (curUnit.name === unitB || curUnit.fullName === unitB) {
                foundUnitB = curUnit;
              }
            }
          }
        }
        if (!foundUnitB || !foundUnitA) {
          return false;
        }
        log.push("foundunits" + foundUnitB.name + " " + foundUnitA.name);
        if (foundUnitA.type === foundUnitB.type) {
          log.push("foundunits return true");

          return true;
        }
        log.push("foundunits return false");
        return false;
      }

      function checkUnit(ingredient) {
        let foundUnit = {};
        for (let i = 0; i < units.length; i++) {
          for (let unit in units[i]) {
            if (units[i].hasOwnProperty(unit)) {
              let curUnit = units[i][unit];
              if (curUnit.name === ingredient.unit) {
                foundUnit = curUnit;
              }
            }
          }
        }
        if (ingredient.amount >= foundUnit.max) {
          ingredient = findHigherUnit(ingredient, foundUnit);
        }
        else if (ingredient.amount <= foundUnit.min) {
          ingredient = findLowerUnit(ingredient, foundUnit);
        }
        //här använder jag även lib fraction.js för att hantera decimaler till bråkdelar
        //avrunda till närmsta 1/16 del? 0.0625 
        //http://stackoverflow.com/questions/1506554/how-to-round-a-decimal-to-the-nearest-fraction
        //if decimaler finns så fixa fractions istället. 1/16 är det lägsta
        ingredient.amount = closestDecimals(+ingredient.amount);
        //ingredient.amount = Math.round(+ingredient.amount * 100) / 100;
        return ingredient;
      }
      function findLowerUnit(ingredient, selectedUnit) {
        let selectedRef = ingredient.amount * selectedUnit.ref;
        let finalIngredient = ingredient;
        let newUnit;
        let unitsIndex;
        if (selectedUnit.type === 'volume') {
          unitsIndex = 0;
        } else if (selectedUnit.type === 'weight') {
          unitsIndex = 1;
        }
        for (let unit in units[unitsIndex]) {
          if (units[unitsIndex].hasOwnProperty(unit)) {
            let curUnit = units[unitsIndex][unit];
            if ((selectedRef / curUnit.ref > curUnit.min) && (!newUnit || curUnit.ref > newUnit.ref)) {
              newUnit = curUnit;
            }
          }
        }
        finalIngredient.amount = selectedRef / newUnit.ref;
        finalIngredient.unit = newUnit.name;
        return finalIngredient;
      }


      function findHigherUnit(ingredient, selectedUnit) {
        let selectedRef = ingredient.amount * selectedUnit.ref;
        let finalIngredient = ingredient;
        let newUnit;
        let unitsIndex;
        if (selectedUnit.type === 'volume') {
          unitsIndex = 0;
        } else if (selectedUnit.type === 'weight') {
          unitsIndex = 1;
        }
        for (let unit in units[unitsIndex]) {
          if (units[unitsIndex].hasOwnProperty(unit)) {
            let curUnit = units[unitsIndex][unit];
            if ((selectedRef / curUnit.ref < curUnit.max) && (!newUnit || curUnit.ref < newUnit.ref)) {
              newUnit = curUnit;
            }
          }
        }
        finalIngredient.amount = selectedRef / newUnit.ref;
        finalIngredient.unit = newUnit.name;
        return finalIngredient;
      }
      function closestDecimals(num) {
        let arr = [0, 0.1, 0.2, 0.25, 0.33, 0.4, 0.5, 0.6, 0.66, 0.75, 0.8, 0.9];
        num = num.toFixed(3);
        let decimal = num - (Math.floor(num));
        var curr = arr[0];
        var diff = Math.abs(decimal - curr);
        for (let i = 0; i < arr.length; i++) {
          if(arr[i] >= decimal){
            curr = arr[i];
            break;
          }
          if(i==arr.length-1){
            curr = 1;
          }
        }
        return num - decimal + curr;
      }


    });
    console.log("recipes: " + numberRec);
    fs.writeFile("C:/react/datachange" + filename + "-LOG.json", JSON.stringify(log), function (err) {
      if (err) {
        return console.log(err);
      }
      console.log("logilfe save")
      log.push("logfile saved!");
    });

  });
}