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
//4. kör node set DEBUG=nightmare & node tasteline.js
//5. kör node createRecipes.js och ange namnet på filen som skapades här

let urls = [
];
for (let i = 1; i < 2285; i++) {
    urls.push('http://www.tasteline.com/recept/?sida=' + i + '#sok');
}


let filename = "tasteline-hrefs-2017-10-30.json";

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



                        return Array.from(document.querySelectorAll('.recipe-description a')).map(a => a.href);

                    })
                    .then(function (html) {
                        for(let i = 0; i<html.length; i++){
                            results.push(html[i]);
                        }
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