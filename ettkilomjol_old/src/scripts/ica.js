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


let urls =  [
    "https://www.ica.se/recept/tonfiskrora-713928/",
    "https://www.ica.se/recept/tacopaj-718512/",
    "https://www.ica.se/recept/fisksoppa-i-rott-388880/",
    "https://www.ica.se/recept/hallon-och-blabarsshot-med-mynta-719667/",
    "https://www.ica.se/recept/familjens-favoritmusli-657610/",
    "https://www.ica.se/recept/blabarssmoothie-med-kvarg-719931/",
    "https://www.ica.se/recept/smoothie-med-banan-spirulina-och-kokos-719728/",
    "https://www.ica.se/recept/smoothie-med-mango-apelsin-och-solroskarnor-718517/",
    "https://www.ica.se/recept/tomat-och-ortbraserad-kyckling-718498/",
    "https://www.ica.se/recept/kalkonfile-med-avokadorora-719031/",
    "https://www.ica.se/recept/smoothie-med-passionsfrukt-och-bjornbar-719729/",
    "https://www.ica.se/recept/grymt-god-grot-609077/",
    "https://www.ica.se/recept/chicken-massamun-curry-med-ris-718446/",
    "https://www.ica.se/recept/kycklingfile-med-apple-och-curryrora-719024/",
    "https://www.ica.se/recept/lingon-och-pepparsill-719344/",
    "https://www.ica.se/recept/morots-och-halloumibiffar-720975/",
    "https://www.ica.se/recept/blabar-och-vaniljsmoothie-534406/",
    "https://www.ica.se/recept/mango-och-nyponsmoothie-719418/",
    "https://www.ica.se/recept/froknacke-716579/",
    "https://www.ica.se/recept/dillstekt-torsk-med-potatismos-718936/",
    "https://www.ica.se/recept/spaghetti-med-kottfarssas-718508/",
    "https://www.ica.se/recept/gronsallad-med-granatapple-719107/",
    "https://www.ica.se/recept/golden-milk-smoothie-720194/",
    "https://www.ica.se/recept/majs-och-sesamplattar-719145/",
    "https://www.ica.se/recept/smoothie-med-apple-avokado-och-spenat-718298/",
    "https://www.ica.se/recept/peruansk-ceviche-717867/",
    "https://www.ica.se/recept/morotsjuice-med-ananas-blodapelsin-och-ingefara-719118/",
    "https://www.ica.se/recept/kinesisk-sojakyckling-med-wokade-gronsaker-714753/",
    "https://www.ica.se/recept/smoothie-med-rabarber-apple-och-ingefara-719727/",
    "https://www.ica.se/recept/kycklingklubba-med-artsas-och-tomatsallad-719427/",
    "https://www.ica.se/recept/kryddig-kycklinggryta-och-granatapple-718592/",
    "https://www.ica.se/recept/senapsbakad-torsk-med-rostad-sotpotatis-719027/",
    "https://www.ica.se/recept/hallon-och-blabarssmoothie-med-havregryn-715990/",
    "https://www.ica.se/recept/favoritbollar-716051/",
    "https://www.ica.se/recept/kycklingspett-med-gurksallad-och-kokosdressing-718792/",
    "https://www.ica.se/recept/smoothie-med-dadlar-blabar-och-lime-718518/",
    "https://www.ica.se/recept/kramig-risotto-med-kraftsallad-718604/",
    "https://www.ica.se/recept/halsosam-hallonglass-715885/",
    "https://www.ica.se/recept/gron-lemonad-720203/",
    "https://www.ica.se/recept/mango-och-apelsinsmoothie-med-kvarg-och-chiafron-718385/",
    "https://www.ica.se/recept/persisk-kyckling-med-zucchiniris-719010/",
    "https://www.ica.se/recept/kycklingbiffar-med-mos-och-syrad-kalrabbi-719455/",
    "https://www.ica.se/recept/chili-con-carne-718511/",
    "https://www.ica.se/recept/sojakyckling-med-krispigt-gront-719015/",
    "https://www.ica.se/recept/torsk-med-dragon-rodbetor-och-brynt-smor-719913/",
    "https://www.ica.se/recept/quinoasallad-med-grillade-champinjoner-719078/",
    "https://www.ica.se/recept/sticky-chicken-med-ananas-719687/",
    "https://www.ica.se/recept/gronsakspasta-pa-betor-med-fetaost-och-blabar-719528/",
    "https://www.ica.se/recept/bovetegrot-gluten-och-mjolkfri-716042/",
    "https://www.ica.se/recept/kycklingnuggets-med-dipp-718683/",
    "https://www.ica.se/recept/kycklingburgare-och-timjankram-med-prastost-719074/",
    "https://www.ica.se/recept/kyckling-med-gronsaker-och-limedressing-720018/",
    "https://www.ica.se/recept/quinoabrack-med-choklad-och-bar-719625/",
    "https://www.ica.se/recept/zucchiniplattar-med-fetaost-och-dill-720960/",
    "https://www.ica.se/recept/kycklingburgare-med-rostad-majs-och-avokadokram-718502/",
    "https://www.ica.se/recept/nyponnyp-716596/",
    "https://www.ica.se/recept/helgrillad-tofu-med-jordnotssas-och-grillad-farsk-lok-718418/",
    "https://www.ica.se/recept/proteindrink-smoothie-med-smak-av-jordgubbar-och-gurka-717812/",
    "https://www.ica.se/recept/blabarsgrot-715818/",
    "https://www.ica.se/recept/kryddfylld-hel-bosarpskyckling-719342/",
    "https://www.ica.se/recept/kryddig-vegochili-718164/",
    "https://www.ica.se/recept/rakor-cevice-style-med-avokado-och-koriander-717565/",
    "https://www.ica.se/recept/smoothie-med-avokado-och-hallon-715843/",
    "https://www.ica.se/recept/laxtaco-med-grillad-sparris-och-majs-och-lokkram-718798/",
    "https://www.ica.se/recept/dinkel-och-morotsfrallor-715820/",
    "https://www.ica.se/recept/isspoken-719604/",
    "https://www.ica.se/recept/paprikaglazade-kycklingspett-med-potatissallad-718665/",
    "https://www.ica.se/recept/mustig-kycklinggryta-med-shiitakesvamp-717591/",
    "https://www.ica.se/recept/pasta-med-salsa-verde-och-kyckling-719048/",
    "https://www.ica.se/recept/ljummen-morotsraita-med-mynta-och-mandel-718262/",
    "https://www.ica.se/recept/lime-och-ingefarsmarinerad-blomkal-och-linssallad-719671/",
    "https://www.ica.se/recept/dinkelscones-537589/",
    "https://www.ica.se/recept/spagetti-med-linsbolognese-721334/",
    "https://www.ica.se/recept/vattenmelonsallad-med-basilika-och-chipotle-718619/",
    "https://www.ica.se/recept/kycklingkebbe-med-labneh-718411/",
    "https://www.ica.se/recept/paolos-heta-rakor-med-vitlok-saffran-och-tomat-718733/",
    "https://www.ica.se/recept/pestobakad-spatta-med-citron-och-persiljeyoghurt-718858/",
    "https://www.ica.se/recept/chokladtryffel-med-apelsin-718581/",
    "https://www.ica.se/recept/stekt-spatta-med-grasloktzatziki-718143/",
    "https://www.ica.se/recept/kycklinglar-med-plommonsas-och-syrliga-morotter-719212/",
    "https://www.ica.se/recept/teffgrot-med-tillbehor-719930/",
    "https://www.ica.se/recept/chiasylt-med-blabar-och-ingefara-719261/",
    "https://www.ica.se/recept/gurka-och-avokadosoppa-med-grasloksolja-718417/",
    "https://www.ica.se/recept/moussaka-paket-718632/",
    "https://www.ica.se/recept/gronkalschips-med-oregano-och-vitlok-719440/",
    "https://www.ica.se/recept/hallon-och-avokadosmoothie-med-lime-och-ingefara-717684/",
    "https://www.ica.se/recept/not-och-nyponbrod-719629/",
    "https://www.ica.se/recept/avokadosallad-med-rahyvlad-sparris-och-pinjenotter-719039/",
    "https://www.ica.se/recept/apelsinsmoothie-med-melon-och-ingefara-715842/",
    "https://www.ica.se/recept/stekt-regnbagslax-med-pumpapesto-718485/",
    "https://www.ica.se/recept/japansk-rotsaksmiso-med-svamp-och-nori-720048/",
    "https://www.ica.se/recept/paket-med-morotter-honung-getost-och-solrosfron-718635/",
    "https://www.ica.se/recept/energismoothie-716598/",
    "https://www.ica.se/recept/indisk-sotpotatisgryta-med-kikartor-och-chili-720789/",
    "https://www.ica.se/recept/melon-och-fetaostspett-712722/",
    "https://www.ica.se/recept/pizza-pa-blomkalsbotten-med-portabello-719802/",
    "https://www.ica.se/recept/gron-bonsallad-med-matvete-och-valnotter-719268/",
    "https://www.ica.se/recept/dinkelscones-716065/",
    "https://www.ica.se/recept/rodbetor-med-hasselnotter-och-vit-balsamico-717994/",
    "https://www.ica.se/recept/juligt-froknacke-718365/",
    "https://www.ica.se/recept/blomkals-och-morotssoppa-629378/",
    "https://www.ica.se/recept/grillad-avokado-med-rakor-vitlok-och-korvel-718646/",
    "https://www.ica.se/recept/fajitas-med-rostad-majs-blomkalsris-och-kyckling-719940/",
    "https://www.ica.se/recept/kikartsfritters-med-myntayoghurt-719550/",
    "https://www.ica.se/recept/bonlasagne-med-spenat-och-zucchini-721965/",
    "https://www.ica.se/recept/farska-varrullar-med-tofu-och-thaibasilika-719807/",
    "https://www.ica.se/recept/applig-frukostgrot-715398/",
    "https://www.ica.se/recept/paronspoken-719600/",
    "https://www.ica.se/recept/pad-thai-720986/",
    "https://www.ica.se/recept/fiskpanna-med-tomater-och-persilja-367267/",
    "https://www.ica.se/recept/halvfryst-ananas-pa-spett-med-rostad-kokos-718515/",
    "https://www.ica.se/recept/apelsin-och-mango-med-vaniljcottage-cheese-718514/",
    "https://www.ica.se/recept/svensk-sommar-juice-med-smak-av-jordgubbar-717818/",
    "https://www.ica.se/recept/hel-laxsida-pa-grillen-med-mexican-salsa-verde-716102/",
    "https://www.ica.se/recept/kyckling-i-rod-curry-med-grona-bonor-719945/",
    "https://www.ica.se/recept/rosti-med-morotter-och-kyckling-550339/",
    "https://www.ica.se/recept/champinjonburgare-med-sotpotatisaioli-718626/",
    "https://www.ica.se/recept/kycklingfarsbiffar-med-gurksalsa-och-sparris-719825/",
    "https://www.ica.se/recept/teffgrot-med-korsbar-720002/",
    "https://www.ica.se/recept/frukt-och-notboll-714022/",
    "https://www.ica.se/recept/lins-och-chiapuckar-med-svamp-719875/",
    "https://www.ica.se/recept/vit-tonfisk-med-tapenadepotatissallad-718864/",
    "https://www.ica.se/recept/pestoquinoa-med-krispiga-gronsaker-714807/",
    "https://www.ica.se/recept/tomatsalsa-med-lime-och-chili-715987/",
    "https://www.ica.se/recept/sejgratang-324071/",
    "https://www.ica.se/recept/falafel-med-spenat-och-myntayoghurt-719804/",
    "https://www.ica.se/recept/glacerad-kyckling-med-gurk-och-avokadosallad-718933/",
    "https://www.ica.se/recept/vegobullar-717984/",
    "https://www.ica.se/recept/kycklingfarsburgare-720064/",
    "https://www.ica.se/recept/kyckling-marengo-713373/",
    "https://www.ica.se/recept/asiatisk-kycklingsoppa-665417/",
    "https://www.ica.se/recept/sojamarinerade-wannameirakor-med-avokado-719837/",
    "https://www.ica.se/recept/picklad-rodlok-721101/",
    "https://www.ica.se/recept/skogssmoothie-med-lingon-och-kardemumma-717778/",
    "https://www.ica.se/recept/gron-juice-med-smak-av-vindruvor-och-lime-717813/",
    "https://www.ica.se/recept/pasta-med-tonfisksas-715463/",
    "https://www.ica.se/recept/banan-med-jordnotter-och-riven-choklad-718513/",
    "https://www.ica.se/recept/jawaneh-heta-kycklingvingar-719502/",
    "https://www.ica.se/recept/insektsdadlar-tusenfoting-och-skalbaggar-719599/",
    "https://www.ica.se/recept/energibars-med-dadlar-amarant-och-jordnotssmor-719856/",
    "https://www.ica.se/recept/grekisk-sallad-med-pasta-713810/",
    "https://www.ica.se/recept/appelmun-med-mandeltander-och-hallontunga-719598/",
    "https://www.ica.se/recept/halstrad-tonfisk-med-gronartguacamole-719473/",
    "https://www.ica.se/recept/gulasch-pa-kyckling-716938/",
    "https://www.ica.se/recept/nyttiga-godisagg-720200/",
    "https://www.ica.se/recept/grillad-asiatisk-sallad-i-nam-jim-dressing-718645/",
    "https://www.ica.se/recept/aubergine-och-kikartscurry-med-spenat-och-kardemummaris-718522/",
    "https://www.ica.se/recept/latt-appeldessert-537565/",
    "https://www.ica.se/recept/vietnamesisk-nudelsallad-med-rakor-715349/",
    "https://www.ica.se/recept/bovetelimpa-med-aprikoser-fron-658623/",
    "https://www.ica.se/recept/sojastekt-lax-med-sotsyrlig-gurksallad-718908/",
    "https://www.ica.se/recept/ugnsomelett-med-japanska-influenser-718429/",
    "https://www.ica.se/recept/artiga-fredagstortillas-718100/",
    "https://www.ica.se/recept/gron-styrka-716609/",
    "https://www.ica.se/recept/hemgjort-naturgodis-717861/",
    "https://www.ica.se/recept/chiapudding-med-sweetie-och-rostade-mandlar-718277/",
    "https://www.ica.se/recept/koka-agg-422309/",
    "https://www.ica.se/recept/pannkakor-med-ljummen-hallonkompott-och-kvarg-718510/",
    "https://www.ica.se/recept/rodspatta-med-agg-och-kraftsas-716492/",
    "https://www.ica.se/recept/grillade-fruktspett-720407/",
    "https://www.ica.se/recept/pocherat-agg-pa-aubergine-718428/",
    "https://www.ica.se/recept/rakvarrulle-med-sot-currydip-716564/",
    "https://www.ica.se/recept/spannande-svampburgare-720383/",
    "https://www.ica.se/recept/kyckling-med-syrlig-gurksallad-719591/",
    "https://www.ica.se/recept/barbollar-med-notter-och-solrosfron-718520/",
    "https://www.ica.se/recept/energibars-med-bonor-718580/",
    "https://www.ica.se/recept/sotpotatis-med-vitloksyoghurt-och-korvelstekta-gronsaker-719312/",
    "https://www.ica.se/recept/frittata-med-rotfrukter-oregano-och-fetaost-718526/",
    "https://www.ica.se/recept/kycklinggryta-med-kikarter-715573/",
    "https://www.ica.se/recept/pasta-med-lax-och-mynta-716367/",
    "https://www.ica.se/recept/davosgrot-716031/",
    "https://www.ica.se/recept/avokado-och-paprika-i-glas-med-rostade-pumpakarnor-719897/",
    "https://www.ica.se/recept/cashewgradde-720007/",
    "https://www.ica.se/recept/svensk-laxboquerones-med-apple-kapris-dill-och-pepparrot-718809/",
    "https://www.ica.se/recept/quinoa-och-avokadosallad-med-rostade-rotfrukter-541552/",
    "https://www.ica.se/recept/mumsigt-appelmellis-718117/",
    "https://www.ica.se/recept/majs-och-artplattar-717972/",
    "https://www.ica.se/recept/tonfiskpasta-med-majs-och-tomat-717891/",
    "https://www.ica.se/recept/citron-och-fankalsstekt-kycklinglarfile-med-fetaostcreme-719824/",
    "https://www.ica.se/recept/kokospannkakor-med-banan-715827/",
    "https://www.ica.se/recept/apelsinsmoothie-med-kanel-och-banan-3954/",
    "https://www.ica.se/recept/quornfile-med-quinoasallad-och-avokadoyoghurt-627819/",
    "https://www.ica.se/recept/lins-och-bonchili-723196/",
    "https://www.ica.se/recept/ingefarsstekt-kyckling-med-gurka-och-groddar-719724/",
    "https://www.ica.se/recept/chilistekt-vegetarisk-pytt-med-kikartscreme-718261/",
    "https://www.ica.se/recept/tonfisklasagne-675670/",
    "https://www.ica.se/recept/chicken-tikka-masala-714087/",
    "https://www.ica.se/recept/raw-food-bar-och-notbollar-med-morot-719672/",
    "https://www.ica.se/recept/majssalsa-med-paprika-och-persilja-718911/",
    "https://www.ica.se/recept/bi-bim-bap-med-rakor-717556/",
    "https://www.ica.se/recept/kycklingcurry-717272/",
    "https://www.ica.se/recept/c-vitaminsmoothie-678284/",
    "https://www.ica.se/recept/smoothies-med-mango-och-hallon-712564/",
    "https://www.ica.se/recept/vegocarbonara-med-svamp-722541/",
    "https://www.ica.se/recept/kyckling-och-linsgryta-med-ingefara-och-kardemumma-720796/",
    "https://www.ica.se/recept/mango-och-passionsfruktssas-720111/",
    "https://www.ica.se/recept/paron-aprikoser-och-pistagenotter-718651/",
    "https://www.ica.se/recept/kyckling-i-ugn-med-paprika-och-zucchini-718387/",
    "https://www.ica.se/recept/sallad-nicoise-med-ugnsbakad-lax-718121/",
    "https://www.ica.se/recept/auberginepasta-med-tomat-och-orter-718291/",
    "https://www.ica.se/recept/fetafyllda-kycklingfileer-i-tomatsas-374733/",
    "https://www.ica.se/recept/gron-couscous-med-tomat-och-halloumi-721523/",
    "https://www.ica.se/recept/nudlar-svamp-sojabonor-och-agg-i-citrongrasbuljong-718523/",
    "https://www.ica.se/recept/het-kycklinggryta-388916/",
    "https://www.ica.se/recept/rosepepparstekt-kyckling-med-blomkals-och-broccolisallad-719826/",
    "https://www.ica.se/recept/feta-och-rodbetsplattar-med-gurkrora-718685/",
    "https://www.ica.se/recept/rodbetsboost-juice-med-smak-av-rodbetor-och-apelsin-717807/",
    "https://www.ica.se/recept/tunnbrodsrulle-med-tonfisk-715186/",
    "https://www.ica.se/recept/grillad-kycklingfile-med-sotpotatissallad-och-yoghurt-715372/",
    "https://www.ica.se/recept/fried-rice-med-rakor-715255/",
    "https://www.ica.se/recept/daal-pa-roda-linser-720326/",
    "https://www.ica.se/recept/papayasalsa-718617/",
    "https://www.ica.se/recept/stekt-torsk-med-aggsas-och-broccoli-718285/",
    "https://www.ica.se/recept/spaghetti-med-kryddig-kycklingfarssas-717724/",
    "https://www.ica.se/recept/kalkonfile-med-rotsakspure-och-sotsyrlig-lok-715558/",
    "https://www.ica.se/recept/tunnbrodsrullar-med-tonfisk-och-spenat-713506/",
    "https://www.ica.se/recept/taconuggets-i-brod-716407/",
    "https://www.ica.se/recept/mango-och-hallonsmoothie-717411/",
    "https://www.ica.se/recept/melon-och-fetaostspett-med-mynta-714909/",
    "https://www.ica.se/recept/linscurry-med-pumpa-kokos-och-lime-722760/",
    "https://www.ica.se/recept/lasagne-med-zucchini-och-linser-722607/",
    "https://www.ica.se/recept/snabb-glass-med-avokado-mango-och-hallon-718566/",
    "https://www.ica.se/recept/majs-och-zucciniplattar-med-paprika-bon-och-olivsallad-718198/",
    "https://www.ica.se/recept/marockansk-harirasoppa-med-pitabrod-och-yoghurt-720802/",
    "https://www.ica.se/recept/yoghurtglass-med-hallon-och-apelsin-715776/",
    "https://www.ica.se/recept/kramig-gnocchi-med-kalkonfile-719316/",
    "https://www.ica.se/recept/champinjon-och-lokpaket-med-dragon-718633/",
    "https://www.ica.se/recept/tre-mumsiga-roror-717408/",
    "https://www.ica.se/recept/stekt-lax-med-artsas-716749/",
    "https://www.ica.se/recept/torskfile-med-dillsas-och-morotter-713965/",
    "https://www.ica.se/recept/hoisinkyckling-med-risnudlar-715355/",
    "https://www.ica.se/recept/torsk-med-aggsas-717330/",
    "https://www.ica.se/recept/masala-med-kikarter-och-spenat-722624/",
    "https://www.ica.se/recept/morotsrarakor-med-kikartsrora-och-ost-721601/",
    "https://www.ica.se/recept/kikart-och-vitkalspannkakor-med-lingon-och-appelsallad-720053/",
    "https://www.ica.se/recept/pasta-med-schalottenlok-sparris-salvia-och-feta-718490/",
    "https://www.ica.se/recept/torsk-och-kraftpanna-med-pepparrot-och-dill-714391/",
    "https://www.ica.se/recept/kycklingfarsbiffar-med-bondsallad-och-basilikaricotta-714050/",
    "https://www.ica.se/recept/svamppizza-med-kyckling-timjan-och-schalottenlok-715303/",
    "https://www.ica.se/recept/poke-bowl-720870/",
    "https://www.ica.se/recept/chokladkick-med-bovete-717284/",
    "https://www.ica.se/recept/gnocchi-med-svartkal-blomkal-och-persiljericotta-720787/",
    "https://www.ica.se/recept/ketjap-maniskyckling-med-rostad-sesam-719217/",
    "https://www.ica.se/recept/kyckling-med-paprikadipp-717555/",
    "https://www.ica.se/recept/vegobullar-med-vitloksyoghurt-och-fetaost-718183/",
    "https://www.ica.se/recept/pasta-med-broccoli-och-arrabbiatakram-715258/",
    "https://www.ica.se/recept/pasta-med-paprikapesto-knaperstekt-tofu-och-spenat-714766/",
    "https://www.ica.se/recept/hoisinkyckling-med-nudlar-716648/",
    "https://www.ica.se/recept/rakor-och-yoghurtsas-717570/",
    "https://www.ica.se/recept/rodbetsgryta-med-mandel-och-artchutney-716045/",
    "https://www.ica.se/recept/paella-567002/",
    "https://www.ica.se/recept/loksill-713494/",
    "https://www.ica.se/recept/majskolv-i-folie-med-soja-vitlok-och-chili-718636/",
    "https://www.ica.se/recept/morot-och-artsallad-med-lime-och-mynta-718531/",
    "https://www.ica.se/recept/currytorsk-med-spenatris-715470/",
    "https://www.ica.se/recept/kalkonpasta-med-svamp-och-vitlok-675687/",
    "https://www.ica.se/recept/chokladkaka-med-rodbeta-717313/",
    "https://www.ica.se/recept/kryddstekta-rakor-med-mangosallad-719311/",
    "https://www.ica.se/recept/paket-med-pimento-de-padron-mandel-och-vitlok-718634/",
    "https://www.ica.se/recept/pumpasoppa-med-curry-kokos-och-spenat-720801/",
    "https://www.ica.se/recept/apelsin-och-basilikamarinerad-morots-och-zucchinipasta-718260/",
    "https://www.ica.se/recept/rostade-rotfrukter-med-appelcreme-fraiche-676987/",
    "https://www.ica.se/recept/fisk-i-paprikasas-550290/",
    "https://www.ica.se/recept/zucchinibulgur-med-fetaost-och-kikartsrora-714277/",
    "https://www.ica.se/recept/chili-sin-carne-med-mandel-och-persilja-721809/",
    "https://www.ica.se/recept/ljummen-sallad-med-tomatrostad-brysselkal-och-basilikalimeyoghurt-719228/",
    "https://www.ica.se/recept/rakpasta-med-het-tomatsas-715266/",
    "https://www.ica.se/recept/plommonsting-716616/",
    "https://www.ica.se/recept/mandel-fikonbollar-595866/",
    "https://www.ica.se/recept/kanel-och-dadelbollar-721234/",
    "https://www.ica.se/recept/sportdryck-med-ingefara-och-citron-719782/",
    "https://www.ica.se/recept/sallad-med-sesamstekt-lax-och-sojamarinerade-gronsaker-718305/",
    "https://www.ica.se/recept/kyckling-med-rosmarin-och-sockerartor-715207/",
    "https://www.ica.se/recept/fisk-provencale-716095/",
    "https://www.ica.se/recept/gron-kiwi-och-avokadosmoothie-717286/",
    "https://www.ica.se/recept/rostad-majs-och-sotpotatissoppa-721638/",
    "https://www.ica.se/recept/halstrad-tonfisk-med-avokadohummus-718272/",
    "https://www.ica.se/recept/mandelstekt-kycklingfile-med-rispilaff-406347/",
    "https://www.ica.se/recept/couscoussallad-med-kyckling-och-pumpafron-716379/",
    "https://www.ica.se/recept/fars-i-pita-med-gurkyoghurt-713814/",
    "https://www.ica.se/recept/vegansk-julskinka-av-rotselleri-721241/",
    "https://www.ica.se/recept/kryddstekt-lax-med-avokadosalsa-721366/",
    "https://www.ica.se/recept/black-bean-chiabrownie-718695/",
    "https://www.ica.se/recept/surstrommingsstut-675570/",
    "https://www.ica.se/recept/veggopizza-med-aubergine-och-paprika-712633/",
    "https://www.ica.se/recept/shakshuka-med-tre-sorters-paprika-722089/",
    "https://www.ica.se/recept/vietnamesisk-glasnudelsallad-med-rakor-721096/",
    "https://www.ica.se/recept/kycklingpasta-med-mangosas-715619/",
    "https://www.ica.se/recept/morots-och-cottage-cheeseplattar-352090/",
    "https://www.ica.se/recept/sojafrast-broccolisallad-med-rodkal-bulgur-och-sesamkyckling-715893/",
    "https://www.ica.se/recept/spaghetti-med-tonfisksas-668725/",
    "https://www.ica.se/recept/torsk-med-squash-och-tomater-550434/",
    "https://www.ica.se/recept/fruktsallad-med-mango-och-ananas-717598/",
    "https://www.ica.se/recept/cruditeer-med-apelsin-och-rosmarindip-714245/",
    "https://www.ica.se/recept/minicalzone-med-kronartskocka-basilika-och-getost-713762/",
    "https://www.ica.se/recept/vietnamesisk-nudelsallad-med-rakor-716624/",
    "https://www.ica.se/recept/bon-och-majsburgare-med-avokadokram-722220/",
    "https://www.ica.se/recept/farskpotatissallad-med-krasse-och-grasloksdressing-720091/",
    "https://www.ica.se/recept/kikartsrora-med-sesam-och-rodbetor-718528/",
    "https://www.ica.se/recept/appelklyftor-med-pecannotskvarg-718516/",
    "https://www.ica.se/recept/rastekt-brysselkal-med-chili-lime-och-cashewnotter-718179/",
    "https://www.ica.se/recept/paprikafras-i-pita-med-vitloksyoghurt-716503/",
    "https://www.ica.se/recept/frukt-och-notgodingar-652236/",
    "https://www.ica.se/recept/risotto-med-sojabonor-och-gremolata-721173/",
    "https://www.ica.se/recept/rostad-majs-med-solrosfron-720076/",
    "https://www.ica.se/recept/ljummen-rotfruktssallad-med-citron-rosmarin-och-paprika-719942/",
    "https://www.ica.se/recept/grillad-guacamole-720068/",
    "https://www.ica.se/recept/stekt-lax-med-risnudlar-agg-och-gronsaker-i-sojabuljong-719065/",
    "https://www.ica.se/recept/rosa-hummus-718564/",
    "https://www.ica.se/recept/pasta-med-broccolisas-och-korv-713970/",
    "https://www.ica.se/recept/fiskkakor-med-syrlig-dipp-654229/",
    "https://www.ica.se/recept/pasta-med-spenat-och-feta-715196/",
    "https://www.ica.se/recept/julkryddade-kycklingkottbullar-med-spetstkal-fikon-och-apelsin-719339/",
    "https://www.ica.se/recept/broccolipasta-med-pinjenotter-och-haricots-verts-721805/",
    "https://www.ica.se/recept/tabbouleh-pa-matvete-och-sasongens-rotfrukter-721329/",
    "https://www.ica.se/recept/fryst-choklad-och-passionstarta-721414/",
    "https://www.ica.se/recept/isad-gron-gazpacho-med-kungsrakor-720057/",
    "https://www.ica.se/recept/sparrissallad-med-ragbrod-valnotter-och-adelost-718415/",
    "https://www.ica.se/recept/tonfiskpasta-med-pepparrot-715351/",
    "https://www.ica.se/recept/stekt-torsk-med-rom-och-rodloksgraddfil-714761/",
    "https://www.ica.se/recept/apelsinbakad-fisk-med-kramiga-tomater-717316/",
    "https://www.ica.se/recept/veggochili-med-falafel-och-yoghurt-713403/",
    "https://www.ica.se/recept/nuggets-i-pita-715126/",
    "https://www.ica.se/recept/mug-cake-717189/",
    "https://www.ica.se/recept/morotsjuice-med-apple-och-ingefara-716568/",
    "https://www.ica.se/recept/italiensk-blomkalspizza-719863/",
    "https://www.ica.se/recept/kycklingwok-med-nudlar-719467/",
    "https://www.ica.se/recept/blabarslycka-juice-pa-blabar-kiwi-och-clementin-717817/",
    "https://www.ica.se/recept/grillad-kalkonfile-med-ratatoille-716120/",
    "https://www.ica.se/recept/tomatsalsa-pico-de-gallo-717643/",
    "https://www.ica.se/recept/bonbulgur-med-kalkon-och-citronyoghurt-716646/",
    "https://www.ica.se/recept/morotspasta-med-sas-pa-linser-och-blomkalsris-718281/",
    "https://www.ica.se/recept/smorstekt-torsk-med-art-och-broccolipure-718341/",
    "https://www.ica.se/recept/blomkalspizza-med-gronkal-pesto-och-fikon-721666/",
    "https://www.ica.se/recept/appelpicklad-rabarber-med-anis-720241/",
    "https://www.ica.se/recept/frostekt-lax-med-rostat-vitkalsris-och-citron-och-gurkkvarg-720050/",
    "https://www.ica.se/recept/pasta-med-rokt-lax-gronkal-och-korvel-718684/",
    "https://www.ica.se/recept/kalkonfile-med-sojamarinerad-svamp-och-wasabimajonnas-718478/",
    "https://www.ica.se/recept/torshi-persisk-gronsaksblandning-717945/",
    "https://www.ica.se/recept/kycklingfile-med-broccoli-och-fullkornsris-559690/",
    "https://www.ica.se/recept/tikka-masalakryddad-kyckling-717028/",
    "https://www.ica.se/recept/ugnsbakad-torsk-med-ortsas-717664/",
    "https://www.ica.se/recept/kycklinggulasch-715633/",
    "https://www.ica.se/recept/halstrad-lax-med-gronartsguacamole-716737/",
    "https://www.ica.se/recept/appeltryfflar-714591/",
    "https://www.ica.se/recept/rostad-blomkal-med-morotter-i-garam-masalayoghurt-718524/",
    "https://www.ica.se/recept/kycklingklubba-med-apple-och-curry-718402/",
    "https://www.ica.se/recept/kyckling-med-potatissallad-715419/",
    "https://www.ica.se/recept/ugnsrostad-zucchini-med-godsaker-617246/",
    "https://www.ica.se/recept/fried-rice-714868/",
    "https://www.ica.se/recept/linssoppa-713869/",
    "https://www.ica.se/recept/honungsstekt-kyckling-med-syrliga-ingefarsgronsaker-715896/",
    "https://www.ica.se/recept/kycklingpasta-med-tomat-och-oregano-717315/",
    "https://www.ica.se/recept/supersnabb-omelett-i-mikron-714025/",
    "https://www.ica.se/recept/kycklingburgare-717204/",
    "https://www.ica.se/recept/glasnudlar-med-lime-och-jordnotter-722456/",
    "https://www.ica.se/recept/poke-bowl-med-gulbetor-limedressing-och-sesamsas-721472/",
    "https://www.ica.se/recept/kramig-tortellini-med-ricotta-och-tomatpesto-721207/",
    "https://www.ica.se/recept/virgin-strawberry-daiquiri-720595/",
    "https://www.ica.se/recept/svamplasagne-med-pesto-och-ricotta-720149/",
    "https://www.ica.se/recept/rotfruktgryta-med-tomatcreme-598609/",
    "https://www.ica.se/recept/bbq-klubbor-med-ris-718081/",
    "https://www.ica.se/recept/avokado-och-jordgubbssalsa-717777/",
    "https://www.ica.se/recept/bulgogi-med-ananas-och-rostat-kokosris-713940/",
    "https://www.ica.se/recept/quorn-med-champinjoner-dragon-och-fullkornsris-586935/",
    "https://www.ica.se/recept/citrondoftande-lins-och-potatissoppa-med-naanbrod-713844/",
    "https://www.ica.se/recept/persisk-risotto-med-rispasta-och-bulgur-515908/",
    "https://www.ica.se/recept/kruskavlat-tunnbrod-697128/",
    "https://www.ica.se/recept/kyckling-och-rostade-rotfrukter-716654/",
    "https://www.ica.se/recept/spenatpannkaka-med-ortrora-722522/",
    "https://www.ica.se/recept/kyckling-och-gronsakspanna-med-rostad-potatis-och-citronyoghurt-720777/",
    "https://www.ica.se/recept/grillad-spetskal-med-apple-och-dill-718644/",
    "https://www.ica.se/recept/hostsallad-med-bonor-och-apple-718093/",
    "https://www.ica.se/recept/kycklingkebab-316944/",
    "https://www.ica.se/recept/dillstekt-fisk-med-currypickles-717054/",
    "https://www.ica.se/recept/curry-med-lime-yoghurt-och-koriander-716830/",
    "https://www.ica.se/recept/blomkalsbolognese-med-mozzarellasallad-721915/",
    "https://www.ica.se/recept/fish-tacos-721191/",
    "https://www.ica.se/recept/falafel-pa-sotpotatis-med-limekram-718742/",
    "https://www.ica.se/recept/lins-och-fetaostbiffar-med-graslok-och-tomatsallad-720774/",
    "https://www.ica.se/recept/grillad-marinerad-paprika-med-persilja-och-chili-720072/",
    "https://www.ica.se/recept/grot-med-morotsjuice-och-lingon-719870/",
    "https://www.ica.se/recept/sojakorv-med-ananas-myntasalsa-719240/",
    "https://www.ica.se/recept/spatta-med-rodloksgremolata-719073/",
    "https://www.ica.se/recept/ciderkokt-kyckling-med-apple-och-lok-713974/",
    "https://www.ica.se/recept/couscous-med-rakor-och-yoghurtsas-716263/",
    "https://www.ica.se/recept/victorias-dinkelbaguetter-713036/",
    "https://www.ica.se/recept/kalsallad-med-granatapple-714460/",
    "https://www.ica.se/recept/krispig-torsk-med-dansk-remouladsas-716731/",
    "https://www.ica.se/recept/barmoussetarta-med-bovetecrisp-722638/",
    "https://www.ica.se/recept/knacke-pa-roda-linser-722640/",
    "https://www.ica.se/recept/veganburgare-722002/",
    "https://www.ica.se/recept/rarorda-blabar-med-chiafron-och-kokos-719677/",
    "https://www.ica.se/recept/nyttig-kladdkaka-719574/",
    "https://www.ica.se/recept/broccoliris-med-ugnskyckling-717916/",
    "https://www.ica.se/recept/avokadosallad-med-majs-paprika-och-koriander-713571/",
    "https://www.ica.se/recept/kraftpasta-med-pepparrot-688086/",
    "https://www.ica.se/recept/lattfrusen-appelyoghurt-716835/",
    "https://www.ica.se/recept/potatis-och-blomkalsmos-med-lax-716826/",
    "https://www.ica.se/recept/rosmarinrostade-rotfrukter-med-kycklingfile-716746/",
    "https://www.ica.se/recept/stuvad-risoni-med-majs-och-ost-722079/",
    "https://www.ica.se/recept/syrlig-bongryta-med-bulgur-och-koriander-720778/",
    "https://www.ica.se/recept/champinjonburgare-med-guacamole-721158/",
    "https://www.ica.se/recept/cashew-och-sotpotatisbiffar-med-ingefara-720908/",
    "https://www.ica.se/recept/farska-varrullar-med-grillad-tofu-och-ingefarsdipp-720099/",
    "https://www.ica.se/recept/chai-chiapudding-med-morotsjuice-719871/",
    "https://www.ica.se/recept/blomkalsris-med-ingefara-kokosmjolk-och-sojamajonnas-718259/",
    "https://www.ica.se/recept/fisksoppa-med-rakor-och-vitlok-650775/",
    "https://www.ica.se/recept/sesamnudlar-med-kraftor-och-chilidip-713966/",
    "https://www.ica.se/recept/bami-goreng-med-agg-och-ketjap-manis-714388/",
    "https://www.ica.se/recept/couscous-med-rakor-och-yoghurtsas-715066/",
    "https://www.ica.se/recept/spaghetti-bolognese-med-citron-715260/",
    "https://www.ica.se/recept/kycklingcurry-med-ris-714641/",
    "https://www.ica.se/recept/bulgursallad-med-linser-297586/",
    "https://www.ica.se/recept/pasta-med-kalkon-och-mozzarella-717425/",
    "https://www.ica.se/recept/gron-hummus-717190/",
    "https://www.ica.se/recept/morotssoppa-med-ingefara-och-chili-723030/",
    "https://www.ica.se/recept/jorgubbssmoothie-722995/",
    "https://www.ica.se/recept/salty-caramel-bites-722754/",
    "https://www.ica.se/recept/chokladbollar-glutenfria-721940/",
    "https://www.ica.se/recept/overnight-oats-med-chiafron-och-apple-721663/",
    "https://www.ica.se/recept/rotfruktsgryta-med-tomat-ingefara-och-kokosmjolk-719943/",
    "https://www.ica.se/recept/varm-sallad-med-matvete-rostad-broccoli-rodlok-och-avokadokram-718384/",
    "https://www.ica.se/recept/biryani-med-gronsaker-och-notter-297635/",
    "https://www.ica.se/recept/kalkon-med-applen-och-selleripure-645268/",
    "https://www.ica.se/recept/kokt-torskfile-med-bacon-och-artpure-388457/",
    "https://www.ica.se/recept/kokta-kycklingfileer-med-ostrisotto-375202/",
    "https://www.ica.se/recept/radiskimchi-med-kyckling-och-sesam-716621/",
    "https://www.ica.se/recept/sommarbar-med-lime-och-myntakryddad-honungsyoghurt-418941/",
    "https://www.ica.se/recept/sydfransk-kycklinggryta-713323/",
    "https://www.ica.se/recept/primorsallad-med-matvete-och-citronett-716509/",
    "https://www.ica.se/recept/appelkick-med-ingefara-och-citron-717192/",
    "https://www.ica.se/recept/nudlar-med-krispiga-gronsaker-och-cashewnotter-721435/",
    "https://www.ica.se/recept/shakshuka-721352/",
    "https://www.ica.se/recept/raw-smulpaj-720867/",
    "https://www.ica.se/recept/green-smoothie-med-kiwi-och-spenat-719109/",
    "https://www.ica.se/recept/saffranscouscous-med-rakor-718405/",
    "https://www.ica.se/recept/rodbetsbiffar-med-gurkyoghurt-och-fetaost-718126/",
    "https://www.ica.se/recept/chili-sin-carne-559566/",
    "https://www.ica.se/recept/kycklingfile-med-sotpotatissallad-och-yoghurt-716643/",
    "https://www.ica.se/recept/grillad-melon-med-fetaost-och-citron-717651/",
    "https://www.ica.se/recept/torsk-med-pepparrot-och-stomp-717207/",
    "https://www.ica.se/recept/lasagne-med-paprika-och-linser-723133/",
    "https://www.ica.se/recept/kycklingfile-i-currybuljong-med-sockerarter-och-nudlar-722466/",
    "https://www.ica.se/recept/vegansk-skargardssill-av-aubergine-721249/",
    "https://www.ica.se/recept/kryddiga-veganska-kottbullar-av-ris-och-kikarter-721245/",
    "https://www.ica.se/recept/sotsura-lingonremmar-721287/",
    "https://www.ica.se/recept/citron-och-honungsmarinerad-fankal-och-zucchini-718530/",
    "https://www.ica.se/recept/artlasagne-med-tomater-och-ricotta-718525/",
    "https://www.ica.se/recept/cornburgers-717580/",
    "https://www.ica.se/recept/havreplattar-med-banan-715245/",
    "https://www.ica.se/recept/kycklingklubbor-med-gron-salsa-426295/",
    "https://www.ica.se/recept/sellerijuice-med-ingefara-716816/",
    "https://www.ica.se/recept/basta-veganska-julkottbullen-723104/",
    "https://www.ica.se/recept/rostad-brysselkal-med-apelsin-och-mandelsmor-723084/",
    "https://www.ica.se/recept/paprikapappardelle-med-zucchini-och-oliver-722356/",
    "https://www.ica.se/recept/avokadopizza-med-chili-721822/",
    "https://www.ica.se/recept/fropanerad-zucchini-med-parmesankram-721615/",
    "https://www.ica.se/recept/stekt-spatta-med-gurkfil-719468/",
    "https://www.ica.se/recept/rakpasta-med-citron-och-pumpafron-721447/",
    "https://www.ica.se/recept/korvsoppa-med-risoni-basilika-och-parmesan-720799/",
    "https://www.ica.se/recept/varmande-nypondryck-719512/",
    "https://www.ica.se/recept/indisk-linssoppa-mulligatawny-718554/",
    "https://www.ica.se/recept/spaghetti-med-svamp-och-rotfruktssas-718196/",
    "https://www.ica.se/recept/juice-med-smak-av-gulbeta-och-ingefara-717819/",
    "https://www.ica.se/recept/green-currykyckling-med-fullkornsris-550420/",
    "https://www.ica.se/recept/potatispannkaka-och-blabarscottage-cheese-714741/",
    "https://www.ica.se/recept/gaspacho-light-716608/",
    "https://www.ica.se/recept/dillstekt-torsk-med-potatismos-717584/",
    "https://www.ica.se/recept/pastasallad-med-rostad-paprika-och-mozzarella-713591/",
    "https://www.ica.se/recept/tomatsoppa-722050/",
    "https://www.ica.se/recept/kikartscurry-med-tofu-och-mynta-722200/",
    "https://www.ica.se/recept/vegansk-senapssill-av-aubergine-721247/",
    "https://www.ica.se/recept/kyckling-och-ingefara-i-buljong-med-nudlar-och-champinjoner-720798/",
    "https://www.ica.se/recept/spatta-meuniere-med-tomat-och-basilika-718086/",
    "https://www.ica.se/recept/rostade-rotfrukter-med-kyckling-och-dragondipp-717968/",
    "https://www.ica.se/recept/ugnsbakad-spatta-med-vitlokssas-och-kokt-potatis-717831/",
    "https://www.ica.se/recept/kycklingpasta-med-aubergine-och-basilika-714292/",
    "https://www.ica.se/recept/medelhavsfisk-714870/",
    "https://www.ica.se/recept/kycklingklubba-med-paprika-och-vita-bonor-714848/",
    "https://www.ica.se/recept/yoghurtglass-med-honungsstekta-applen-714768/",
    "https://www.ica.se/recept/avokadosallad-med-bonor-665457/",
    "https://www.ica.se/recept/pimpat-bovete-716048/",
    "https://www.ica.se/recept/fankalskick-716607/",
    "https://www.ica.se/recept/chiapudding-716900/",
    "https://www.ica.se/recept/pasta-arrabbiata-med-bellaverde-723239/",
    "https://www.ica.se/recept/kyckling-med-krispigt-gront-717665/",
    "https://www.ica.se/recept/quinoasallad-med-rostade-gronsaker-lax-och-rodlokskvarg-720771/",
    "https://www.ica.se/recept/krossad-sotpotatis-med-lime-och-vitlok-720085/",
    "https://www.ica.se/recept/laxkuber-i-citron-och-myntamarinad-vattenmelon-och-pinjenotter-717699/",
    "https://www.ica.se/recept/zucchiniplattar-714620/",
    "https://www.ica.se/recept/torsk-med-frasch-gronsaksrora-381158/",
    "https://www.ica.se/recept/tomatjuice-med-paprika-716820/",
    "https://www.ica.se/recept/skaldjurswok-med-glasnudlar-715587/",
    "https://www.ica.se/recept/persiljestekt-kyckling-717106/",
    "https://www.ica.se/recept/paella-med-kyckling-och-skaldjur-653383/",
    "https://www.ica.se/recept/fruktsallad-med-kardemummayoghurt-631152/",
    "https://www.ica.se/recept/rodbetstarta-med-vinkokta-rodbetor-morotter-713012/",
    "https://www.ica.se/recept/barnens-favoriter-med-fullkorn-558047/",
    "https://www.ica.se/recept/huevos-y-frijoles-716720/",
    "https://www.ica.se/recept/kramig-rodbetssmoothie-med-gronkal-722635/",
    "https://www.ica.se/recept/ragpannkaka-med-blabar-och-hasselnotter-722521/",
    "https://www.ica.se/recept/timjansdoftande-svamppasta-med-parmesan-721958/",
    "https://www.ica.se/recept/stekt-lax-med-mangosalsa-och-koriander-721680/",
    "https://www.ica.se/recept/svamp-och-bonsoppa-med-varma-kycklingmackor-720800/",
    "https://www.ica.se/recept/hallon-och-jordgubbsglass-720653/",
    "https://www.ica.se/recept/mango-och-avokadosalsa-720493/",
    "https://www.ica.se/recept/tomat-och-timjansbraserad-kotlett-blomkal-och-mandel-719982/",
    "https://www.ica.se/recept/ljummen-quinoasallad-med-avokado-719530/",
    "https://www.ica.se/recept/laxnuggets-med-marinerade-gronisar-717889/",
    "https://www.ica.se/recept/avokadosalsa-med-rakor-716718/",
    "https://www.ica.se/recept/seafood-med-nudlar-och-pak-choy-i-ingefarsbuljong-714654/",
    "https://www.ica.se/recept/fisk-med-paprika-och-chili-717429/",
    "https://www.ica.se/recept/fetafyllda-squashskivor-365987/",
    "https://www.ica.se/recept/lax-med-fetaost-och-tomatsallad-717475/",
    "https://www.ica.se/recept/musli-712565/",
    "https://www.ica.se/recept/ragbullar-med-kavringsmak-714382/",
    "https://www.ica.se/recept/havrerutor-med-frukt-och-fron-675731/",
    "https://www.ica.se/recept/vegetarisk-chili-716661/",
    "https://www.ica.se/recept/svampsoppa-med-farskosttoast-716738/",
    "https://www.ica.se/recept/artig-spenatsoppa-723211/",
    "https://www.ica.se/recept/smashad-potatis-med-ortsmor-722468/",
    "https://www.ica.se/recept/vegansk-skagenrora-med-tofu-och-tangkaviar-721863/",
    "https://www.ica.se/recept/chokladmousse-med-jordnotscrunch-721848/",
    "https://www.ica.se/recept/grasloksstekt-lax-med-blomkalsmos-721433/",
    "https://www.ica.se/recept/citronkyckling-och-bonor-med-rosmarin-och-rostade-gronsaker-720795/",
    "https://www.ica.se/recept/lax-med-broccolipure-och-dragon-720792/",
    "https://www.ica.se/recept/kashk-e-bademjan-aubergine-och-valnotsrora-720964/",
    "https://www.ica.se/recept/limepicklad-gurka-och-rattika-med-koriander-720071/",
    "https://www.ica.se/recept/raw-kladdkaka-med-cashewgradde-720006/",
    "https://www.ica.se/recept/dragonkyckling-med-svarta-oliver-718181/",
    "https://www.ica.se/recept/potatis-och-majsplattar-med-rommig-yoghurt-715365/",
    "https://www.ica.se/recept/balsamicosill-med-rostad-mandel-713585/",
    "https://www.ica.se/recept/kycklingwok-med-sweet-chili-och-jordnotter-713609/",
    "https://www.ica.se/recept/svamp-och-paprikakyckling-665296/",
    "https://www.ica.se/recept/marockanskt-brod-384651/",
    "https://www.ica.se/recept/frasig-fisk-med-currysallad-716989/",
    "https://www.ica.se/recept/mellissmart-omelett-716691/",
    "https://www.ica.se/recept/ramen-med-agg-och-champinjoner-723296/",
    "https://www.ica.se/recept/portabellopasta-med-linser-och-mozzarella-723070/",
    "https://www.ica.se/recept/mandelkaka-med-bar-722778/",
    "https://www.ica.se/recept/kronartskockspasta-med-bonor-och-ruccola-722246/",
    "https://www.ica.se/recept/chokladpopcorn-med-flingsalt-721262/",
    "https://www.ica.se/recept/avokadoglass-med-spenat-720654/",
    "https://www.ica.se/recept/kycklingpasta-med-avokado-720139/",
    "https://www.ica.se/recept/rispappersvarrullar-med-ingefarsdipp-719985/",
    "https://www.ica.se/recept/rodbetspuckar-med-basilika-719873/",
    "https://www.ica.se/recept/lasagne-med-aubergine-och-ricotta-719806/",
    "https://www.ica.se/recept/apelsin-och-tomatpasta-med-kraftor-718318/",
    "https://www.ica.se/recept/blabar-suprise-juice-med-smak-av-blabar-och-tomat-717814/",
    "https://www.ica.se/recept/asiatisk-kyckling-med-lime-533876/",
    "https://www.ica.se/recept/viltgulasch-med-vitlokskram-715957/",
    "https://www.ica.se/recept/grillad-bbq-kyckling-med-tzatziki-716218/",
    "https://www.ica.se/recept/styrkeshot-716595/",
    "https://www.ica.se/recept/kalkraft-716612/",
    "https://www.ica.se/recept/vegansk-jordgubbscheesecake-722003/",
    "https://www.ica.se/recept/snabb-mangoglass-med-kvarg-721662/",
    "https://www.ica.se/recept/green-garden-sumo-721315/",
    "https://www.ica.se/recept/frukt-och-notbrod-med-fikon-och-aprikos-720925/",
    "https://www.ica.se/recept/torkade-appelringar-721144/",
    "https://www.ica.se/recept/het-linsgryta-med-kumminstekt-vegetarisk-pytt-och-honungskvarg-720783/",
    "https://www.ica.se/recept/jordnotsbollar-720601/",
    "https://www.ica.se/recept/parlcouscoussallad-med-kryddstekt-minutbiff-720174/",
    "https://www.ica.se/recept/avokado-med-chilirostade-kikarter-och-cashewnotter-719898/",
    "https://www.ica.se/recept/lime-och-blabarspaj-raw-style-719125/",
    "https://www.ica.se/recept/kycklingpanna-med-blomkal-och-aprikoser-713953/",
    "https://www.ica.se/recept/citrusfisk-714319/",
    "https://www.ica.se/recept/fiskgryta-med-fankal-och-farsk-pasta-516256/",
    "https://www.ica.se/recept/bulgursallad-med-linser-504852/",
    "https://www.ica.se/recept/risotto-med-tonfisk-567202/",
    "https://www.ica.se/recept/het-ananas-och-mangosalsa-717649/",
    "https://www.ica.se/recept/virgin-mojito-685951/",
    "https://www.ica.se/recept/havregrynsgrot-med-blabarsmjolk-722996/",
    "https://www.ica.se/recept/spaghetti-med-balsamicostekta-gronsaker-och-mozzarella-722465/",
    "https://www.ica.se/recept/mangosalsa-med-koriander-och-chili-721370/",
    "https://www.ica.se/recept/veganska-revbensspjall-av-tofu-721242/",
    "https://www.ica.se/recept/raw-lingonbollar-721137/",
    "https://www.ica.se/recept/chiafrostekt-spatta-med-avokado-och-lime-720793/",
    "https://www.ica.se/recept/harissakyckling-med-spenat-och-quinoasallad-720797/",
    "https://www.ica.se/recept/pasta-med-paprikasas-och-bresaola-719948/",
    "https://www.ica.se/recept/black-bean-chocolate-chili-cookies-717880/",
    "https://www.ica.se/recept/tagliatelle-med-champinjoner-vitlok-arter-och-parmesan-713256/",
    "https://www.ica.se/recept/pasta-med-svamp-och-lokrora-368262/",
    "https://www.ica.se/recept/italiensk-linssallad-29/",
    "https://www.ica.se/recept/grillade-marinerade-gronsaker-med-kapris-och-olivolja-714980/",
    "https://www.ica.se/recept/ljummen-bulgursallad-352394/",
    "https://www.ica.se/recept/fruktsallad-med-kanelcottage-cheese-714015/",
    "https://www.ica.se/recept/morotsbollar-med-kardemumma-717283/",
    "https://www.ica.se/recept/hembakat-pitabrod-665340/",
    "https://www.ica.se/recept/fikonbollar-277038/",
    "https://www.ica.se/recept/shot-med-farsk-gurkmeja-721640/",
    "https://www.ica.se/recept/chokladkaka-med-bonor-723021/",
    "https://www.ica.se/recept/broccolipizza-med-kronartskocka-feta-och-mynta-722779/",
    "https://www.ica.se/recept/mozzarellagratinerad-aubergine-med-ajvaryoghurt-722901/",
    "https://www.ica.se/recept/masalaklubbor-med-blomkalsris-722472/",
    "https://www.ica.se/recept/baked-oat-721134/",
    "https://www.ica.se/recept/sojabakad-sesamlax-med-zucchinispaghetti-722462/",
    "https://www.ica.se/recept/chilirostade-kikartor-med-avokado-722127/",
    "https://www.ica.se/recept/gronkalspytt-med-morotsbiffar-och-rostade-cashewnotter-721762/",
    "https://www.ica.se/recept/fankalsrisotto-med-ostronskivling-721692/",
    "https://www.ica.se/recept/banan-och-chokladsmoothie-721486/",
    "https://www.ica.se/recept/vitvinsglogg-utan-vanligt-socker-721238/",
    "https://www.ica.se/recept/silky-vegan-chocolate-mousse-pie-720214/",
    "https://www.ica.se/recept/raw-aprikosbollar-719622/",
    "https://www.ica.se/recept/bar-med-torkade-svarta-vinbar-och-fron-718519/",
    "https://www.ica.se/recept/tomat-och-timjanrisoni-med-kyckling-och-parmesan-718173/",
    "https://www.ica.se/recept/ugnsstekt-kyckling-och-rotmos-med-brynt-smor-718072/",
    "https://www.ica.se/recept/senapskyckling-med-ris-676866/",
    "https://www.ica.se/recept/kramig-pasta-med-kyckling-och-gront-697705/",
    "https://www.ica.se/recept/ugnsbakad-lax-med-limecreme-fraiche-688127/",
    "https://www.ica.se/recept/kycklinggryta-med-valnotter-och-oliver-717625/",
    "https://www.ica.se/recept/mangosalsa-med-chili-och-graslok-716569/",
    "https://www.ica.se/recept/valnotsbaguetter-a-la-bruks-716064/",
    "https://www.ica.se/recept/pasta-carbonara-med-kalkonbacon-716909/",
    "https://www.ica.se/recept/broccoliris-med-sesamkyckling-716750/",
    "https://www.ica.se/recept/kycklinggryta-med-kokosmjolk-716497/",
    "https://www.ica.se/recept/halloumi-och-granatapple-med-myntayoghurt-723051/",
    "https://www.ica.se/recept/rostade-betor-och-persiljerotter-med-salsa-verde-722925/",
    "https://www.ica.se/recept/aggmuffins-med-lax-och-spenat-721657/",
    "https://www.ica.se/recept/vegansk-currysill-av-aubergine-721248/",
    "https://www.ica.se/recept/mangocolada-720805/",
    "https://www.ica.se/recept/kimchi-720959/",
    "https://www.ica.se/recept/raw-appelpaj-med-mandel-och-kardemumma-720613/",
    "https://www.ica.se/recept/glasspinnar-pa-kokosvatten-720489/",
    "https://www.ica.se/recept/fryst-layer-smoothie-720311/",
    "https://www.ica.se/recept/ugnsbakad-avokado-med-agg-rokt-lax-och-graslok-719896/",
    "https://www.ica.se/recept/majsplattar-med-tomat-och-avokadosallad-719955/",
    "https://www.ica.se/recept/pasta-rosso-med-kyckling-och-zucchini-719305/",
    "https://www.ica.se/recept/rostad-blomkal-garam-masala-716951/",
    "https://www.ica.se/recept/seggoda-fruktremmar-717863/",
    "https://www.ica.se/recept/yoghurt-med-rarivet-paron-och-ingefarshonung-715823/",
    "https://www.ica.se/recept/vegetarisk-spaghetti-bolognese-716674/",
    "https://www.ica.se/recept/spagetti-bolognese-med-mozzarellasallad-715638/",
    "https://www.ica.se/recept/kycklinggryta-med-paprika-och-oliver-717515/",
    "https://www.ica.se/recept/halstrad-tonfisk-med-bonor-citron-och-persilja-716932/",
    "https://www.ica.se/recept/frittata-och-tomatsoppa-med-mozzarella-och-ortolja-714660/",
    "https://www.ica.se/recept/gronsaker-med-dipp-618681/",
    "https://www.ica.se/recept/stekt-spatta-med-krafttzatziki-716910/",
    "https://www.ica.se/recept/kramig-risoni-med-spenat-mynta-och-arter-722470/",
    "https://www.ica.se/recept/falafelbowl-med-korianderyoghurt-722459/",
    "https://www.ica.se/recept/ljummen-portabello-och-linssallad-med-citronsas-722355/",
    "https://www.ica.se/recept/artrisotto-med-blomkalssallad-722267/",
    "https://www.ica.se/recept/veganska-snittar-salladsblad-med-avokadosalsa-721866/",
    "https://www.ica.se/recept/quinoa-och-froknacke-721546/",
    "https://www.ica.se/recept/blomkalsstek-till-tacos-720769/",
    "https://www.ica.se/recept/chokladdoppade-clementiner-721235/",
    "https://www.ica.se/recept/gratinerad-romansallad-med-kycklinglarfile-och-ortstekt-vitkalsris-720784/",
    "https://www.ica.se/recept/papardelle-med-gronkalspesto-720790/",
    "https://www.ica.se/recept/bananglass-720604/",
    "https://www.ica.se/recept/tom-kha-phak-soppa-719809/",
    "https://www.ica.se/recept/zucchiniplattar-med-syrad-lok-719715/",
    "https://www.ica.se/recept/stekt-ananas-med-mynta-och-kokos-718050/",
    "https://www.ica.se/recept/sweet-chilistekt-lax-med-sojanudlar-718209/",
    "https://www.ica.se/recept/pasta-carbonara-med-torrsaltat-bacon-718142/",
    "https://www.ica.se/recept/mellisplattar-med-banan-och-cottage-cheese-717864/",
    "https://www.ica.se/recept/chicken-curry-713371/",
    "https://www.ica.se/recept/rotfruktspytt-med-kyckling-388781/",
    "https://www.ica.se/recept/kryddstekt-kycklingfile-och-gronsaker-318256/",
    "https://www.ica.se/recept/honungstekt-kyckling-med-salsa-verde-717726/",
    "https://www.ica.se/recept/torskfile-med-aubergine-och-rostad-potatis-717234/",
    "https://www.ica.se/recept/ra-chokladmousse-713466/",
    "https://www.ica.se/recept/citronbakad-lax-med-paprikapesto-716977/",
    "https://www.ica.se/recept/ugnsgrillad-kyckling-med-broccoliris-716962/",
    "https://www.ica.se/recept/ugnsrostad-morotshummus-723222/",
    "https://www.ica.se/recept/julig-fruktsallad-723093/",
    "https://www.ica.se/recept/picklad-rodkal-723083/",
    "https://www.ica.se/recept/gron-artsmoothie-722757/",
    "https://www.ica.se/recept/ratatouille-med-farsk-basilika-722461/",
    "https://www.ica.se/recept/avokadoglass-722616/",
    "https://www.ica.se/recept/framtidstacos-722591/",
    "https://www.ica.se/recept/pasta-med-svartkalschips-morotter-rostade-notter-med-pestodip-722571/",
    "https://www.ica.se/recept/overnight-oats-med-espresso-722183/",
    "https://www.ica.se/recept/rotfruktspytt-med-kyckling-388781/",
    "https://www.ica.se/recept/kryddstekt-kycklingfile-och-gronsaker-318256/",
    "https://www.ica.se/recept/honungstekt-kyckling-med-salsa-verde-717726/",
    "https://www.ica.se/recept/torskfile-med-aubergine-och-rostad-potatis-717234/",
    "https://www.ica.se/recept/ra-chokladmousse-713466/",
    "https://www.ica.se/recept/citronbakad-lax-med-paprikapesto-716977/",
    "https://www.ica.se/recept/ugnsgrillad-kyckling-med-broccoliris-716962/",
    "https://www.ica.se/recept/ugnsrostad-morotshummus-723222/",
    "https://www.ica.se/recept/julig-fruktsallad-723093/",
    "https://www.ica.se/recept/picklad-rodkal-723083/",
    "https://www.ica.se/recept/gron-artsmoothie-722757/",
    "https://www.ica.se/recept/ratatouille-med-farsk-basilika-722461/",
    "https://www.ica.se/recept/avokadoglass-722616/",
    "https://www.ica.se/recept/framtidstacos-722591/",
    "https://www.ica.se/recept/pasta-med-svartkalschips-morotter-rostade-notter-med-pestodip-722571/",
    "https://www.ica.se/recept/overnight-oats-med-espresso-722183/",
    "https://www.ica.se/recept/halloumiburgare-med-vit-bontzatziki-721635/",
    "https://www.ica.se/recept/sura-godisar-av-fruktjuice-721858/",
    "https://www.ica.se/recept/het-tomatpasta-med-oregano-och-mozzarella-721932/",
    "https://www.ica.se/recept/teffgrot-721543/",
    "https://www.ica.se/recept/spenatsmoothie-med-avokado-papaya-och-sesam-720766/",
    "https://www.ica.se/recept/gron-nudelssoppa-721494/",
    "https://www.ica.se/recept/italiensk-pastagratang-721496/",
    "https://www.ica.se/recept/proteinsmoothie-pro-protein-721507/",
    "https://www.ica.se/recept/groddat-frobrod-721124/",
    "https://www.ica.se/recept/sesambuljong-med-nudlar-sojabonor-groddar-svamp-och-agg-720731/",
    "https://www.ica.se/recept/green-garden-pasta-720887/",
    "https://www.ica.se/recept/tropical-smoothie-720607/",
    "https://www.ica.se/recept/rodbetsris-med-gremolata-fetaost-och-gronsaksbullar-720718/",
    "https://www.ica.se/recept/mango-colada-720594/",
    "https://www.ica.se/recept/kraming-fankalssallad-med-dill-och-kummin-720070/",
    "https://www.ica.se/recept/surkal-med-apple-och-salladslok-720084/",
    "https://www.ica.se/recept/halloumiburgare-med-vit-bontzatziki-721635/",
    "https://www.ica.se/recept/sura-godisar-av-fruktjuice-721858/",
    "https://www.ica.se/recept/het-tomatpasta-med-oregano-och-mozzarella-721932/",
    "https://www.ica.se/recept/teffgrot-721543/",
    "https://www.ica.se/recept/spenatsmoothie-med-avokado-papaya-och-sesam-720766/",
    "https://www.ica.se/recept/gron-nudelssoppa-721494/",
    "https://www.ica.se/recept/italiensk-pastagratang-721496/",
    "https://www.ica.se/recept/proteinsmoothie-pro-protein-721507/",
    "https://www.ica.se/recept/groddat-frobrod-721124/",
    "https://www.ica.se/recept/sesambuljong-med-nudlar-sojabonor-groddar-svamp-och-agg-720731/",
    "https://www.ica.se/recept/green-garden-pasta-720887/",
    "https://www.ica.se/recept/tropical-smoothie-720607/",
    "https://www.ica.se/recept/rodbetsris-med-gremolata-fetaost-och-gronsaksbullar-720718/",
    "https://www.ica.se/recept/mango-colada-720594/",
    "https://www.ica.se/recept/kraming-fankalssallad-med-dill-och-kummin-720070/",
    "https://www.ica.se/recept/surkal-med-apple-och-salladslok-720084/",
    "https://www.ica.se/recept/halloumiburgare-med-vit-bontzatziki-721635/",
    "https://www.ica.se/recept/sura-godisar-av-fruktjuice-721858/",
    "https://www.ica.se/recept/het-tomatpasta-med-oregano-och-mozzarella-721932/",
    "https://www.ica.se/recept/teffgrot-721543/",
    "https://www.ica.se/recept/spenatsmoothie-med-avokado-papaya-och-sesam-720766/",
    "https://www.ica.se/recept/gron-nudelssoppa-721494/",
    "https://www.ica.se/recept/italiensk-pastagratang-721496/",
    "https://www.ica.se/recept/proteinsmoothie-pro-protein-721507/",
    "https://www.ica.se/recept/groddat-frobrod-721124/",
    "https://www.ica.se/recept/sesambuljong-med-nudlar-sojabonor-groddar-svamp-och-agg-720731/",
    "https://www.ica.se/recept/green-garden-pasta-720887/",
    "https://www.ica.se/recept/tropical-smoothie-720607/",
    "https://www.ica.se/recept/rodbetsris-med-gremolata-fetaost-och-gronsaksbullar-720718/",
    "https://www.ica.se/recept/mango-colada-720594/",
    "https://www.ica.se/recept/kraming-fankalssallad-med-dill-och-kummin-720070/",
    "https://www.ica.se/recept/surkal-med-apple-och-salladslok-720084/",
    "https://www.ica.se/recept/ugnsstekt-torsk-med-aggsas-720143/",
    "https://www.ica.se/recept/saffranscouscous-med-kraftor-och-tomat-719794/",
    "https://www.ica.se/recept/kycklingfile-med-sotpotatis-och-kryddyoghurt-719547/",
    "https://www.ica.se/recept/majs-och-kycklinggryta-718589/",
    "https://www.ica.se/recept/varrullar-med-sotsur-dipp-715625/",
    "https://www.ica.se/recept/pasta-med-gronmusslor-tomat-och-basilika-715360/",
    "https://www.ica.se/recept/kycklingbiffar-med-graddsas-och-snabbinlagd-gurka-715567/",
    "https://www.ica.se/recept/asiatisk-fisk-i-folie-712597/",
    "https://www.ica.se/recept/kyckling-med-kokos-och-persikor-426143/",
    "https://www.ica.se/recept/couscoussallad-med-chilikyckling-715130/",
    "https://www.ica.se/recept/mustig-tomatsoppa-med-mozzarella-och-basilika-713943/",
    "https://www.ica.se/recept/stekt-ris-med-agg-tonfisk-och-sweet-chili-713426/",
    "https://www.ica.se/recept/pastasas-med-paprika-och-ricotta-716584/",
    "https://www.ica.se/recept/couscous-och-ostfyllda-paprikor-343147/",
    "https://www.ica.se/recept/grillat-kycklingbrost-med-fankal-tomat-och-rosmarin-716235/",
    "https://www.ica.se/recept/pomeransbrod-687942/"
  ];
let filename = "ica/ICA-nyttig_antalroster-2018-02-22.json";

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
                            tags[t.charAt(0).toUpperCase() + t.slice(1).replace(/\s*\([^()]*\)$/, '').split(",")[0].replace(/([/.#$])/g, '').trim()] = true;

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

                                ingredient.name = namepart.charAt(0).toUpperCase() + namepart.slice(1).replace(/\s*\([^()]*\)$/, '').split(",")[0].replace(/([/.#$])/g, '').trim();
                                if (ingredientNames.indexOf(ingredient.name) > -1) {
                                    continue;
                                }

                                if(ingredient.amount.trim()==""){
                                    delete ingredient.amount;
                                }
                                if(ingredient.unit.trim()==""){
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
                        //kan detta brytas ut till valideringsfunktion?
                        if (!recipe.ingredients || recipe.ingredients.length === 0 || (recipe.time && recipe.time < 1)) {
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