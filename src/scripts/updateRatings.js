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
var Nightmare = require('nightmare');
var nightmare = Nightmare({
    openDevTools: false, show: false, webPreferences: {
        images: false,
    }
})
var fs = require('fs');
//hämta ut alla recept från firebase
//lägg till alla sources i en array
let urls = [];
let tmpUrls = [];
firebase.auth().signInAnonymously().catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
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

                //if(child.val().source.indexOf("koket.se")> -1){
                //  urls.push(child.val().source);
                //recipesRef.child(child.key).remove();
                //}
            });
            console.log("recipes fetched");
            //vet inte om det går att göra såhär för att läsa in sources och sen köra nightmare.
            //kanske måste fixa en .json med alla sources och läsa den
            //då blir det precis som webscrapers-scripten. kanske bara kan ta 1k itagedt. 
            console.time('someFunction');
            //updateRecipes();
            console.timeEnd('someFunction');
            fs.writeFile("C:/react/updateRating-LOG1" + urls.length + ".json", JSON.stringify(urls), function (err) {

                if (err) {
                    return console.log(err);
                }

                console.log("The file was saved!");
            });



        });

        console.log("LOGGED IN");
    }
    else {
    }
});
//det tar väldigt lång tid.
//går det bättre om jag delar upp det i flera script?
//ett som går igenom en lista med urls och sparar ner en json fil med source, votes, rating.
// ett script som går igenom denna json-fil och updaterar votes och rating på rätt source om det skiljer sig.
function updateRecipes() {
    if (urls.length === 0) {
        return;
        console.log("stopping urls out");
    }

    console.log(urls.length);
    tmpUrls = urls.splice(0, 900);
    nightmare
        .goto('http://www.tasteline.com/recept/')
        .evaluate(function () {

        })
        .then(function (hrefs) {
            console.log("start");
            console.log("nr of tmpUrls: " + tmpUrls.length);
            uniqurls = [...new Set(tmpUrls)];
            console.log("uniq : " + uniqurls.length);
            return uniqurls.reduce(function (accumulator, href) {
                return accumulator.then(function (results) {
                    return nightmare.goto(href)
                        .evaluate(function () {
                            let update = {};
                            update.source = window.location.href;
                            update.votes = 0;
                            update.rating = 0;
                            if (update.source.indexOf("www.ica.se") > -1) {
                                update.rating = document.querySelector('.recipepage header .recipe-header a.rating-stars').getAttribute("title");
                                update.votes = document.querySelector('.recipepage header .recipe-header a.rating-stars .recipe-meta .js-number-of-votes').innerHTML;
                            } else if (update.source.indexOf("www.koket.se") > -1) {
                                update.rating = document.querySelector('.recipe-content-wrapper .rating-container.rating').getAttribute("data-setrating");
                                if (document.querySelector('.recipe-content-wrapper .rating-container.rating span.text')) {
                                    update.votes = document.querySelector('.recipe-content-wrapper .rating-container.rating span.text').innerHTML.split(" ")[0];
                                }
                            } else if (update.source.indexOf("www.tasteline.com") > -1) {
                                if (document.querySelector('.page-content .recipe-description .recipe-rating.voting-enabled i')) {
                                    let ratingLine = document.querySelector('.page-content .recipe-description .recipe-rating.voting-enabled').getAttribute("title");
                                    let parts = ratingLine.split("Antal röster:");
                                    update.votes = parts[1].trim();
                                    update.rating = parts[0].split(":")[1].trim();
                                }
                            } else {
                                console.log("ERRROS ingen känd source");
                            }
                            if (update.votes === 0) {
                                console.log("0 votes på:" + update.source);
                                return;
                            }
                            return update;
                        })
                        .then(function (update) {
                            results.push(update);
                            return results;
                        })
                });
            }, Promise.resolve([]))
        })
        .then(function (resultArr) {
            //här har jag nu en lista med update object.
            console.log(resultArr.length);
            let log = [];
            for (let i = 0; i < resultArr.length; i++) {
                let logger = {};

                if (!resultArr[i]) {
                    continue;
                }
                let update = resultArr[i];
                logger.source = update.source;
                logger.votes = update.votes;
                logger.rating = update.rating;
                let ref = firebase.database().ref("recipes");
                ref.orderByChild("source").equalTo(update.source).on("child_added", function (snapshot) {
                    let recipeID = snapshot.key;
                    if (snapshot.val().votes !== update.votes || snapshot.val().rating !== update.rating) {
                        firebase.database().ref('recipes/' + recipeID).update({
                            votes: update.votes,
                            rating: update.rating
                        });
                        logger.operation = "updaterat";
                        console.log("updaterat:" + update.source);
                    } else {
                        console.log("ingen uppdatering:" + update.source);
                    }
                });
                log.push(logger);


                //hur hittar jag enklast rätt recept? kolla enkel query firebase.
                //använd update.source för att hitta rätt recept i firebase
                //updatera receptet med update.rating och update.votes
            }

            fs.writeFile("C:/react/updateRating-LOG" + urls.length + ".json", JSON.stringify(log), function (err) {

                if (err) {
                    return console.log(err);
                }

                console.log("The file was saved!");
            });

        });

    console.log("done");

    //downloads: 2.7gb

}