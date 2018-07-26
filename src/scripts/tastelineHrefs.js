var Nightmare = require('nightmare');
var nightmare = Nightmare({
    openDevTools: false, show: false, webPreferences: {
        images: false,
    }
})

var fs = require('fs');


//ta fram urls genom att:
//1. Kolla vilka sidor under http://www.tasteline.com/recept/?sida=2303#sok som är aktuella
//   Nya recept hamnar på de första sidorna sorterat på "bäst träff". Kolla detta ganeom att se vilken den senaste max sidan var här nedan. kolla vilken som är maxsidan nu. 
//   Mellanskillnaden av detta t.ex. 10 så ska söksida 1-10 köras här nedan. Kolla extra att den senaste nyaste hrefen är med på sidan som det körs till eller sidan efter.
//2. Hoppa alltid över första sidan då det inte hunnit fått betyg, av samma anledning köra igenom lite överlappande för att se om man fångar upp något receipt som fått betyg som inte hade betyg senast.
//2303 i max now
// antal recept 27625

//2-100 kan köras en gång i månaden
let urls = [
];
for (let i = 2200; i < 2400; i++) {
    urls.push('http://www.tasteline.com/recept/?sida=' + i + '#sok');
}


let filename = "Newtasteline-hrefs-2400-2018-07-24.json";

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

        fs.writeFile("C:/react/tasteline/" + filename, JSON.stringify(resultArr), function (err) {

            if (err) {
                return console.log(err);
            }

            console.log("The file was saved!");
        });
    });