var Nightmare = require('nightmare');
var nightmare = Nightmare({
    openDevTools: false, show: false, webPreferences: {
        images: false,
    }
})

var fs = require('fs');


//ta fram urls genom att:
//1. var hrefs=[]; var interv=setInterval(function(){if(document.querySelector('#search-button-more')){document.querySelector('#search-button-more').click();}else{hrefs=Array.from(document.querySelectorAll('.search .tile-item--recipe a')).map(a => a.href);console.log("done");clearInterval(interv);}},1500);

let urls = [];
let filename = "mittkok/mittkok2_2018-03-15.json";
//läs om alla mittkok då ignredient name in hade uppercase. 
//se till att inte köra alla 2600 recept in i createrecipes samtidigt. blir för mycket för transactions på uses. eller då kör recountuses.js efteråt.
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
                        if (!document.querySelector('.recipe .recipe__content')) {
                            return;
                        }
                        let recipe = {};
                        //title
                        recipe.title = document.querySelector('.recipe__title').innerHTML.trim();
                        //tags
                        let tags = {};
                        //cannot read property length of null
                        $('.recipe .recipe__tags a').each(function () {
                            let t = $(this).text();
                            if (t.match(/^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/)) {
                                t = t + "ERROR";
                            }
                            tags[t.charAt(0).toUpperCase() + t.slice(1).replace(/\s*\([^()]*\)$/, '').split(",")[0].replace(/([/.#$])/g, '').trim()] = true;


                        })
                        recipe.tags = tags;
                        //source
                        recipe.source = window.location.href;

                        //votes rating
                        if (document.querySelector('.recipe .recipe__rate .rate__meta')) {
                            recipe.votes = document.querySelector('.recipe .recipe__rate .rate__meta meta[itemprop=ratingCount]').getAttribute("content").trim();
                            recipe.rating = document.querySelector('.recipe .recipe__rate .rate__meta meta[itemprop=ratingValue]').getAttribute("content").trim();
                        }
                        //author
                        if (document.querySelector('.recipe .author__name')) {
                            recipe.author = document.querySelector('.recipe .author__name span[itemprop=name]').innerText.trim();
                        } else {
                            recipe.author = "Mitt kök";
                        }

                        //createdFor

                        //portions
                        if (document.querySelector('.recipe .recipe__portions')) {
                            let portionsString = document.querySelector('.recipe .recipe__portions').innerHTML.trim().split(" ")[0];
                            if (portionsString.indexOf("–") > -1) {
                                let firstPart = +portionsString.split("–")[0];
                                let secondPart = +portionsString.split("–")[1];
                                recipe.portions = (firstPart + secondPart) / 2;
                            } else if (portionsString.indexOf("-") > -1) {
                                let firstPart = +portionsString.split("-")[0];
                                let secondPart = +portionsString.split("-")[1];
                                recipe.portions = (firstPart + secondPart) / 2;
                            } else {
                                recipe.portions = +portionsString.trim();
                            }
                            if (isNaN(recipe.portions)) {
                                recipe.portions = "ERROR:" + recipe.portions;
                            }
                        }
                        //created

                        //description
                        if (document.querySelector('.recipe .recipe__description p')) {
                            recipe.description = document.querySelector('.recipe .recipe__description p').innerHTML.replace(/(\r\n|\n|\r|<[^>]*>)/gm, "").replace(/  +/g, ' ').trim();
                        }

                        //time
                        if (document.querySelector('.recipe time.recipe__time')) {
                            //90 minuter
                            //2.5 tim
                            //2 timmar
                            let timeString = document.querySelector('.recipe time.recipe__time').innerHTML.trim();
                            if (timeString.indexOf("min") > -1 && timeString.indexOf("tim") > -1) {
                                recipe.time = "ERROR" + timeString;
                            } else if (timeString.indexOf("min") > -1) {
                                if (timeString.indexOf("–") > -1) {
                                    let firstPart = +timeString.split("–")[0];
                                    let secondPart = +timeString.split("–")[1];
                                    recipe.time = (firstPart + secondPart) / 2;
                                } else if (timeString.indexOf("-") > -1) {
                                    let firstPart = +timeString.split("-")[0];
                                    let secondPart = +timeString.split("-")[1];
                                    recipe.time = (firstPart + secondPart) / 2;
                                } else {
                                    recipe.time = timeString.split(" ")[0] - 0;
                                }
                            } else if (timeString.indexOf("tim") > -1) {
                                if (timeString.indexOf("–") > -1) {
                                    let firstPart = +timeString.split("–")[0];
                                    let secondPart = +timeString.split("–")[1];
                                    recipe.time = ((firstPart + secondPart) / 2) * 60;
                                } else if (timeString.indexOf("-") > -1) {
                                    let firstPart = +timeString.split("-")[0];
                                    let secondPart = +timeString.split("-")[1];
                                    recipe.time = ((firstPart + secondPart) / 2) * 60;
                                } else {
                                    recipe.time = (timeString.split(" ")[0] - 0) * 60;
                                }
                            } else {
                                recipe.time = "ERROR" + timeString;
                            }
                            if (recipe.time < 25) {
                                if (!tags.hasOwnProperty('Snabbt')) {
                                    tags["Snabbt"] = true;
                                }
                            }
                        }
                        //ingredients
                        if (document.querySelector('.recipe .recipe__ingredients--inner ul li')) {
                            let ingredientList = document.querySelectorAll('.recipe__ingredients--inner li');
                            //ingredienser unit amount delas med visst antal mellanslag
                            //ostadigt sätt att hantera 1/2 och 3-4 osv. på amount som fastnat i name. 
                            //testa och det går alltid att backa genom att ta bort alla recept som innehåller "mittkok" i source.
                            //uppskattad förväntad antal inlästa recept 2000-2500
                            let ingredients = [];
                            let ingredientNames = [];
                            for (let i = 0; i < ingredientList.length; i++) {
                                let ingredientArray = ingredientList[i].getElementsByTagName("span")[0].innerHTML.replace(/(\r\n|\n|\r|<[^>]*>)/gm, "").replace(/&#8232;/g, "").split("            ");
                                let ingredient = {};
                                if (ingredientArray.length === 1) {
                                    ingredient.name = ingredientArray[0].trim().replace(/\s*\([^()]*\)$/, '').split(",")[0].replace(/([.#$])/g, '').trim();
                                }
                                if (ingredientArray.length === 2) {
                                    ingredient.amount = ingredientArray[0].trim();
                                    ingredient.name = ingredientArray[1].trim().replace(/\s*\([^()]*\)$/, '').split(",")[0].replace(/([.#$])/g, '').trim();
                                }
                                if (ingredientArray.length === 3) {
                                    ingredient.amount = ingredientArray[0].trim();
                                    ingredient.unit = ingredientArray[1].trim();
                                    ingredient.name = ingredientArray[2].trim().replace(/\s*\([^()]*\)$/, '').split(",")[0].replace(/([.#$])/g, '').trim();
                                }
                                if (ingredientArray.length > 3) {
                                    ingredient.name = "ERROR:" + ingredientArray.toString();
                                }
                                if (!isNaN(ingredient.name.split(" ")[0]) && ingredient.name.split(" ").length === 2) {
                                    ingredient.amount = ingredient.name.split(" ")[0];
                                    ingredient.name = ingredient.name.split(" ")[1].trim();
                                } 
                                if (!isNaN(ingredient.name.split(" ")[0]) && ingredient.name.split(" ").length === 3) {
                                    ingredient.amount = ingredient.name.split(" ")[0];
                                    ingredient.unit = ingredient.name.split(" ")[1];
                                    ingredient.name = ingredient.name.split(" ")[2];
                                } 
                                if (ingredient.name.startsWith("1/2") && ingredient.name.split(" ").length === 2) {
                                    ingredient.amount = ingredient.amount ? +ingredient.amount + 0.5 : 0.5;
                                    ingredient.amount = ingredient.amount + "";
                                    ingredient.name = ingredient.name.split(" ")[1];
                                } 
                                if (ingredient.name.startsWith("1/2") && ingredient.name.split(" ").length === 3) {
                                    ingredient.amount = ingredient.amount ? +ingredient.amount + 0.5 : 0.5;
                                    ingredient.amount = ingredient.amount + "";
                                    ingredient.unit = ingredient.name.split(" ")[1];
                                    ingredient.name = ingredient.name.split(" ")[2];
                                }
                                if (ingredient.name.startsWith("½") && ingredient.name.split(" ").length === 2) {
                                    ingredient.amount = ingredient.amount ? +ingredient.amount + 0.5 : 0.5;
                                    ingredient.amount = ingredient.amount + "";
                                    ingredient.name = ingredient.name.split(" ")[1];
                                } if (ingredient.name.startsWith("½") && ingredient.name.split(" ").length === 3) {
                                    ingredient.amount = ingredient.amount ? +ingredient.amount + 0.5 : 0.5;
                                    ingredient.amount = ingredient.amount + "";
                                    ingredient.unit = ingredient.name.split(" ")[1];
                                    ingredient.name = ingredient.name.split(" ")[2];
                                } if (ingredient.name.startsWith(ingredient.name.split("–")[0]) && !isNaN(ingredient.name.split("–")[0]) && ingredient.name.split(" ").length === 3) {
                                    let amountParts = ingredient.name.split(" ")[0];
                                    let firstPart = +amountParts.split("–")[0];
                                    let secondPart = +amountParts.split("–")[1];
                                    ingredient.amount = (firstPart + secondPart) / 2;
                                    ingredient.amount = ingredient.amount + "";
                                    ingredient.unit = ingredient.name.split(" ")[1];
                                    ingredient.name = ingredient.name.split(" ")[2];
                                } if (ingredient.name.startsWith(ingredient.name.split("–")[0]) && !isNaN(ingredient.name.split("–")[0]) && ingredient.name.split(" ").length === 2) {
                                    let amountParts = ingredient.name.split(" ")[0];
                                    let firstPart = +amountParts.split("–")[0];
                                    let secondPart = +amountParts.split("–")[1];
                                    ingredient.amount = (firstPart + secondPart) / 2;
                                    ingredient.amount = ingredient.amount + "";
                                    ingredient.name = ingredient.name.split(" ")[1];
                                }
                                if (ingredient.name.startsWith(ingredient.name.split("-")[0]) && !isNaN(ingredient.name.split("-")[0]) && ingredient.name.split(" ").length === 3) {
                                    let amountParts = ingredient.name.split(" ")[0];
                                    let firstPart = +amountParts.split("-")[0];
                                    let secondPart = +amountParts.split("-")[1];
                                    ingredient.amount = (firstPart + secondPart) / 2;
                                    ingredient.amount = ingredient.amount + "";
                                    ingredient.unit = ingredient.name.split(" ")[1];
                                    ingredient.name = ingredient.name.split(" ")[2];
                                }
                                if (ingredient.name.startsWith(ingredient.name.split("-")[0]) && !isNaN(ingredient.name.split("-")[0]) && ingredient.name.split(" ").length === 2) {
                                    let amountParts = ingredient.name.split(" ")[0];
                                    let firstPart = +amountParts.split("-")[0];
                                    let secondPart = +amountParts.split("-")[1];
                                    ingredient.amount = (firstPart + secondPart) / 2;
                                    ingredient.amount = ingredient.amount + "";
                                    ingredient.name = ingredient.name.split(" ")[1];
                                }
                                if (ingredient.amount.indexOf("½") > -1) {
                                    let splitAmount = ingredient.amount.split(" ");
                                    if (splitAmount.length === 1) {
                                        ingredient.amount = 0.5;
                                    } else {
                                        ingredient.amount = +splitAmount[0] + 0.5;
                                    }
                                    ingredient.amount = ingredient.amount + "";
                                }
                                if (ingredient.amount.indexOf("1/2") > -1) {
                                    let splitAmount = ingredient.amount.split(" ");
                                    if (splitAmount.length === 1) {
                                        ingredient.amount = 0.5;
                                    } else {
                                        ingredient.amount = +splitAmount[0] + 0.5;
                                    }
                                    ingredient.amount = ingredient.amount + "";
                                }
                                if (ingredient.amount.indexOf("–") > -1) {
                                    let firstPart = +ingredient.amount.split("–")[0];
                                    let secondPart = +ingredient.amount.split("–")[1];
                                    ingredient.amount = (firstPart + secondPart) / 2;
                                    ingredient.amount = ingredient.amount + "";
                                }
                                if (ingredient.amount.indexOf("-") > -1) {
                                    let firstPart = +ingredient.amount.split("-")[0];
                                    let secondPart = +ingredient.amount.split("-")[1];
                                    ingredient.amount = (firstPart + secondPart) / 2;
                                    ingredient.amount = ingredient.amount + "";
                                }
                                ingredient.name = ingredient.name.charAt(0).toUpperCase() + ingredient.name.slice(1);
                                if (ingredientNames.indexOf(ingredient.name) > -1) {
                                    continue;
                                }
                                if (ingredient.amount.trim() == "") {
                                    delete ingredient.amount;
                                }
                                if (ingredient.unit.trim() == "") {
                                    delete ingredient.unit;
                                }
                                ingredientNames.push(ingredient.name);
                                ingredients.push(ingredient);
                            }
                            recipe.ingredients = ingredients;
                        }
                        if (!recipe.ingredients || recipe.ingredients.length === 0 || (recipe.time && recipe.time < 1)) {
                            return;
                        }

                        //difficulty
                        let instructionsList = document.querySelector('.recipe .recipe__instructions--inner').getElementsByTagName("li");
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