var Nightmare = require('nightmare');
var nightmare = Nightmare({ openDevTools: true, show: false, webPreferences: {
    images: false,
  } })
//images Boolean (optional) - Enables image support. Default is true.
//webgl Boolean (optional) - Enables WebGL support. Default is true.

var fs = require('fs');

//använd /recept 
//det är de senaste recepten
//om jag kör detta en gång i veckan. kolla så att scriptet stannar när första receptet som är 8 dagar gammalt kommer
//https://stackoverflow.com/questions/44605473/repeatedly-clicking-an-element-on-a-page-using-electron-nightarejs
//^^ hur man kan loopa klickevent. kan jag köra min kod på "click done" eller loopa 100 itaget och ta bort de som är klara i domen.
//hur många .click kan jag göra här i början innan minnet tar slut? allokera mer minne? refuse image request

//testa gå till en mindre sida och lägg 100 click. Vad händer när det itne går att klicka mer? crash?

//ta fram urls genom att:
//1. Gå till en sida på koket.se
//2. kör massa document.querySelector('a[rel="next"]').click();
//3. samla alla hrefs genom Array.from(document.querySelectorAll('article.list-item.recipe .info .top h2 a')).map(a => a.href);
//4. Höger klicka på resultatet och välj save as clobal variable
//5. kör copy(NAMN PÅ VARIABEL);
//6. CTRL+v här på urls parametern
//document.querySelector('a[rel="next"]').click();
//Array.from(document.querySelectorAll('article.list-item.recipe .info .top h2 a')).map(a => a.href);
let urls = [
  "https://www.koket.se/sushi-med-gronsaker-och-quinoa",
  "https://www.koket.se/birra-limone",
  "https://www.koket.se/notter-med-honung-och-salt",
  "https://www.koket.se/mandel-och-tomatsas",
  "https://www.koket.se/jessica-frejs-pan-con-tomat",
  "https://www.koket.se/farskostdipp-med-orter-och-brod",
  "https://www.koket.se/sallad-med-getost-bacon-och-valnotter",
  "https://www.koket.se/patatas-bravas-med-stekt-agg-och-aioli",
  "https://www.koket.se/jessica-frejs-pimentos-padron",
  "https://www.koket.se/smulpaj-med-lime-och-bjornbar",
  "https://www.koket.se/pride-spett-med-regnbagslax"
]

//testa gå mot localhost html med array data. eller testa gå mot en fil på github etc. hrefs.txt där istället på goto nedan.
//alternativet är att ha hela texten här i filen eller en annan fil brevid
nightmare
.goto('https://www.koket.se/mat/specialkost/raw-food')
.wait(1000)
.evaluate(function(){
  console.log("click klar");

})
.then(function(hrefs){


  console.log("start" );
  //här kan jag bygga vilken lista jag vill med hrefs...

  //here, we're going to use the vanilla JS way of executing a series of promises in a sequence.
  //for every href in hrefs,
  return urls.reduce(function(accumulator, href){
    //return the accumulated promise results, followed by...
    return accumulator.then(function(results){
      return nightmare.goto(href)
        //get the html
        .evaluate(function(){
          if(document.querySelector('.recipe-column-wrapper .endorsed-banner')){
            return;
          }

          let recipe = {};
          //title
          recipe.title = document.querySelector('.recipe-content-wrapper h1').innerHTML;
          //tags
          let tags = {};
          $('.category-touch-scroll .btn.green-btn.category').each(function(){
              let t = $(this).text().split('/');
              for(let i=0; i<t.length; i++){
                tags[t[i]] = true;
              }
          })
          recipe.tags = tags;
          //source
          recipe.source = window.location.href;
          //rating
          recipe.rating = document.querySelector('.recipe-content-wrapper .rating-container.rating').getAttribute("data-setrating");
          //votes
          recipe.votes = document.querySelector('.recipe-content-wrapper .rating-container.rating span.text').innerHTML.split(" ")[0];
          //author
          if(document.querySelector('.recipe-content-wrapper .author-chef a')){
            recipe.author = document.querySelector('.recipe-content-wrapper .author-chef a').innerHTML;
          }
          //createdFor
          if(document.querySelector('.recipe-content-wrapper .author-source a')){
            recipe.createdFor = document.querySelector('.recipe-content-wrapper .author-source a').innerHTML;
          }
          //portions  "4småpotioner" trattkantarellsoppan. replace alla bokstäver med ""?
          if(document.querySelector('.recipe-content-wrapper .recipe-info.portions span.amount')){
            recipe.portions = document.querySelector('.recipe-content-wrapper .recipe-info.portions span.amount').innerHTML.replace(/(\r\n|\n|\r| )/gm,"").trim();
          }
          //created
          if(document.querySelector('.recipe-content-wrapper .description meta[itemprop="datePublished"]')){
            recipe.created = document.querySelector('.recipe-content-wrapper .description meta[itemprop="datePublished"]').getAttribute("content");
          }
          //description
          if(document.querySelector('.recipe-content-wrapper .recipe-article .description p')){
            recipe.description = $('.recipe-content-wrapper .recipe-article .description p:first-child').text().replace(/(\r\n|\n|\r|)/gm,"");
          }

          //imageurl
          //diffuculty (om det inte finns så låt kolla metoden i datachange för hur det ska räknas, testa den.)
          //time
          //ingredients
            //amount
            //unit
            //food

        //lägg logik för validering.. om vissa saker saknas så hoppa över. om urlen redan finns hoppa över
        //automatisera denna inläsning. 
        //Alla recept som skrivs till filen ska se likadana ut oberoende av källa.
          console.log(recipe);

          return recipe;
        })
        //add the result to the results
        .then(function(html){
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


    fs.writeFile("C:/react/test.txt", JSON.stringify(resultArr), function(err) {

    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
}); 
});