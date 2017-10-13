var Nightmare = require('nightmare');
var nightmare = Nightmare({ openDevTools: true, show: true })
// var Xray = require('x-ray');
// var x = Xray();

nightmare
.goto('https://www.koket.se/mat/hogtid/kraftskiva')
.wait(2500)
.click('a[rel="next"]')
.wait(2500)
.evaluate(function(){
  //using `Array.from` as the DOMList is not an array, but an array-like, sort of like `arguments`
  //planning on using `Array.map()` in a moment
  function visaFlerExists(){
    $(".next.searchPageButton").each(function(){
      if($(this).css('display') != 'none'){
        return true;
      }

    })
    return false;
  }

  while(visaFlerExists()) {
    nightmare.click("a[rel='next']");
    nightmare.wait(2000);
  }
  nightmare.wait(10000);
  return Array.from(
    //give me all of the elements where the href contains 'Property.aspx'
    document.querySelectorAll('article.list-item.recipe .info .top h2 a'))
    //pull the target hrefs for those anchors
    .map(a => a.href);
})
.then(function(hrefs){
  //here, there are two options:
  //  1. you could navigate to each link, get the information you need, then navigate back, or
  //  2. you could navigate straight to each link and get the information you need.
  //I'm going to go with #1 as that's how it was in your original script.

  //here, we're going to use the vanilla JS way of executing a series of promises in a sequence.
  //for every href in hrefs,
  return hrefs.reduce(function(accumulator, href){
    //return the accumulated promise results, followed by...
    return accumulator.then(function(results){
      return nightmare
        //click on the href
        .goto(href)
        //get the html
        .evaluate(function(){
          return document.querySelector('.recipe-content-wrapper h1').innerHTML;
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
  console.log('resultArr', resultArr);
  // x(resultArr[1], 'body@html') //output listing page html
  //   .write('results.json');
});