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
var Nightmare = require('nightmare');
var nightmare = Nightmare({
    openDevTools: false, show: false, webPreferences: {
        images: false,
    }
})
var fs = require('fs');
//alla olika creme fraiche, 
//särskrivningar, gullök/gul lök. kolla upp vad som är korrekt/flest uses/enklast att söka fram i autopsuggester
//strimlad kycklingfile / kycklingfile? foods som har ord som "strimlad" "krossad" "tärnad" "skalad" "hackad" "sköljd" "riven" etc framför sig
//extra koll på dessa processord? om det finns en food som heter samma fast utan processordet så använd det foodet istället? Vilka processord funkar det säkert på?
//ost/ riven ost? 
//fixa bug med att bilden inte hittas på githubpages. lägga img katalogen i src? eller i resource katalog brevid src?
 
let changeFrom = ["glutenfritt", "glutenfria"];
let changeTo = ["glutenfri", "glutenfri"];
let caseSensetive = false;
let isFood = false;
let nrChanged = 0;
firebase.auth().signInAnonymously().catch(function (error) {

});
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        console.log("logged in,");
        recipesRef.once('value', function (snapshot) {
            console.log("fetching recipes");

            snapshot.forEach(function (child) {
                //skapa ett separat script för ingrediens / tag byte.
                //input är vad som ska bytas ifrån och vad det ska bytas till samt om det gäller tags eller foods
                //ändra glutenfritt till glutenfri
                let recipe = child.val();
                if(isFood){
                    for (let i = 0; i < recipe.ingredients.length; i++) {
                        if(recipe.ingredients[i].name == changeFrom){
                            //GÖR DETTA I CREATE RECIPES och sen läs om alla recept från backup json. Rensa alla recept, foods och tags
                            //Idag:
                            //1. Detta tillägg till createrecipes
                            //1.a Fixa buggarna, bilden och nan time ica
                            //2. Bild och toolbar på plats 
                            //3. formspree för kontaktformulär feedback/buggrättning/förslag/vörigt
                            //
                            //update name
                            //save count to know how much to add to uses to the other food objekt
                            //se till så att receptet inte redan har den som de byter till, om den redan har det så ta bara bort, lägg inte till namnet eller uses.
                            //samma sak om ett recpet har t.ex två olika changefrom som ska bytas till samma changeto. gör bara det första bytet och det andra ska bara tas bort, 1 uses + inte 2
                            nrChanged = nrChanged +1;
                            //after no food left with changeFrom name. remove changeFrom from firebase and update uses on changeTo
                        }
                      }
                }else{

                }

                
                //if(child.val().source.indexOf("koket.se")> -1){
                  //  urls.push(child.val().source);
                    //recipesRef.child(child.key).remove();
                //}
            });
            console.log("recipes fetched");




        });

    }
});