var Nightmare = require('nightmare');
var nightmare = Nightmare({
    openDevTools: false, show: false, webPreferences: {
        images: false,
    }
})

var fs = require('fs');


//ta fram urls genom att:
//1. Gå till en sida på ica.se/recept
//2. kör: var hrefs=[]; var interv=setInterval(function(){if(document.querySelector('.recipe-bottom-container .showMoreText')){document.querySelector('a.loadmore').click();}else{hrefs=Array.from(document.querySelectorAll('article.recipe header h2.title a')).map(a => a.href);console.log("done");clearInterval(interv);}},1500);
//IMPROVED var result = []; var interv=setInterval(function(){if(document.querySelector('.recipe-bottom-container .showMoreText')){result = result.concat(Array.from(document.querySelectorAll('article.recipe header h2.title a')).map(a => a.href));$('article.recipe').remove();document.querySelector('a.loadmore').click();}else{;console.log("done");clearInterval(interv);}},1500);
//med denna laggar inte sidan och result byggs på under körningen.
//kopiera result med copy([... new Set(result)])
//3. Vänta på att "done" har loggats i consolen.
//4. kopiera alla hrefs genom copy(hrefs) eller copy(Array.from(document.querySelectorAll('article.recipe header h2.title a')).map(a => a.href));
//5. paste in i urls
//6. Sätt filename enligt "ICA-RECEPTSRC-DATE.json"
//6. kör node set DEBUG=nightmare & node ica.js
//8. kör node createRecipes.js och ange namnet på filen som skapades här
let urls = ["https://www.ica.se/recept/sojabonsburgare-med-avokadokram-724092/",
"https://www.ica.se/recept/somrig-mazarintarta-med-farska-bar-724036/",
"https://www.ica.se/recept/stekt-torskrygg-med-medelhavssalsa-724071/",
"https://www.ica.se/recept/vitlokssill-med-citron-724123/",
"https://www.ica.se/recept/brantevikssill-724122/",
"https://www.ica.se/recept/frasch-basilikasill-724121/",
"https://www.ica.se/recept/tre-goda-silltapas-724119/",
"https://www.ica.se/recept/matjessill-pa-fat-724120/",
"https://www.ica.se/recept/stekta-thaifiskbollar-i-salladsknyten-724069/",
"https://www.ica.se/recept/parmesanpopcorn-724047/",
"https://www.ica.se/recept/popcorn-med-chili-och-lime-724046/",
"https://www.ica.se/recept/kycklingvingar-med-koriandermajonnas-724045/",
"https://www.ica.se/recept/kottfarspaj-med-mozzarella-724000/",
"https://www.ica.se/recept/shrimp-rolls-724048/",
"https://www.ica.se/recept/padrones-med-parmesandipp-724049/",
"https://www.ica.se/recept/pigs-in-a-blanket-smordegsinbakad-korv-724050/",
"https://www.ica.se/recept/snabba-quesadillas-med-spenat-och-mozzarella-724051/",

];
let filename = "ica/urls1-2018-07-24.json";
let errors = 0;

nightmare
    .goto('https://www.ica.se/recept')
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
                        if (!document.querySelector('.recipepage main.container--main')) {
                            return;
                        }
                        let recipe = {};
                        //title
                        recipe.title = document.querySelector('.recipepage header h1.recipepage__headline').innerHTML.trim();
                        //tags
                        let tags = {};
                        //cannot read property length of null
                        $('.related-recipes .related-recipe-tags__container a').each(function () {
                            let t = $(this).text();
                            tags[t.charAt(0).toUpperCase() + t.slice(1).replace(/\s*\([^()]*\)/g, '').split(",")[0].replace(/([/.#$])/g, '').trim()] = true;

                        })
                        recipe.tags = tags;
                        //source
                        recipe.source = window.location.href;
                        recipe.source = recipe.source.substr(recipe.source.indexOf("ica.se"));
                        //rating
                        recipe.rating = document.querySelector('.recipepage header .recipe-header a.rating-stars').getAttribute("title");
                        if (recipe.rating.endsWith(".0")) {
                            recipe.rating = recipe.rating.slice(0, -2);

                        }
                        //votes
                        recipe.votes = document.querySelector('.recipepage header .recipe-header a.rating-stars .recipe-meta .js-number-of-votes').innerHTML;
                        //author
                        recipe.author = "ICA";
                        //createdFor
                        if (document.querySelector('.recipepage .magazine-row a.magazine-row__link')) {
                            if (document.querySelector('.recipepage .magazine-row a.magazine-row__link').getAttribute("href") === "/buffe/") {
                                recipe.createdFor = "Buffé";
                            }
                        }
                        //portions  "4småpotioner" trattkantarellsoppan. replace alla bokstäver med ""?
                        if (document.querySelector('.recipepage .servings-picker')) {
                            recipe.portions = document.querySelector('.recipepage .servings-picker').getAttribute('data-default-portions');
                            if (recipe.portions.toUpperCase().startsWith("GER ")) {
                                recipe.portions = recipe.portions.substr(4);
                            }
                            if (recipe.portions.toUpperCase().startsWith("CA ")) {
                                recipe.portions = recipe.portions.substr(3);
                            }
                            recipe.portions = recipe.portions.replace(",", ".");
                            if (recipe.portions.indexOf("1/2") > -1) {
                                recipe.portions = recipe.portions.replace("1/2", "+.5");
                                let parts = recipe.portions.split(" ");
                                if (!isNaN(parts[0]) && !isNaN(parts[1])) {
                                    let nr = eval(parts[0] + parts[1]);
                                    recipe.portions = nr + recipe.portions.substr(parts[0].length + parts[1].length + 1);
                                } else if (!isNaN(parts[0])) {
                                    let nr = eval(parts[0]);
                                    recipe.portions = nr + recipe.portions.substr(parts[0].length);
                                } else {
                                    recipe.portions = recipe.portions.replace("+.5", "1/2");
                                }

                            }
                            let firstString = recipe.portions.split(" ")[0];
                            let seperateArray = firstString.split(/([0-9]+)/).filter(Boolean);
                            if (seperateArray[1] === "-" && seperateArray.length === 4) {
                                let newFirstString = seperateArray[0] + seperateArray[1] + seperateArray[2] + " " + seperateArray[3];
                                recipe.portions = newFirstString + recipe.portions.substr(firstString.length);
                            } else if (seperateArray.length === 2) {
                                let newFirstString = seperateArray[0] + " " + seperateArray[1];
                                recipe.portions = newFirstString + recipe.portions.substr(firstString.length);
                            }

                            if (recipe.portions.toUpperCase().startsWith("GER ")) {
                                recipe.portions = recipe.portions.substr(4);
                            }
                            if (recipe.portions.toUpperCase().startsWith("CA ")) {
                                recipe.portions = recipe.portions.substr(3);
                            }
                            let parts = recipe.portions.split(" ")[0].split("-");
                            if (parts.length === 2) {
                                let tmp = ((parts[0] - 0) + (parts[1] - 0)) / 2;
                                if (recipe.portions.split(" ").length > 1) {
                                    tmp = tmp + recipe.portions.substr(recipe.portions.indexOf(recipe.portions.split(" ")[1]) - 1);
                                }
                                recipe.portions = tmp;
                            }
                        }
                        //created

                        //description
                        if (document.querySelector('.recipepage p.recipe-preamble')) {
                            recipe.description = document.querySelector('.recipepage p.recipe-preamble').innerHTML.replace(/(\r\n|\n|\r|<[^>]*>)/gm, "").replace(/  +/g, ' ').trim();
                        }
                        //time and difficulty
                        if (document.querySelector('.recipepage .recipe-meta.recipe-meta--header')) {
                            let timeDiff = document.querySelector('.recipepage .recipe-meta.recipe-meta--header').innerHTML.replace(/(\r\n|\n|\r|<[^>]*>)/gm, "").trim().split(" | ");
                            let diff = timeDiff[1];
                            //diff
                            if (diff === "Enkel") {
                                recipe.level = 1;
                            } else if (diff === "Medel") {
                                recipe.level = 2;
                            } else if (diff === "Avancerad") {
                                recipe.level = 3;
                            } else {
                                recipe.level = "FAILEDLEVEL"
                            }
                            //time
                            let timeString = timeDiff[0];
                            if (timeString.indexOf("MIN") > -1) {
                                recipe.time = timeString.split(" ")[0] - 0;
                            } else if (timeString.indexOf("TIM")) {
                                let parts = timeString.split(" ")[0].split("-");
                                if (parts.length === 1) {
                                    recipe.time = (timeString.split(" ")[0] - 0) * 60;
                                } else {
                                    recipe.time = (((parts[0] - 0) + (parts[1] - 0)) / 2) * 60;
                                }
                            } else {
                                return;
                            }
                            if (recipe.time < 25) {
                                if (!tags.hasOwnProperty('Snabbt')) {
                                    tags["Snabbt"] = true;
                                }
                            }
                        }
                        //ingredients
                        if (document.querySelector('.recipepage #ingredients-section .ingredients__content .ingredients__list .ingredients__list__item')) {
                            let ingredientsDom = document.querySelector('.recipepage #ingredients-section .ingredients__content').getElementsByTagName("li");
                            let ingredients = [];
                            let ingredientNames = [];
                            for (let i = 0; i < ingredientsDom.length; ++i) {
                                let ingredient = {};
                                let innerHtml = ingredientsDom[i].innerHTML;
                                ingredient.amount = ingredientsDom[i].getElementsByTagName("span")[0].innerHTML.trim();
                                if (ingredient.amount.indexOf("\/")) {
                                    var y = ingredient.amount.split(' ');
                                    if (y.length > 1) {
                                        var z = y[1].split('/');
                                        ingredient.amount = +y[0] + (z[0] / z[1]) + "";
                                    }
                                    else {
                                        var z = y[0].split('/');
                                        if (z.length > 1) {
                                            ingredient.amount = z[0] / z[1] + "";
                                        }
                                        else {
                                            ingredient.amount = z[0] + "";
                                        }
                                    }
                                }



                                let parts = innerHtml.slice(innerHtml.indexOf("</span>") + 7).split(" ");
                                ingredient.unit = parts[1];

                                let namepart = innerHtml.slice(innerHtml.indexOf(parts[2] === "st" ? parts[3] : parts[2])).trim();

                                ingredient.name = namepart.charAt(0).toUpperCase() + namepart.slice(1).replace(/\s*\([^()]*\)/g, '').split(",")[0].replace(/([/.#$])/g, '').trim();
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



                                //måste göra om till innerHTML och ta ut det som ligger i spanet till amount 
                                //och det andra får först trimmas och sen splitas på " " och ta ut [0] till unit

                            }
                            recipe.ingredients = ingredients;
                        }
                        else if (document.querySelector('.recipepage #ingredients-section ul li span.ingredient')) {
                            let ingredientsDom = document.querySelector('.recipepage #ingredients-section').getElementsByClassName("ingredient");
                            let ingredients = [];
                            let ingredientNames = [];
                            for (let i = 0; i < ingredientsDom.length; ++i) {
                                let ingredient = {};
                                let ingredientDom = ingredientsDom[i];
                                let innerText = ingredientDom.innerText;
                                ingredient.amount = ingredientDom.getAttribute("data-amount");
                                if (ingredient.amount.endsWith(".0")) {
                                    ingredient.amount = ingredient.amount.slice(0, -2);
                                }
                                if (ingredient.amount === "0") {
                                    ingredient.amount = "";
                                }
                                ingredient.unit = ingredientDom.getAttribute("data-type");
                                let namepart = innerText.slice(ingredient.amount.length + ingredient.unit.length).trim();
                                console.log("namepart:" + namepart);

                                if (ingredient.unit.length > 0) {
                                    namepart = innerText.slice(innerText.indexOf(ingredient.unit) + ingredient.unit.length + 1).trim();
                                } else if (ingredient.amount.length > 0) {
                                    if (ingredient.amount % 1 !== 0) {
                                        let parts = innerText.split(" ");
                                        if (ingredient.amount > 1) {
                                            namepart = innerText.slice(innerText.indexOf(parts[2])).trim();
                                        } else {
                                            namepart = innerText.slice(innerText.indexOf(parts[1])).trim();
                                        }

                                    } else {
                                        namepart = innerText.slice(innerText.indexOf(ingredient.amount) + ingredient.amount.length + 1).trim();

                                    }
                                } else {
                                    namepart = innerText.trim();
                                }



                                ingredient.name = namepart.charAt(0).toUpperCase() + namepart.slice(1).replace(/\s*\([^()]*\)/g, '').split(",")[0].replace(/([/.#$])/g, '').trim();
                                if (ingredientNames.indexOf(ingredient.name) > -1) {
                                    continue;
                                }


                                ingredientNames.push(ingredient.name);
                                ingredients.push(ingredient);
                            }
                            recipe.ingredients = ingredients;
                        }
                        //kan detta brytas ut till valideringsfunktion?
                        if (!recipe.ingredients || recipe.ingredients.length === 0 || (recipe.time && recipe.time < 1)) {
                            return;
                        }
                        return recipe;
                    })
                    .then(function (html) {
                        results.push(html);
                        if (results.length % 500 == 0) {
                            console.log("saving " + results.length);
                            fs.writeFile("C:/react/" + filename, JSON.stringify(results), function (err) {

                            });
                        }
                        return results;
                    }, error => {
                        console.log("ERROR: finished " + results.length + " recipes before error");
                        errors = errors + 1;
                        fs.writeFile("C:/react/" + filename, JSON.stringify(results), function (err) {
                            if (err) {
                                return console.log(err);
                            }
                
                        });
                        if(errors<10){
                            return results;
                        }
                        console.log("end. to many errors")

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