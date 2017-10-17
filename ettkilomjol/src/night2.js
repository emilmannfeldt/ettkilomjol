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
//document.querySelector('a[rel="next"]').click();
//Array.from(document.querySelectorAll('article.list-item.recipe .info .top h2 a')).map(a => a.href);


nightmare
.goto('https://www.koket.se/mat/specialkost/raw-food')
.click('a[rel="next"]').click('a[rel="next"]').click('a[rel="next"]').click('a[rel="next"]').click('a[rel="next"]').click('a[rel="next"]')
.wait(1000)
.evaluate(function(){
  console.log("click klar");
  //using `Array.from` as the DOMList is not an array, but an array-like, sort of like `arguments`
  //planning on using `Array.map()` in a moment

  return Array.from(
    //give me all of the elements where the href contains 'Property.aspx'
    document.querySelectorAll('article.list-item.recipe .info .top h2 a'))
    //pull the target hrefs for those anchors
    .map(a => a.href);
})
.then(function(hrefs){
  console.log("Antal hrefs:" + hrefs.length);

  let unique = [...new Set(hrefs)]; 

  console.log("Antal unika:" + unique.length);
 fs.readFile('C:/react/hrefs.txt', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  var result = JSON.parse(data);
  console.log(result);

  console.log(result[0].tags.snabbt);
    console.log(result.length);

});
  //här kan jag bygga vilken lista jag vill med hrefs...

  //here, there are two options:
  //  1. you could navigate to each link, get the information you need, then navigate back, or
  //  2. you could navigate straight to each link and get the information you need.
  //I'm going to go with #1 as that's how it was in your original script.

  //here, we're going to use the vanilla JS way of executing a series of promises in a sequence.
  //for every href in hrefs,
  return unique.reduce(function(accumulator, href){
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