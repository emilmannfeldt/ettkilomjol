var Nightmare = require('nightmare');
var nightmare = Nightmare({
    openDevTools: false, show: false, webPreferences: {
        images: false,
    }
})

var fs = require('fs');


//ta fram urls genom att:
//1. skapa ett script för att gå igenom alla http://www.tasteline.com/recept/?sida=2#sok där sida ökas på. Spara ner href från varje sida till en fil
//2. paste in i urls
//3. Sätt filename enligt "TASTELINE-RECEPTSRC-DATE.json"
//4. kör node set DEBUG=nightmare && node tasteline.js
//5. kör node createRecipes.js och ange namnet på filen som skapades här


let urls = [];
let filename = "tasteline/tasteline-12.1-2017-11-16.json";

nightmare
    .goto('http://www.tasteline.com/recept/')
    .evaluate(function () {

    })
    .then(function (hrefs) {

        console.log("start");
        console.log("nr of urls: " + urls.length);
        uniqurls = [...new Set(urls)];
        console.log("uniq : " + uniqurls.length);
        return uniqurls.reduce(function (accumulator, href) {
            return accumulator.then(function (results) {
                return nightmare.goto(href)
                    .evaluate(function () {
                        if (!document.querySelector('.page-content .recipe-content')) {
                            return;
                        }
                        let recipe = {};
                        //title
                        recipe.title = document.querySelector('.page-content .recipe-description h1').innerHTML.trim();
                        //tags
                        let tags = {};
                        //cannot read property length of null
                        $('.page-content .recipe-description .category-list a').each(function () {
                            let t = $(this).text();
                            if (t.match(/^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/)) {
                                t = t + "FAILEDTAG";
                            }
                            tags[t.charAt(0).toUpperCase() + t.slice(1).replace(/\s*\([^()]*\)$/, '').split(",")[0].replace(/([/.#$])/g, '').trim()] = true;


                        })
                        recipe.tags = tags;
                        //source
                        recipe.source = window.location.href;

                        //votes rating
                        if (document.querySelector('.page-content .recipe-description .recipe-rating.voting-enabled i')) {
                            let ratingLine = document.querySelector('.page-content .recipe-description .recipe-rating.voting-enabled').getAttribute("title");
                            let parts = ratingLine.split("Antal röster:");
                            recipe.votes = parts[1].trim();
                            recipe.rating = parts[0].split(":")[1].trim();
                        }
                        //author
                        if (document.querySelector('.page-content .recipe-author-text-inner span')) {
                            recipe.author = document.querySelector('.page-content .recipe-author-text-inner span').innerText.trim();
                        } else {
                            recipe.author = "tasteline.com";
                        }

                        //createdFor

                        //portions
                        if (document.querySelector('.page-content .recipe-content .portions')) {
                            recipe.portions = document.querySelector('.page-content .recipe-content .portions').getAttribute('data-portions');
                        }
                        //created

                        //description
                        if (document.querySelector('.page-content .recipe-ingress')) {
                            recipe.description = document.querySelector('.page-content .recipe-ingress').innerHTML.replace(/(\r\n|\n|\r|<[^>]*>)/gm, "").replace(/  +/g, ' ').trim();
                        }

                        //time
                        if (document.querySelector('.page-content .recipe-description .fa-clock-o')) {
                            let timeString = document.querySelector('.page-content .recipe-description .fa-clock-o').nextSibling.nodeValue.trim();
                            if (timeString.indexOf("minut") > -1) {
                                recipe.time = timeString.split(" ")[0] - 0;
                            } else if (timeString.indexOf("timm") > -1) {
                                recipe.time = (timeString.split(" ")[0] - 0) * 60;
                            } else {
                                return;
                            }
                            if (recipe.time < 25) {
                                if (!tags.hasOwnProperty('Snabbt')) {
                                    tags["Snabbt"] = true;
                                }
                            }
                        }
                        //denna är kvar att fixa till
                        //ingredients
                        if (document.querySelector('.page-content .ingredient-group li')) {
                            let ingredientgroups = document.querySelector('.page-content').getElementsByClassName('ingredient-group');
                            let ingredients = [];
                            let ingredientNames = [];
                            for (let i = 0; i < ingredientgroups.length; i++) {
                                let ingredientsDom = ingredientgroups[i].getElementsByTagName("li");
                                for (let j = 0; j < ingredientsDom.length; ++j) {
                                    let ingredient = {};
                                    ingredient.amount = ingredientsDom[j].getElementsByClassName("quantity")[0].getAttribute('data-quantity');
                                    ingredient.unit = ingredientsDom[j].getElementsByClassName("unit")[0].getAttribute('data-unit-name');
                                    if (!ingredientsDom[j].getElementsByClassName("ingredient")[0]) {
                                        return;
                                    }
                                    let namepart = ingredientsDom[j].getElementsByClassName("ingredient")[0].getElementsByTagName("span")[0].innerHTML.trim();
                                    ingredient.name = namepart.charAt(0).toUpperCase() + namepart.slice(1).replace(/\s*\([^()]*\)$/, '').split(",")[0].replace(/([/.#$])/g, '').trim();
                                    if (ingredientNames.indexOf(ingredient.name) > -1) {
                                        continue;
                                    }
                                    ingredientNames.push(ingredient.name);
                                    ingredients.push(ingredient);
                                    //måste göra om till innerHTML och ta ut det som ligger i spanet till amount 
                                    //och det andra får först trimmas och sen splitas på " " och ta ut [0] till unit

                                }
                            }
                            recipe.ingredients = ingredients;
                        }

                        if (!recipe.ingredients || recipe.ingredients.length === 0 || (recipe.time && recipe.time < 1)) {
                            return;
                        }

                        //difficulty
                        let instructionsList = document.querySelector('.page-content .recipe-content .steps').getElementsByTagName("li");
                        let nrOfIngredients = recipe.ingredients.length;
                        let instructionLength = 0;
                        for (let i = 0; i < instructionsList.length; i++) {
                            instructionLength = instructionLength + instructionsList[i].innerHTML.replace(/(\r\n|\n|\r|)/gm, "").trim().length;
                        }
                        instructionLength = instructionLength - instructionsList.length * 10;

                        let levelIndex = (nrOfIngredients * 8) + (instructionLength / 14);
                        if (recipe.tags.hasOwnProperty('Enkelt') || recipe.tags.hasOwnProperty('Lättlagat')) {
                            levelIndex = levelIndex - 100;
                        }
                        if (recipe.tags.hasOwnProperty('Snabbt')) {
                            levelIndex = levelIndex - 20;
                        }

                        if (levelIndex < 100) {
                            recipe.level = 1;
                        } else if (levelIndex < 200) {
                            recipe.level = 2;
                        } else {
                            recipe.level = 3;
                        }


                        return recipe;
                    })
                    .then(function (html) {
                        results.push(html);
                        return results;
                    })

            });
        }, Promise.resolve([]))
    })
    .then(function (resultArr) {
        console.log(resultArr.length);

        fs.writeFile("C:/react/" + filename, JSON.stringify(resultArr), function (err) {

            if (err) {
                return console.log(err);
            }

            console.log("The file was saved!");
        });
    });