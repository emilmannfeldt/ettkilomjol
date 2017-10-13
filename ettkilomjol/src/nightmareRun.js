var Nightmare = require('nightmare');
var nightmare = Nightmare({ show: true })

//denna fil är specifik för koket.se
//sno kod för att spara ner recepten från datachange.js
//glöm inte spara foods (uses), units



nightmare
  .goto('https://www.koket.se/mat/typ-av-maltid/vardagsmiddag')
  .wait(2000)
  .evaluate(function () {
    let recipesScraped = 0;
    let recipesources = [];

      let recipesLoop = [];
      let visibleRecipeCards = $('article.list-item.recipe');
      $(visibleRecipeCards).each(function(){
        recipesLoop.push($(this).find('.info .top h2 a').attr('href'));
      })
      recipesources = recipesources.concat(recipesLoop);
      recipesScraped += visibleRecipeCards.length;


    



    


    return recipesources;




    // recipesData = recipesData.concat(scrapeRecipes(recipesScraped, visibleRecipeCards));

  // function scrapeRecipes(startIndex, visibleRecipeCards){
  //   let recipesData = [];
  //   $(visibleRecipeCards).each(function(){
  //     let recipe = {};
  //     recipe.source = $(this).find('.info .top h2 a').attr('href');
  //     recipesData.push(recipe);
  //   })
  //   return recipesData;
  // }

  })
  .then(function (urls) {
    let recipelist = [];
    for (let i = 0; i < urls.length; i++) {
      nightmare.goto('https://www.koket.se'+urls[i])
      .wait(5000)
      .evaluate(function () {
        let recipe = {};
        recipe.title = $(this).find('.recipe-content-wrapper h1').text();
        recipelist.push(recipe);

      })
      .then(function(recipes){
        console.log(recipes);
      })
    }



    console.log(recipelist);
  })
  .catch(function (error) {
    console.error('Search failed:', error);
  });


