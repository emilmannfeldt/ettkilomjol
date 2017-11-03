var Nightmare = require('nightmare');
var nightmare = Nightmare({
  openDevTools: false, show: true, webPreferences: {
    images: true,
  }
})

var fs = require('fs');


//ta fram urls genom att:
//1. Gå till en sida på koket.se
//2. kör: var interv=setInterval(function(){if(document.querySelector('li.next').offsetParent!=null){document.querySelector('a[rel="next"]').click();}else{console.log("done");clearInterval(interv);}},1000);
//3. Vänta på att "done" har loggats i consolen.
//4. kopiera alla hrefs genom copy(Array.from(document.querySelectorAll('article.list-item.recipe .info .top h2 a')).map(a => a.href));
//5. paste in i urls
//6. kör node night2.js
//7. resultatet sparas i react/test.txt
//8. kör node datachange.js här alla recept läses in till firebase från textfilen
//set DEBUG=nightmare & node night2.js
let urls = [
  "https://www.koket.se/lobster-rolls-a-la-catarina",
  "https://www.koket.se/skumtoppar-med-blabar-och-vit-choklad",
  "https://www.koket.se/creme-brulee-med-stjarnanis-rabarber-och-lakrits",
  "https://www.koket.se/tonfisksallad-med-kokos-vit-sparris-och-ramslok",
  "https://www.koket.se/syditaliensk-kyckling-med-bonstomp",
  "https://www.koket.se/ananastarta-med-honungsrostade-valnotter-och-yoghurtfrosting",
  "https://www.koket.se/volangbard-till-tarta-se-gor",
  "https://www.koket.se/grillat-gronsaksknyte-med-myntahummus",
  "https://www.koket.se/grillade-potatiskroketter-med-ortsmor",
  "https://www.koket.se/tom-sjostedts-biff-rydberg-med-senapsyoghurt"
];
let filename = "koketsenasteTEST.json";
nightmare
  .goto('https://www.koket.se/mat/specialkost/raw-food')
  .evaluate(function () {

  })
  .then(function (hrefs) {


    console.log("start");
    //här kan jag bygga vilken lista jag vill med hrefs...
    console.log("nr of urls: " + urls.length);
    uniqurls = [...new Set(urls)];
    console.log("uniq : " + uniqurls.length);
    //here, we're going to use the vanilla JS way of executing a series of promises in a sequence.
    //for every href in hrefs,
    return uniqurls.reduce(function (accumulator, href) {
      //return the accumulated promise results, followed by...
      return accumulator.then(function (results) {
        return nightmare.goto(href)
          //get the html
          .evaluate(function () {
            if (document.querySelector('.recipe-column-wrapper .endorsed-banner') || !document.querySelector('.recipe-content-wrapper')) {
              return;
            }
            console.log(window.location.href);
            //l sep är ett problem. replace &#8232; funkar inte
            //ta bort plural "er,ar,or"?
            //IMPLEMENTERA DETTA-------------I CREATERECIPES.JS
            //möjlig regel: Om ingrediensen slutar på er, ar, or. så kolla om det finns en exakt likadan i foods utan de två sista bokstäverna.
            //Om det finns så spara ner ingrediensen som subString(-2 sista) och addera uses på befintlig.
            //detta bör kanske vara ett separat jobb som körs när som för att rätta upp datat? annar är risken att det kommer in några plural innan första singular
            //och vi aldrig får rätta till pluran som kom tidigare.

            //ha koll på om denna fix gör så att namnet blir lika med existerande food, isåfall plusa på uses
            //om jag fixar detta i efterhand så måste jag köra igenom alla foods/ och alla recipes/ingredients/
            let recipe = {};
            //title
            if (document.querySelector('.recipe-content-wrapper h1')) {
              recipe.title = document.querySelector('.recipe-content-wrapper h1').innerHTML;
            }
            //tags
            let tags = {};
            $('.category-touch-scroll .btn.green-btn.category').each(function () {
              let t = $(this).text().split('/');
              for (let i = 0; i < t.length; i++) {
                tags[t[i].charAt(0).toUpperCase() + t[i].slice(1)] = true;
              }
            })
            recipe.tags = tags;
            //source
            recipe.source = window.location.href;
            //rating
            recipe.rating = document.querySelector('.recipe-content-wrapper .rating-container.rating').getAttribute("data-setrating");
            //votes
            if (document.querySelector('.recipe-content-wrapper .rating-container.rating span.text')) {
              recipe.votes = document.querySelector('.recipe-content-wrapper .rating-container.rating span.text').innerHTML.split(" ")[0];
            }
            //author
            if (document.querySelector('.recipe-content-wrapper .author-chef a')) {
              recipe.author = document.querySelector('.recipe-content-wrapper .author-chef a').innerHTML;
            }
            //createdFor
            if (document.querySelector('.recipe-content-wrapper .author-source a')) {
              recipe.createdFor = document.querySelector('.recipe-content-wrapper .author-source a').innerHTML;
            }
            //portions  "4småpotioner" trattkantarellsoppan. replace alla bokstäver med ""?
            if (document.querySelector('.recipe-content-wrapper .recipe-info.portions span.amount')) {
              recipe.portions = document.querySelector('.recipe-content-wrapper .recipe-info.portions span.amount').innerHTML.replace(/(\r\n|\n|\r| )/gm, "").trim();
            }
            //created
            if (document.querySelector('.recipe-content-wrapper .description meta[itemprop="datePublished"]')) {
              recipe.created = document.querySelector('.recipe-content-wrapper .description meta[itemprop="datePublished"]').getAttribute("content");
            }
            //description
            //lägg till first-child i ifsatsen?
            if (document.querySelector('.recipe-content-wrapper .recipe-article .description p:first-child')) {
              recipe.description = document.querySelector('.recipe-content-wrapper .recipe-article .description p:first-child').innerHTML.replace(/(\r\n|\n|\r|<[^>]*>)/gm, "").replace(/  +/g, ' ');
            }
            //time
            if (document.querySelector('.recipe-content-wrapper .cooking-time')) {
              //koket.se använder flera olika format på tid så det är inte lätt att ta ut ett generellt värde
              recipe.time = document.querySelector('.recipe-content-wrapper .cooking-time .time').innerHTML.replace(/(\r\n|\n|\r|)/gm, "").trim();
            }
            //ingredients
            if (document.querySelector('.recipe-column-wrapper #ingredients-component')) {
              let ingredientsDom = document.querySelector('.recipe-column-wrapper #ingredients-component #ingredients').getElementsByTagName("li");
              let ingredients = [];
              let ingredientNames = [];
              for (var i = 0; i < ingredientsDom.length; ++i) {
                let ingredient = {};
                let parts = ingredientsDom[i].getElementsByTagName("span");
                ingredient.name = parts[2].innerHTML.charAt(0).toUpperCase() + parts[2].innerHTML.slice(1).replace(/\s*\([^()]*\)$/, '').split(",")[0].replace(/([/.#$])/g, '');
                if (ingredientNames.indexOf(ingredient.name) > -1) {
                  continue;
                }
                let amount = parts[1].innerHTML;
                if (amount.length > 0) {
                  let amountParts = amount.split(" ");
                  ingredient.amount = amountParts[0];
                  if (amountParts.length > 1) {
                    ingredient.unit = amountParts[1];
                    if (!/\d/.test(ingredient.amount)) {
                      ingredient.amount = amountParts[1];
                      ingredient.unit = amountParts[0];
                    }
                  }
                }
                ingredientNames.push(ingredient.name);
                ingredients.push(ingredient);
              }
              recipe.ingredients = ingredients;
            }
            //difficulty
            let instructionsList = document.querySelector('.recipe-column-wrapper #step-by-step').getElementsByTagName("li");
            let nrOfIngredients = recipe.ingredients.length;
            let instructionLength = 0;
            for (let i = 0; i < instructionsList.length; i++) {
              instructionLength = instructionLength + instructionsList[i].getElementsByTagName("span")[0].innerHTML.replace(/(\r\n|\n|\r|)/gm, "").trim().length;
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

            //lägg logik för validering i inläsningen och inte här.. om vissa saker saknas så hoppa över. om urlen redan finns hoppa över..
            //automatisera denna inläsning. 
            //Alla recept som skrivs till filen ska se likadana ut oberoende av källa.
            if (recipe.ingredients.length === 0) {
              return;
            }
            return recipe;
          })
          //add the result to the results
          .then(function (html) {
            results.push(html);
            return results;
          })
        // .then(function(results){
        //   //click on the search result link to go back to the search result page
        //   return nightmare
        //     .click('a[id="propertyHeading_searchResults"]')
        //     .then(function() {
        //       //make sure the results are returned
        //       return results;
        //     });
        // })
      });
    }, Promise.resolve([])) //kick off the reduce with a promise that resolves an empty array
  })
  .then(function (resultArr) {
    //if I haven't made a mistake above with the `Array.reduce`, `resultArr` should now contain all of your links' results
    console.log(resultArr.length);


    fs.writeFile("C:/react/" + filename, JSON.stringify(resultArr), function (err) {

      if (err) {
        return console.log(err);
      }

      console.log("The file was saved!");
    });
  });