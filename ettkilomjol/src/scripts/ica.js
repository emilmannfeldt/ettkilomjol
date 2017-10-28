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
//3. Vänta på att "done" har loggats i consolen.
//4. kopiera alla hrefs genom copy(hrefs) eller copy(Array.from(document.querySelectorAll('article.recipe header h2.title a')).map(a => a.href));
//5. paste in i urls
//6. Sätt filename enligt "ICA-RECEPTSRC-DATE.json"
//6. kör node set DEBUG=nightmare & node ica.js
//8. kör node createRecipes.js och ange namnet på filen som skapades här


let urls = [
    "https://www.ica.se/recept/frozen-cheesecake-med-oreos-och-citrusfrukter-722954/",
    "https://www.ica.se/recept/frozen-cheesecake-i-glas-med-apelsin-och-oreo-722957/",
    "https://www.ica.se/recept/cupcakes-till-halloween-722959/",
    "https://www.ica.se/recept/julens-saftigaste-lussebulle-722952/",
    "https://www.ica.se/recept/tabbouleh-med-quinoa-722825/",
    "https://www.ica.se/recept/rodbeta-srirachadressing-och-getyoghurt-722762/",
    "https://www.ica.se/recept/morotskakssmoothie-722806/",
    "https://www.ica.se/recept/surdegsbrod-722829/",
    "https://www.ica.se/recept/chai-latte-722828/",
    "https://www.ica.se/recept/cupcakes-722826/",
    "https://www.ica.se/recept/porchetta-722827/",
    "https://www.ica.se/recept/oreospindlar-722833/",
    "https://www.ica.se/recept/mexikanska-wallenbergare-722751/",
    "https://www.ica.se/recept/kyckling-green-curry-med-kokosmjolk-722798/",
    "https://www.ica.se/recept/skogspizza-722628/",
    "https://www.ica.se/recept/dragonkyckling-722732/"
  ];
let filename = "ICA-högstabetyg-mellanmål-efterrätt-middag-2017-10-23.json";

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
                            if (t.match(/^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/)) {
                                t = t + "FAILEDTAG";
                            }
                            tags[t.charAt(0).toUpperCase() + t.slice(1)] = true;

                        })
                        recipe.tags = tags;
                        //source
                        recipe.source = window.location.href;
                        //rating
                        recipe.rating = document.querySelector('.recipepage header .recipe-header a.rating-stars').getAttribute("title");
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
                        }
                        //created

                        //description
                        if (document.querySelector('.recipepage p.recipe-preamble')) {
                            recipe.description = document.querySelector('.recipepage p.recipe-preamble').innerHTML.replace(/(\r\n|\n|\r|<[^>]*>)/gm, "").replace(/  +/g, ' ').trim();
                        }
                        //time and difficulty
                        if (document.querySelector('.recipepage .recipe-header__difficulty')) {
                            let timeDiff = document.querySelector('.recipepage .recipe-header__difficulty').innerHTML.replace(/(\r\n|\n|\r|<[^>]*>)/gm, "").trim().split(" | ");
                            let time = timeDiff[0];
                            let diff = timeDiff[1];
                            let timeAmount = time.split(" ")[0];
                            let timeUnit = time.split(" ")[1];
                            if (timeUnit === "MIN" && timeAmount.split("-")[0] < 30 && (!timeAmount.split("-")[1] || timeAmount.split("-")[1] < 30)) {
                                if (!tags.hasOwnProperty('Snabbt')) {
                                    tags["Snabbt"] = true;
                                }
                            }
                            recipe.time = time;
                            if (diff === "Enkel") {
                                recipe.level = 1;
                            } else if (diff === "Medel") {
                                recipe.level = 2;
                            } else if (diff === "Avancerad") {
                                recipe.level = 3;
                            } else {
                                recipe.level = "FAILEDLEVEL"
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
                                if(ingredient.amount.indexOf("\/")){
                                    var y = ingredient.amount.split(' ');
                                    if(y.length > 1){
                                        var z = y[1].split('/');
                                        ingredient.amount = +y[0] + (z[0] / z[1]) + "";
                                    }
                                    else{
                                        var z = y[0].split('/');
                                        if(z.length > 1){
                                            ingredient.amount =z[0] / z[1] + "";
                                        }
                                        else{
                                            ingredient.amount = z[0] + "";
                                        }
                                    }
                                }
            


                                let parts = innerHtml.slice(innerHtml.indexOf("</span>") + 7).split(" ");
                                ingredient.unit = parts[1];

                                let namepart = innerHtml.slice(innerHtml.indexOf(parts[2] === "st" ? parts[3] : parts[2])).trim();

                                ingredient.name = namepart.charAt(0).toUpperCase() + namepart.slice(1).replace(/\s*\([^()]*\)$/, '').split(",")[0].replace(/([/.#$])/g, '').trim();
                                if (ingredientNames.indexOf(ingredient.name) > -1) {
                                    continue;
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
                                if (ingredient.amount === "0") {
                                    ingredient.amount = "";
                                }
                                ingredient.unit = ingredientDom.getAttribute("data-type");
                                let extraSliceIndex = 0;
                                if (ingredient.unit.length > 0 && ingredient.amount.length > 0) {
                                    extraSliceIndex = 1;
                                }
                                let namepart = innerText.slice(ingredient.amount.length + ingredient.unit.length + extraSliceIndex).trim();


                                if (ingredient.unit.length > 0) {
                                    namepart = innerText.slice(innerText.indexOf(ingredient.unit) + ingredient.unit.length + 1).trim();
                                } else if (ingredient.amount.length > 0) {
                                    if (ingredient.amount % 1 != 0) {
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



                                ingredient.name = namepart.charAt(0).toUpperCase() + namepart.slice(1).replace(/\s*\([^()]*\)$/, '').split(",")[0].replace(/([/.#$])/g, '').trim();
                                if (ingredientNames.indexOf(ingredient.name) > -1) {
                                    continue;
                                }


                                ingredientNames.push(ingredient.name);
                                ingredients.push(ingredient);
                            }
                            recipe.ingredients = ingredients;
                        }

                        if (recipe.ingredients.length === 0) {
                            return;
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