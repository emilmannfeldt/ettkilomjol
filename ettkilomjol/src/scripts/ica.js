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


let urls =[
    "https://www.ica.se/recept/ratatouille-med-farsk-basilika-722461/",
    "https://www.ica.se/recept/quiche-lorraine-722388/",
    "https://www.ica.se/recept/coq-au-vin-722339/",
    "https://www.ica.se/recept/moules-frites-med-musselsas-722232/",
    "https://www.ica.se/recept/coeur-de-filet-provencale-722068/",
    "https://www.ica.se/recept/coq-au-vin-721898/",
    "https://www.ica.se/recept/gos-a-la-mornay-721784/",
    "https://www.ica.se/recept/torsk-med-rokt-laxbrandade-719983/",
    "https://www.ica.se/recept/fyllda-paprikor-med-sauce-verte-719660/",
    "https://www.ica.se/recept/ratatouille-et-cote-de-porc-719663/",
    "https://www.ica.se/recept/bavette-et-moules-au-safran-719662/",
    "https://www.ica.se/recept/kycklingcasserole-med-dijon-och-haricots-verts-719659/",
    "https://www.ica.se/recept/grillad-sallad-med-sparris-ratatouille-och-mozzarella-719077/",
    "https://www.ica.se/recept/rodvinsbraserad-griskind-med-champinjoner-718216/",
    "https://www.ica.se/recept/sydfransk-gronsakslasagne-718200/",
    "https://www.ica.se/recept/schnitzel-provencale-718149/",
    "https://www.ica.se/recept/ratatouille-med-vitlokscreme-1078/",
    "https://www.ica.se/recept/skaldjurs-och-potatisgalette-4269/",
    "https://www.ica.se/recept/soppa-provencale-2907/",
    "https://www.ica.se/recept/fransk-bondsoppa-med-linser-och-rokt-flask-717937/",
    "https://www.ica.se/recept/pot-au-feu-med-rimmad-kyckling-och-ortkram-713619/",
    "https://www.ica.se/recept/ortbiffar-med-chevrecreme-244035/",
    "https://www.ica.se/recept/torskfile-med-graslok-och-tomatsmorsas-70/",
    "https://www.ica.se/recept/prinsens-crepes-715572/",
    "https://www.ica.se/recept/moule-mariniere-musslor-i-vitt-vin-5148/",
    "https://www.ica.se/recept/bouillabaisse-st-paul-637667/",
    "https://www.ica.se/recept/bouillabaisse-med-apelsinaioli-och-ortkrutonger-714535/",
    "https://www.ica.se/recept/gryta-pa-strimlat-flaskkott-och-provencalska-limabonor-657649/",
    "https://www.ica.se/recept/biffar-med-kreolsk-sas-2590/",
    "https://www.ica.se/recept/lammnavarin-fransk-lammgryta-713291/",
    "https://www.ica.se/recept/kalkon-pot-au-feu-655180/",
    "https://www.ica.se/recept/halstrad-makrill-med-ansjovisblomkal-1507/",
    "https://www.ica.se/recept/flaskkotletter-med-senap-och-orter-2803/",
    "https://www.ica.se/recept/fisk-med-hummer-a-larmoricaine-5117/",
    "https://www.ica.se/recept/getostfyllda-lammfarsbiffar-med-ratatouille-1250/",
    "https://www.ica.se/recept/crepes-med-adelost-3513/",
    "https://www.ica.se/recept/filets-de-porc-a-la-moutarde-flaskfile-med-senapssas-5147/",
    "https://www.ica.se/recept/flamberad-pepparbiff-2172/",
    "https://www.ica.se/recept/galettes-comple-med-kassler-spenat-och-agg-713491/",
    "https://www.ica.se/recept/brummers-kalvlever-med-bercy-sas-637846/",
    "https://www.ica.se/recept/ciderbraserad-kotlett-med-apple-och-steklok-684315/",
    "https://www.ica.se/recept/pot-au-feu-713118/",
    "https://www.ica.se/recept/moule-mariniere-712962/",
    "https://www.ica.se/recept/choucroute-med-lax-och-dillgradde-595810/",
    "https://www.ica.se/recept/pot-eu-feu-pa-kyckling-med-rotfrukter-496986/",
    "https://www.ica.se/recept/fransk-strimmelbiff-med-adelost-426823/",
    "https://www.ica.se/recept/festkotlett-med-bearnaisesmor-381132/",
    "https://www.ica.se/recept/lammkotletter-med-vitlokskram-och-lokpotatis-352480/",
    "https://www.ica.se/recept/kotletter-med-fransk-bonsallad-360103/",
    "https://www.ica.se/recept/provencalsk-potatissallad-717368/",
    "https://www.ica.se/recept/skaldjurspanna-50326/",
    "https://www.ica.se/recept/blakokt-regnbage-med-bladruvsas-1233/",
    "https://www.ica.se/recept/vegogryta-fran-medelhavet-369475/",
    "https://www.ica.se/recept/sydfranska-gronsaker-med-fisk-och-citron-668662/",
    "https://www.ica.se/recept/sydfransk-kycklinggryta-713323/",
    "https://www.ica.se/recept/ugnsbakad-sej-under-orttacke-med-ratatouille-714101/",
    "https://www.ica.se/recept/sydfransk-lammlasagne-584423/",
    "https://www.ica.se/recept/vegobouillabaisse-715262/",
    "https://www.ica.se/recept/crepes-med-notter-och-bar-712550/",
    "https://www.ica.se/recept/provensalsk-rotfruktssoppa-454032/",
    "https://www.ica.se/recept/fransk-kottgryta-714282/",
    "https://www.ica.se/recept/sydfransk-fisksoppa-713029/",
    "https://www.ica.se/recept/rulle-pa-flask-lamm-och-linser-2019/",
    "https://www.ica.se/recept/medelhavsfisk-714870/",
    "https://www.ica.se/recept/fransk-gronsaksgryta-med-veggobiffar-663031/",
    "https://www.ica.se/recept/grillad-kalkonfile-med-ratatoille-716120/",
    "https://www.ica.se/recept/grillad-ryggbiff-med-sydfransk-bruschetta-715288/",
    "https://www.ica.se/recept/medelhavsinspirerad-fiskgryta-380632/",
    "https://www.ica.se/recept/fransk-ciderkyckling-med-varm-quinoasallad-717220/",
    "https://www.ica.se/recept/primorsallad-med-varmrokt-lax-717532/",
    "https://www.ica.se/recept/gratinee-a-loignon-gratinerad-loksoppa-5143/",
    "https://www.ica.se/recept/egen-majonnas-713014/",
    "https://www.ica.se/recept/vinbrasserad-tupp-coq-au-vin-717256/",
    "https://www.ica.se/recept/kotlett-meuniere-med-romanesco-717323/",
    "https://www.ica.se/recept/minutbiff-med-potatispure-aligot-och-bacon-717279/",
    "https://www.ica.se/recept/chevrepotatisgratang-4199/",
    "https://www.ica.se/recept/potatispate-bla-congo-162919/",
    "https://www.ica.se/recept/klassiska-vinkokta-musslor-716893/",
    "https://www.ica.se/recept/torsk-och-potatisbrandade-med-rokta-musslor-716928/",
    "https://www.ica.se/recept/pumpapistou-och-halloumipasta-716927/",
    "https://www.ica.se/recept/prinsens-crepes-716875/",
    "https://www.ica.se/recept/oxfile-provencale-med-potatisbakelse-svamp-och-persiljekram-458618/",
    "https://www.ica.se/recept/tonfisk-med-sardellvinagrett-och-nicoisegronsaker-380378/",
    "https://www.ica.se/recept/langkokt-lammstek-i-olivolja-595581/",
    "https://www.ica.se/recept/file-med-sydfranskt-gronsaksflarn-och-basilikasas-713277/",
    "https://www.ica.se/recept/rostade-rodbetor-med-pocherat-agg-flask-och-getostdressing-714056/",
    "https://www.ica.se/recept/grillad-entrecote-med-farsk-lok-haricots-verts-brynt-smor-och-dragon-715101/",
    "https://www.ica.se/recept/kalkon-bourguignon-687782/",
    "https://www.ica.se/recept/biff-provencale-med-tomater-650007/",
    "https://www.ica.se/recept/citron-och-timjankyckling-i-lergryta-713396/",
    "https://www.ica.se/recept/fransk-fisksoppa-715780/",
    "https://www.ica.se/recept/fiskgratang-provencale-715722/",
    "https://www.ica.se/recept/fransk-flaskgryta-med-senapssting-714312/",
    "https://www.ica.se/recept/boeuf-bourguignon-med-foliebakade-gulbetor-714295/",
    "https://www.ica.se/recept/torsk-nicoise-715556/",
    "https://www.ica.se/recept/fransk-loksoppa-714748/",
    "https://www.ica.se/recept/varm-agg-potatissallad-med-bacon-5308/",
    "https://www.ica.se/recept/torskgratang-a-la-medelhavet-251/",
    "https://www.ica.se/recept/lammfarsgratang-med-provencalska-gronsaker-91/",
    "https://www.ica.se/recept/franska-omeletter-med-bonfras-370420/",
    "https://www.ica.se/recept/fransk-appelomelett-4165/",
    "https://www.ica.se/recept/falukorv-med-bocuses-makaronigratang-2726/",
    "https://www.ica.se/recept/gratang-med-getost-2536/",
    "https://www.ica.se/recept/risotto-med-omelettrullar-4874/",
    "https://www.ica.se/recept/viltconsomme-med-svampfyllda-ravioli-344855/",
    "https://www.ica.se/recept/fransk-soppa-2882/",
    "https://www.ica.se/recept/franska-fyllda-tomater-675715/",
    "https://www.ica.se/recept/skinkgryta-provencale-352063/",
    "https://www.ica.se/recept/burgundisk-kyckling-1815/",
    "https://www.ica.se/recept/kalvfrikasse-med-sparris-612693/",
    "https://www.ica.se/recept/vinkokta-musslor-med-vitloksbrod-41/",
    "https://www.ica.se/recept/fransk-lantgryta-604917/",
    "https://www.ica.se/recept/fiskgryta-a-la-provencale-4560/",
    "https://www.ica.se/recept/pot-au-feu-pa-kyckling-453589/",
    "https://www.ica.se/recept/coq-au-vin-pa-kycklingfile-5111/",
    "https://www.ica.se/recept/burgundisk-kottgryta-5129/",
    "https://www.ica.se/recept/fransk-potatis-och-musselpanna-352321/",
    "https://www.ica.se/recept/lattlagad-choucroute-5114/",
    "https://www.ica.se/recept/eves-tomattarte-302613/",
    "https://www.ica.se/recept/quiche-lorraine-870/",
    "https://www.ica.se/recept/helstekt-entrecote-med-gronpeppar-och-citron-692647/",
    "https://www.ica.se/recept/duchessetoppar-713057/",
    "https://www.ica.se/recept/frise-azur-med-rokt-fisk-2878/",
    "https://www.ica.se/recept/fransk-fiskbullssallad-2876/",
    "https://www.ica.se/recept/burgundisk-oxfile-m-rotfruktspytt-3483/",
    "https://www.ica.se/recept/klassisk-fransk-pumpasoppa-322367/",
    "https://www.ica.se/recept/stekt-ankbrost-689152/",
    "https://www.ica.se/recept/medelhavssoppa-289/",
    "https://www.ica.se/recept/loksoppa-med-osttoast-374/",
    "https://www.ica.se/recept/loksoppa-i-lergryta-411/",
    "https://www.ica.se/recept/potatiskaka-med-getost-1218/",
    "https://www.ica.se/recept/ljummen-korv-och-potatissallad-2729/",
    "https://www.ica.se/recept/kycklingpate-268278/",
    "https://www.ica.se/recept/confiterad-griskind-713275/",
    "https://www.ica.se/recept/fransk-bondsallad-med-fiskpinnar-510343/",
    "https://www.ica.se/recept/tapenadspatta-pa-plommontomathalvor-296861/",
    "https://www.ica.se/recept/bondkyckling-med-potatis-rosmarin-och-vitlok-518781/",
    "https://www.ica.se/recept/chorizo-med-fransk-potatissallad-253544/",
    "https://www.ica.se/recept/biff-provencale-med-tomater-713124/",
    "https://www.ica.se/recept/farserad-lammstek-med-champinjoner-1298/",
    "https://www.ica.se/recept/annas-ostgratinerade-lok-och-potatissoppa-275462/",
    "https://www.ica.se/recept/baconlindade-kycklinglarfile-med-barigoulekokta-rotfrukter-714061/",
    "https://www.ica.se/recept/kyckling-cordon-bleu-med-fransk-sallad-637946/",
    "https://www.ica.se/recept/lammgrillare-med-rotfrukter-i-dillpistou-714062/"
  ];
let filename = "ica/ICA-middag-fransk-2017-11-12.json";

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

                        if (!recipe.ingredients || recipe.ingredients.length === 0) {
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