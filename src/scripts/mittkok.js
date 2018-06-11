var Nightmare = require('nightmare');
var nightmare = Nightmare({
    openDevTools: false, show: false, webPreferences: {
        images: false,
    }
})

var fs = require('fs');


//ta fram urls genom att:
//1. var hrefs=[]; var interv=setInterval(function(){if(document.querySelector('#search-button-more')){document.querySelector('#search-button-more').click();}else{hrefs=Array.from(document.querySelectorAll('.search .tile-item--recipe a')).map(a => a.href);console.log("done");clearInterval(interv);}},1500);
//1. var hrefs=[]; var interv=setInterval(function(){if(document.querySelector('.button--get-more')){document.querySelector('.button--get-more').click();}else{hrefs=Array.from(document.querySelectorAll('.tile-item--recipe a.tile-item__link ')).map(a => a.href);console.log("done");clearInterval(interv);}},1500);

//copy(Array.from(document.querySelectorAll('.tile-item--recipe a.tile-item__link ')).map(a => a.href))
let urls = ["https://mittkok.expressen.se/recept/lax-skaldjursfrikasse-med-jordartskocksas/",
"https://mittkok.expressen.se/recept/hostflarn-med-apple-och-rodlok/",
"https://mittkok.expressen.se/recept/rotfruktsgryta-med-dadlar/",
"https://mittkok.expressen.se/recept/club-sandwich-med-flaskfile-2/",
"https://mittkok.expressen.se/recept/het-rotfruktsgryta-med-bonor-och-fetaostkram/",
"https://mittkok.expressen.se/recept/spagetti-med-sparris/",
"https://mittkok.expressen.se/recept/filodegscigarrer-med-mangold-och-halloumi/",
"https://mittkok.expressen.se/recept/fankalsinkokt-lax/",
"https://mittkok.expressen.se/recept/algytterfile-med-calvadossas-applen-och-svartrotter/",
"https://mittkok.expressen.se/recept/fruktig-indisk-lammcurry/",
"https://mittkok.expressen.se/recept/rotfruktsgratang-2/",
"https://mittkok.expressen.se/recept/kraftstromming-2/",
"https://mittkok.expressen.se/recept/tagliatelle-med-chiliolja-musslor/",
"https://mittkok.expressen.se/recept/pulled-pork/",
"https://mittkok.expressen.se/recept/lasagne-a-la-bolognese/",
"https://mittkok.expressen.se/recept/ankbrost-med-katrinplommonsas/",
"https://mittkok.expressen.se/recept/viveca-larns-fisksoppa/",
"https://mittkok.expressen.se/recept/dillkott-med-kokt-potatis/",
"https://mittkok.expressen.se/recept/farsgulasch/",
"https://mittkok.expressen.se/recept/apelsinbulgur-med-halloumi/",
"https://mittkok.expressen.se/recept/kottbullar-med-dill-och-pinjenotter/",
"https://mittkok.expressen.se/recept/tortiglionigratang-med-kassler-3/",
"https://mittkok.expressen.se/recept/stekt-torsk-med-musslor-och-citronsyrad-fankal/",
"https://mittkok.expressen.se/recept/svartrotsgratang-med-kapris-och-rimmat-flask/",
"https://mittkok.expressen.se/recept/rotfruktsomelett-med-brie-gronkalssallad/",
"https://mittkok.expressen.se/recept/kycklinggryta-med-oliver-salami/",
"https://mittkok.expressen.se/recept/slottsstek-med-angade-gronsaker-pressgurka-och-gele/",
"https://mittkok.expressen.se/recept/lammfarsfylld-snackpaprika/",
"https://mittkok.expressen.se/recept/dinkelpizza-med-kantareller/",
"https://mittkok.expressen.se/recept/kokosdal-med-linser-gronsaker/",
"https://mittkok.expressen.se/recept/brasserad-oxfile-i-trepepparsas/",
"https://mittkok.expressen.se/recept/svamp-zucchinipaj/",
"https://mittkok.expressen.se/recept/kalvstek-med-tomatvinagrett-syltlok-och-oliver/",
"https://mittkok.expressen.se/recept/vasterbottenspaj-med-purjo-och-bacon/",
"https://mittkok.expressen.se/recept/cassoulet-som-i-marocko/",
"https://mittkok.expressen.se/recept/bakad-sejrygg-med-brasserade-morotter/",
"https://mittkok.expressen.se/recept/turkiskaubergine/",
"https://mittkok.expressen.se/recept/kycklingsallad-med-kramigt-tacke/",
"https://mittkok.expressen.se/recept/lammburgare-med-gronsaker-getostrora/",
"https://mittkok.expressen.se/recept/sma-rakpajer-med-avokado-och-paprikasalsa/",
"https://mittkok.expressen.se/recept/viltburgare-med-grillat-paron-och-adelost/",
"https://mittkok.expressen.se/recept/cheesecake-med-lax-pepparrot/",
"https://mittkok.expressen.se/recept/helstekt-kyckling-med-mustig-pastaragu/",
"https://mittkok.expressen.se/recept/kraftor-indienne/",
"https://mittkok.expressen.se/recept/kebabpizza/",
"https://mittkok.expressen.se/recept/lax-raksoppa-med-orientaliska-smaker/",
"https://mittkok.expressen.se/recept/gratinerade-musslor/",
"https://mittkok.expressen.se/recept/tortiglionigratang-med-kassler-2/",
"https://mittkok.expressen.se/recept/dillkott/",
"https://mittkok.expressen.se/recept/halleflundra-bouillabaisse/",
"https://mittkok.expressen.se/recept/rotfruktsgratang/",
"https://mittkok.expressen.se/recept/kycklingburgare-med-parmesanost-kaprissas-basilika/",
"https://mittkok.expressen.se/recept/grillad-karre-med-rubbing-och-grillade-persikor/",
"https://mittkok.expressen.se/recept/kycklingfrikasse-med-dragon-och-lok/",
"https://mittkok.expressen.se/recept/stekt-flask-med-vitkal-appelsallad/",
"https://mittkok.expressen.se/recept/roding-i-panna-med-orter-gradde-och-vitt-vin/",
"https://mittkok.expressen.se/recept/stekt-entrecote-med-hyvlad-fankal-och-vitlokssky/",
"https://mittkok.expressen.se/recept/lammfarsspett-med-farsk-vitkal-lok-och-chili/",
"https://mittkok.expressen.se/recept/grillade-laxknyten-med-potatis-och-citronsmor/",
"https://mittkok.expressen.se/recept/lammbog-med-vita-bonor-och-purjolok/",
"https://mittkok.expressen.se/recept/kycklingspett-i-pitabrod-med-myntatzatziki/",
"https://mittkok.expressen.se/recept/zucchinigratang-2/",
"https://mittkok.expressen.se/recept/makarongratang-pa-isterband-och-lok-2/",
"https://mittkok.expressen.se/recept/pasta-med-chorizo-paprika-tomatsas/",
"https://mittkok.expressen.se/recept/asiatisk-kycklinggryta/",
"https://mittkok.expressen.se/recept/tortiglionigratang-med-kassler/",
"https://mittkok.expressen.se/recept/angad-lax-med-sotsur-dillsas-morot/",
"https://mittkok.expressen.se/recept/fiskgratang-med-rakor-2/",
"https://mittkok.expressen.se/recept/falukorv-med-broccoli-och-korsbarstomater/",
"https://mittkok.expressen.se/recept/aigo-buido/",
"https://mittkok.expressen.se/recept/oxfilemedaljonger-med-hackade-orter-rostade-pinjenotter/",
"https://mittkok.expressen.se/recept/paella-med-musslor-kyckling-och-chorizo/",
"https://mittkok.expressen.se/recept/pastagratang-med-%c2%adkyckling-salvia/",
"https://mittkok.expressen.se/recept/skinkschnitzel-med-bonor-salvia-citronsmor/",
"https://mittkok.expressen.se/recept/fricassee-de-poulet-a-lancienne-gammaldags-kycklingfrikasse-med-graddsas-lok-och-champinjoner/",
"https://mittkok.expressen.se/recept/dinkeltagliatelle-med-chiliolja-musslor/",
"https://mittkok.expressen.se/recept/tacopaj-med-guacamole/",
"https://mittkok.expressen.se/recept/ugnsbakad-lax-med-limewokade-gronsaker/",
"https://mittkok.expressen.se/recept/pasta-med-flaskfile/",
"https://mittkok.expressen.se/recept/lammfarsbiff-med-fetaost/",
"https://mittkok.expressen.se/recept/laxlasagne-med-citron-och-spenat/",
"https://mittkok.expressen.se/recept/rimmat-sidflask-med-fankalsfron/",
"https://mittkok.expressen.se/recept/ugnsbakad-sotpotatis-med-chili-feta/",
"https://mittkok.expressen.se/recept/hogrevskarna-med-orter-pistagenotter-glacerade-frukter/",
"https://mittkok.expressen.se/recept/biff-rydberg/",
"https://mittkok.expressen.se/recept/emmerrisotto-med-farsk-getost-skogssvamp/",
"https://mittkok.expressen.se/recept/mustig-lammgryta-med-stekt-polenta/",
"https://mittkok.expressen.se/recept/kyckling-i-kokoscurry/",
"https://mittkok.expressen.se/recept/lammlagg-med-curry-pumpa-och-honung/",
"https://mittkok.expressen.se/recept/lammstek-med-getostrosti-och-balsamicosas/",
"https://mittkok.expressen.se/recept/gyros-av-kotlett-i-pitabrod-med-tzatsiki/",
"https://mittkok.expressen.se/recept/kycklinggryta-med-kokos-och-couscous/",
"https://mittkok.expressen.se/recept/chevrefyllda-lammfarsbiffar/",
"https://mittkok.expressen.se/recept/njurtapp-med-brynt-smor-pepparrot-och-kapris/",
"https://mittkok.expressen.se/recept/stekt-flaskkarre-med-honungsstekt-palsternacka/",
"https://mittkok.expressen.se/recept/kycklingfile-med-rod-linsgryta/",
"https://mittkok.expressen.se/recept/flankstek-med-rastekta-kronartskockor/",
"https://mittkok.expressen.se/recept/bengalisk-morotssoppa/",
"https://mittkok.expressen.se/recept/soupe-a-loignon-loksoppa/",
"https://mittkok.expressen.se/recept/flaskfilegratang-med-mango/",
"https://mittkok.expressen.se/recept/kotlettwok-med-bonor-pak-choi/",
"https://mittkok.expressen.se/recept/champinjonsoppa-med-handskalade-rakor/",
"https://mittkok.expressen.se/recept/gulaschpanna-med-citron-och-kumminkram/",
"https://mittkok.expressen.se/recept/jambon-braise-au-madere/",
"https://mittkok.expressen.se/recept/hemlagad-tagliatelle-och-pesto/",
"https://mittkok.expressen.se/recept/henry-bronetts-crepes-med-korsbarskompott/",
"https://mittkok.expressen.se/recept/grillrokt-lax-med-potatis-och-fankalssallad/",
"https://mittkok.expressen.se/recept/suovasrokt-renryggfile-med-lingonsyltssas-och-rotsaker-i-ugn/",
"https://mittkok.expressen.se/recept/kantarellsoppa/",
"https://mittkok.expressen.se/recept/gazpacho-3/",
"https://mittkok.expressen.se/recept/gratinerad-hummer/",
"https://mittkok.expressen.se/recept/kycklinglarfileer-med-rabarber/",
"https://mittkok.expressen.se/recept/pastasallad-med-flaskfile/",
"https://mittkok.expressen.se/recept/hallstekt-biff-med-nordisk-hetta-rokt-margsmor/",
"https://mittkok.expressen.se/recept/pizza-italiana/",
"https://mittkok.expressen.se/recept/rotfruktspanna-med-trattisar/",
"https://mittkok.expressen.se/recept/gotlandska-lammracks-med-rostade-gronsaker/",
"https://mittkok.expressen.se/recept/helgrillad-ryggbiff/",
"https://mittkok.expressen.se/recept/kall-skivad-kalvstek-med-syrlig-glaze/",
"https://mittkok.expressen.se/recept/hjortfile-med-vasterbottenspure-graddsas-med-messmor-ronnbarsgele-och-vinkokta-svartrotter/",
"https://mittkok.expressen.se/recept/smorstekt-lax-med-dillhollandaise/",
"https://mittkok.expressen.se/recept/grillad-kalvkotlett-med-syrlig-dillsas/",
"https://mittkok.expressen.se/recept/fylld-lammbringa-med-syltad-pumpa-rodvinssas-och-rotfruktspytt/",
"https://mittkok.expressen.se/recept/spenatpaj-med-laxrosor/",
"https://mittkok.expressen.se/recept/pumpapaj/",
"https://mittkok.expressen.se/recept/pumparisotto/",
"https://mittkok.expressen.se/recept/ciderskinka/",
"https://mittkok.expressen.se/recept/kraftrisotto/",
"https://mittkok.expressen.se/recept/festfin-spattagratang/",
"https://mittkok.expressen.se/recept/julskinka-2/",
"https://mittkok.expressen.se/recept/zucchini-och-fetagratang/",
"https://mittkok.expressen.se/recept/vinkokt-kyckling-med-rotfrukter/",
"https://mittkok.expressen.se/recept/torsk-med-pocherat-agg-och-raksas-med-pressad-potatis/",
"https://mittkok.expressen.se/recept/sambalkotletter/",
"https://mittkok.expressen.se/recept/rotsaksgratang/",
"https://mittkok.expressen.se/recept/vinterglaserade-revbensspjall/",
"https://mittkok.expressen.se/recept/flask-med-loksas-och-rastekt-potatis/",
"https://mittkok.expressen.se/recept/drakamollans-flasksida-och-rotsaksstomp-med-julsmaker-appelchutney/",
"https://mittkok.expressen.se/recept/korvlada/",
"https://mittkok.expressen.se/recept/pannbiffar-med-svampsas-och-rastekt-blomkal/",
"https://mittkok.expressen.se/recept/biff-stroganoff/",
"https://mittkok.expressen.se/recept/hemgjorda-fiskpinnar-med-stuvad-bladspenat/",
"https://mittkok.expressen.se/recept/chorizopanna/",
"https://mittkok.expressen.se/recept/kryddstekt-kycklingbrost-med-svamp-morot-och-mosad-potatis/",
"https://mittkok.expressen.se/recept/citronglaserad-flaskkarre-med-varma-bonor/",
"https://mittkok.expressen.se/recept/cannelloni-med-ricotta-och-spenat-2/",
"https://mittkok.expressen.se/recept/varmrokt-lax-med-risotto-pa-dinkel-spritartor-och-dill/",
"https://mittkok.expressen.se/recept/gnocchi-med-gronkalspesto-med-soltorkade-tomater/",
"https://mittkok.expressen.se/recept/pasta-med-ansjovis-broccoli-och-tomat/",
"https://mittkok.expressen.se/recept/lasagne-med-kal-och-viltfars/",
"https://mittkok.expressen.se/recept/vilthamburgare-med-lingonketchup-blomkalsaioli-och-saltgurka/",
"https://mittkok.expressen.se/recept/chilikyckling-med-ingefara-cashewnotter-och-limeyoghurt/",
"https://mittkok.expressen.se/recept/rodingfile-med-brandade-potatismosoch-kaprissmor/",
"https://mittkok.expressen.se/recept/filips-skomakarlada/",
"https://mittkok.expressen.se/recept/brodfriterad-kolja-med-remouladsas-och-kokt-broccoli/",
"https://mittkok.expressen.se/recept/osso-buco-pa-kalvkinder-och-gronsaker/",
"https://mittkok.expressen.se/recept/frasstekt-gos-med-ansjovissmor-kantarellpotatis-och-friterad-persilja/",
"https://mittkok.expressen.se/recept/torsk-med-gron-chili-vitvinssas/",
"https://mittkok.expressen.se/recept/linsbiffar-med-graddstuvad-kal-och-spenat/",
"https://mittkok.expressen.se/recept/hickorystekt-tonfiskfile-med-grillad-aubergine-och-het-bonragu/",
"https://mittkok.expressen.se/recept/hostig-sjomansbiff/",
"https://mittkok.expressen.se/recept/italiensk-kyckling-och-mozzarellagryta-2/",
"https://mittkok.expressen.se/recept/potatiskaka-med-jordartskocka-och-palsternacka-med-pepparfile/",
"https://mittkok.expressen.se/recept/confiterad-flasksida-med-olkokt-surkal-senap-och-mandelpotatis/",
"https://mittkok.expressen.se/recept/lammrygg-med-polenta-bonragu-och-rodvinsas/",
"https://mittkok.expressen.se/recept/flaskkorv-med-buljong-och-kryddkokta-gronsaker/",
"https://mittkok.expressen.se/recept/panerad-senaps-stromming-med-smorkokt-potatis/",
"https://mittkok.expressen.se/recept/jan-boris-mollers-kycklingrullader-med-gul-paprikasas/",
"https://mittkok.expressen.se/recept/ortmarinerad-flaskfile-recept/",
"https://mittkok.expressen.se/recept/vitlokstekta-lammkotletter-med-getostkram/",
"https://mittkok.expressen.se/recept/fruktspackad-file-med-couscous-yoghurtsas/",
"https://mittkok.expressen.se/recept/gremolatafile-med-rostade-gronsaker/",
"https://mittkok.expressen.se/recept/kentucky-fried-chicken/",
"https://mittkok.expressen.se/recept/kramig-filepasta-med-rokt-sidflask-och-orter/",
"https://mittkok.expressen.se/recept/texas-tortilla/",
"https://mittkok.expressen.se/recept/kycklingcurry-med-papadums/",
"https://mittkok.expressen.se/recept/kycklingbullar-med-persiljesallad-och-yoghurtsas/",
"https://mittkok.expressen.se/recept/spagetti-med-zucchini-och-oliver/",
"https://mittkok.expressen.se/recept/jordartskocksoppa-med-agg-och-spenat/",
"https://mittkok.expressen.se/recept/pannbiff-med-inlagd-gurka/",
"https://mittkok.expressen.se/recept/roding-med-syrad-rodlok-och-stuvad-spenat-med-bakad-fankal/",
"https://mittkok.expressen.se/recept/citronkryddade-kycklinglar-med-bulgursallad-och-yoghurtsallad/",
"https://mittkok.expressen.se/recept/fiskpinnar-med-frisk-potatissallad-pa-pepparrot/",
"https://mittkok.expressen.se/recept/fiskpinnar-med-potatis%c2%admos-remouladsas/",
"https://mittkok.expressen.se/recept/lammstek-med-citronslungade-betor/",
"https://mittkok.expressen.se/recept/renfile-med-havtornssas/",
"https://mittkok.expressen.se/recept/tacoburrito-med-majssalsa-och-graddfilssallad/",
"https://mittkok.expressen.se/recept/klassisk-cheeseburgare-2/",
"https://mittkok.expressen.se/recept/vedrokt-bjorncarpaccio-med-pocherade-vaktelagg-och-kalixlojrom/",
"https://mittkok.expressen.se/recept/makarongratang-pa-isterband-och-lok-3/",
"https://mittkok.expressen.se/recept/lammkotletter-med-friterad-salvia-och-citronsmor/",
"https://mittkok.expressen.se/recept/lax-med-surkal-sesam-och-vallmofron/",
"https://mittkok.expressen.se/recept/kycklingsoppa/",
"https://mittkok.expressen.se/recept/biff-stroganoff-med-raris/",
"https://mittkok.expressen.se/recept/surkalspaj/",
"https://mittkok.expressen.se/recept/notfarsbiffar-med-tsatsiki-romansallad/",
"https://mittkok.expressen.se/recept/pasta-med-ortfrasta-jordartskockor-och-rucola/",
"https://mittkok.expressen.se/recept/makrill-med-sallskap-i-ugnen/",
"https://mittkok.expressen.se/recept/lax-med-rod-curry-gronsaker/",
"https://mittkok.expressen.se/recept/kyckling-cordon-bleu-med-mos-och-artsallad/",
"https://mittkok.expressen.se/recept/hostsoppa-pa-palsternacka-toppad-med-polkabeta/",
"https://mittkok.expressen.se/recept/souvlaki-pa-fisk/",
"https://mittkok.expressen.se/recept/laxsallad-med-avokado-och-kryddkokt-bulgur-och-gurkdressing/",
"https://mittkok.expressen.se/recept/kycklinglada/",
"https://mittkok.expressen.se/recept/grillad-sejfile-med-rucola-och-basilikasalsa/",
"https://mittkok.expressen.se/recept/ravioli-med-pumpa-och-salvia/",
"https://mittkok.expressen.se/recept/rotfruktssoppa/",
"https://mittkok.expressen.se/recept/enbaskryddad-hjortfile-med-lingonketchup-blomkalsaoli-och-potatiskroketter/",
"https://mittkok.expressen.se/recept/kramig-risotto-med-svamp/",
"https://mittkok.expressen.se/recept/roding-med-hollandaisesas-och-rotsellerikram/",
"https://mittkok.expressen.se/recept/musslor-i-fankal-och-citron/",
"https://mittkok.expressen.se/recept/kottfarspiroger-med-spenat-och-aioli/",
"https://mittkok.expressen.se/recept/pastadeg-grundrecept/",
"https://mittkok.expressen.se/recept/tagliatelle-med-svamp-bacon-och-hasselnotter/",
"https://mittkok.expressen.se/recept/ugnsbakad-potatis%c2%adomelett-med-kryddstark-tomatsas-och-sidflask/",
"https://mittkok.expressen.se/recept/tortelloni-med-salsiccia-och-vasterbottensost-i-tomatsas/",
"https://mittkok.expressen.se/recept/gnocchi-grundrecept/",
"https://mittkok.expressen.se/recept/kycklingpasta-med-rostade-pinjenotter-och-parmesan/",
"https://mittkok.expressen.se/recept/smorstekt-gos-med-potatispure-brynt-smor-citron-kapris-och-dill/",
"https://mittkok.expressen.se/recept/pasta-med-kronartskockspesto/",
"https://mittkok.expressen.se/recept/brackt-oxbringa-med-rotmos-pa-palsternacka-och-stekt-apple/",
"https://mittkok.expressen.se/recept/algstek-med-picklade-gronsaker-och-viltsas/",
"https://mittkok.expressen.se/recept/kronartskockor-med-rod-currysas/",
"https://mittkok.expressen.se/recept/potatisfritatta-med-prosciutto/",
"https://mittkok.expressen.se/recept/pasta-med-skinksas-och-broccoli/",
"https://mittkok.expressen.se/recept/tortelloni-med-ricottaost-och-pesto/",
"https://mittkok.expressen.se/recept/laxpytt-med-rabarber-och-sotsyrlig-senapscreme/",
"https://mittkok.expressen.se/recept/ugnsbakade-isterband-med-senapstuvad-potatis/",
"https://mittkok.expressen.se/recept/laxpizza-pa-tunna-brod/",
"https://mittkok.expressen.se/recept/cannelloni-med-champinjoner-och-sidflask/",
"https://mittkok.expressen.se/recept/rostade-kycklingvingar-med-limedipp/",
"https://mittkok.expressen.se/recept/parmesansoppa-med-majs-och-blamusslor/",
"https://mittkok.expressen.se/recept/tre-glada-laxar-i-sommarens-farger/",
"https://mittkok.expressen.se/recept/laxcarpaccio/",
"https://mittkok.expressen.se/recept/godaste-laxmackan-med-getost-och-cole-slaw-pa-sommarkal/",
"https://mittkok.expressen.se/recept/laxsallad-nicoise-med-inkokt-lax/",
"https://mittkok.expressen.se/recept/dubbelpanerad-makrillfile-med-dillkokt-farskpotatis-och-citrussmor/",
"https://mittkok.expressen.se/recept/grillad-lammstek-med-rosmarin-och-citron/",
"https://mittkok.expressen.se/recept/lax-med-fankal-pressad-mandelpotatis/",
"https://mittkok.expressen.se/recept/marinerad-flanksteak/",
"https://mittkok.expressen.se/recept/ortpestomarinerad-flaskfile-med-pastasallad/",
"https://mittkok.expressen.se/recept/ortgrillade-gronsaker-med-getost-aioli/",
"https://mittkok.expressen.se/recept/ortgrillad-roding/",
"https://mittkok.expressen.se/recept/ortfile-med-bacon-och-spenatmos/",
"https://mittkok.expressen.se/recept/algwallenbergare-med-ortpotatis/",
"https://mittkok.expressen.se/recept/algfile-med-kantareller-och-svampkornotto/",
"https://mittkok.expressen.se/recept/zucchinicarpaccio-med-kycklingspett/",
"https://mittkok.expressen.se/recept/vasterbottenslax-med-kraftor/",
"https://mittkok.expressen.se/recept/wraps-med-grillad-lammkebab-och-pistaschnotter/",
"https://mittkok.expressen.se/recept/vitloks-och-svampfylld-flaskfile-med-sherrysas/",
"https://mittkok.expressen.se/recept/vinpocherad-kolja-med-pepparrot/",
"https://mittkok.expressen.se/recept/vindolmar/",
"https://mittkok.expressen.se/recept/viltburgare-med-kantareller/",
"https://mittkok.expressen.se/recept/whiskyinkokt-lax-med-kokt-potatis-och-ortsas/",
"https://mittkok.expressen.se/recept/whisky-och-limebraserad-hummer-med-hummerrisotto/",
"https://mittkok.expressen.se/recept/varmrokt-lax-med-sauce-vert/",
"https://mittkok.expressen.se/recept/varm-potatissallad/",
"https://mittkok.expressen.se/recept/varm-nudelsallad-med-kyckling/",
"https://mittkok.expressen.se/recept/wallenbergare-med-potatispure/",
"https://mittkok.expressen.se/recept/umbrisk-kyckling-pa-bruschetta/",
"https://mittkok.expressen.se/recept/ugnsbakad-kotlettrad-med-applen/",
"https://mittkok.expressen.se/recept/turkiska-piroger/",
"https://mittkok.expressen.se/recept/tunnbrod-med-stromming/",
"https://mittkok.expressen.se/recept/trattkantarellsoppa/",
"https://mittkok.expressen.se/recept/tortilla-med-rod-linsrora-och-harissarakor/",
"https://mittkok.expressen.se/recept/torskfile-med-ostronsas-och-sellerimousse/",
"https://mittkok.expressen.se/recept/tonno-alla-brace/",
"https://mittkok.expressen.se/recept/tomatmarinerade-laxspett-med-svart-bonsalsa/",
"https://mittkok.expressen.se/recept/tomatiserade-kraftor-med-grappa-och-basilika/",
"https://mittkok.expressen.se/recept/toast-med-fankal-och-pilgrimsmusslor/",
"https://mittkok.expressen.se/recept/tian-provensalsk-gronsakslada/",
"https://mittkok.expressen.se/recept/thaimarinerad-havsoring/",
"https://mittkok.expressen.se/recept/texmexpizza-med-kyckling-avokado-och-koriander/",
"https://mittkok.expressen.se/recept/tandoorilammkotletter-med-curry-och-ingefarsmorotter/",
"https://mittkok.expressen.se/recept/taglioni-med-lime-och-korsbarstomatsalsa/",
"https://mittkok.expressen.se/recept/sasongens-gronsakspaj/",
"https://mittkok.expressen.se/recept/stekt-al-med-angssyresas/",
"https://mittkok.expressen.se/recept/stekt-sill-med-dillgradde/",
"https://mittkok.expressen.se/recept/stekt-roding-med-primorsalsa/",
"https://mittkok.expressen.se/recept/stekt-roding-med-lojromspotatis/",
"https://mittkok.expressen.se/recept/stekt-med-grillade-gronsaker/",
"https://mittkok.expressen.se/recept/stekt-gos-med-saffranssas/",
"https://mittkok.expressen.se/recept/stekt-ankbrost-med-fikonsky/",
"https://mittkok.expressen.se/recept/stekt-abborre-och-kraftpanna-med-kantareller/",
"https://mittkok.expressen.se/recept/stek-med-rotfrukter/",
"https://mittkok.expressen.se/recept/squashrisotto-med-selleri-och-apple/",
"https://mittkok.expressen.se/recept/sparrisrisotto-med-fankalsstekt-roding/",
"https://mittkok.expressen.se/recept/spagettigratang-med-smak-av-italien/",
"https://mittkok.expressen.se/recept/sotad-sashimi/",
"https://mittkok.expressen.se/recept/sotad-lax-med-linser-och-rucola/",
"https://mittkok.expressen.se/recept/snabb-tortellinisoppa/",
"https://mittkok.expressen.se/recept/sma-goda-senapsburgare/",
"https://mittkok.expressen.se/recept/skordecarbonara/",
"https://mittkok.expressen.se/recept/sjomansbiff-pa-oxfile-och-whisky/",
"https://mittkok.expressen.se/recept/simrishamnstorsk-pa-kasebergatang/",
"https://mittkok.expressen.se/recept/sej-och-blamusslor-med-vitt-vin/",
"https://mittkok.expressen.se/recept/seafood-stew/",
"https://mittkok.expressen.se/recept/sashimi/",
"https://mittkok.expressen.se/recept/salviapasta-med-fankal-och-sardeller/",
"https://mittkok.expressen.se/recept/saltimboccalax-med-palsternackor/",
"https://mittkok.expressen.se/recept/saltimbocca-pa-kalvytterfile-med-stekt-vit-sparris/",
"https://mittkok.expressen.se/recept/sallad-med-pilgrimsmusslor-parmesanost-och-apelsinvinaigrette/",
"https://mittkok.expressen.se/recept/rodvinsbrasserad-oxfile/",
"https://mittkok.expressen.se/recept/rodlokssill/",
"https://mittkok.expressen.se/recept/rodbetsbiffar-med-trattkantareller/",
"https://mittkok.expressen.se/recept/rastekt-vit-sparris-med-halstrade-pilgrimsmusslor/",
"https://mittkok.expressen.se/recept/radjursytterfile-med-rodvinssky-och-rotfruktsstomp/",
"https://mittkok.expressen.se/recept/rullar-med-gronsaker-och-teriyakikott/",
"https://mittkok.expressen.se/recept/rotsakssplattar/",
"https://mittkok.expressen.se/recept/rotfruktspaj-med-fetaost/",
"https://mittkok.expressen.se/recept/rotfruktsknyte-med-fetaost/",
"https://mittkok.expressen.se/recept/rotfruktsgratang-i-portionsform/",
"https://mittkok.expressen.se/recept/risotto-alla-marinera/",
"https://mittkok.expressen.se/recept/rigatoni-med-italiensk-korv/",
"https://mittkok.expressen.se/recept/rigatonegratang-med-gronsaker-tonfisk-och-oliver/",
"https://mittkok.expressen.se/recept/quornfile-diavolo-med-farsk-pasta/",
"https://mittkok.expressen.se/recept/queneller-med-raksas/",
"https://mittkok.expressen.se/recept/paronpizza-med-pecorino-och-chorizo/",
"https://mittkok.expressen.se/recept/pot-au-feu-pa-rimmad-oxbringa/",
"https://mittkok.expressen.se/recept/pot-au-feu-pa-majskyckling-och-varprimorer-i-dragonsas/",
"https://mittkok.expressen.se/recept/potatisgratang-med-paron/",
"https://mittkok.expressen.se/recept/pestopizza-med-svamp-ricotta-och-kronartskocka/",
"https://mittkok.expressen.se/recept/persiljerot-med-masalakyckling/",
"https://mittkok.expressen.se/recept/per-morbergs-hamburgare/",
"https://mittkok.expressen.se/recept/pepprig-kotlettrad-rotfrukter/",
"https://mittkok.expressen.se/recept/pastasnackor-med-kryddig-farsfyllning/",
"https://mittkok.expressen.se/recept/pastarullar-fyllda-med-kyckling/",
"https://mittkok.expressen.se/recept/parmalindade-bonor-risonirisotto/",
"https://mittkok.expressen.se/recept/parmalindad-krabbkaka-med-meloncarpaccio/",
"https://mittkok.expressen.se/recept/parmalindad-gos-med-grillad-sparris/",
"https://mittkok.expressen.se/recept/parmakyckllng-citrustagliatelle/",
"https://mittkok.expressen.se/recept/paprikasoppa-med-kycklingspett/",
"https://mittkok.expressen.se/recept/pannkakor-fyllda-med-kottfars/",
"https://mittkok.expressen.se/recept/paella-akta/",
"https://mittkok.expressen.se/recept/paella-pa-hirs-med-quorn/",
"https://mittkok.expressen.se/recept/paella-med-skaldjur-och-quinoa/",
"https://mittkok.expressen.se/recept/paella-med-risoni-och-ajvaraioli/",
"https://mittkok.expressen.se/recept/pad-thai/",
"https://mittkok.expressen.se/recept/odlad-torsk-med-spritartspure/",
"https://mittkok.expressen.se/recept/nudlar-med-stark-och-syrlig-rabarbersas-och-knaperstekt-flask/",
"https://mittkok.expressen.se/recept/nattamat-med-minipajer/",
"https://mittkok.expressen.se/recept/musselsoppa-med-rokt-paprika/",
"https://mittkok.expressen.se/recept/musselsoppa/",
"https://mittkok.expressen.se/recept/moussaka-med-squash-och-lammfars/",
"https://mittkok.expressen.se/recept/moussaka/",
"https://mittkok.expressen.se/recept/morotsbiffar-med-gronsaksmos/",
"https://mittkok.expressen.se/recept/middle-east-burger/",
"https://mittkok.expressen.se/recept/lokpizza-med-salvia-parmaskinka-och-balsamkokta-lokar/",
"https://mittkok.expressen.se/recept/lattrokt-gos-med-farskpotatissallad-med-jordartskocka/",
"https://mittkok.expressen.se/recept/latthalstrade-laxspett-pa-citronsallad/",
"https://mittkok.expressen.se/recept/lacker-lax-med-rodlok-och-apelsinsmordroppar/",
"https://mittkok.expressen.se/recept/lyxig-biffgryta-med-svamp-och-tryffel/",
"https://mittkok.expressen.se/recept/lutfisksufflepudding/",
"https://mittkok.expressen.se/recept/lime-och-honungglacerade-grillspett-med-oxfile-och-chorizo/",
"https://mittkok.expressen.se/recept/libabrod-med-grillad-haloumi-och-hommus/",
"https://mittkok.expressen.se/recept/laxspett-med-med-paprika-och-potatissallad/",
"https://mittkok.expressen.se/recept/laxpudding-med-skirat-smor/",
"https://mittkok.expressen.se/recept/laxfarsbiffar/",
"https://mittkok.expressen.se/recept/laxfile-med-pecannotter/",
"https://mittkok.expressen.se/recept/laxburgare-med-agg-och-bladspenat/",
"https://mittkok.expressen.se/recept/lax-pa-spenat-svampbadd-med-aromsmor/",
"https://mittkok.expressen.se/recept/lax-med-sesamfron/",
"https://mittkok.expressen.se/recept/lax-i-folie-med-gravad-citron/",
"https://mittkok.expressen.se/recept/lammstek-med-honung-och-rostad-mandel/",
"https://mittkok.expressen.se/recept/lammracks-med-sotpotatiskaka-och-vitlokssky/",
"https://mittkok.expressen.se/recept/lammracks-med-rostade-rotfrukter-och-olivsmor/",
"https://mittkok.expressen.se/recept/lammracks-med-myntabonor/",
"https://mittkok.expressen.se/recept/lammkotletter-med-vitlokssas-bakade-tomater-och-klyftpotatis/",
"https://mittkok.expressen.se/recept/lammfarsburgare-med-chevre-och-sotpotatis/",
"https://mittkok.expressen.se/recept/lammfile-med-stravsopp/",
"https://mittkok.expressen.se/recept/lammburgare-med-rostade-gronsaker-och-getostror/",
"https://mittkok.expressen.se/recept/kottgryta-med-salsa-verde/",
"https://mittkok.expressen.se/recept/kottfarssas-lamm/",
"https://mittkok.expressen.se/recept/kottfarspaj-med-suffletacke/",
"https://mittkok.expressen.se/recept/kottfarslimpa-fetaostfylld/",
"https://mittkok.expressen.se/recept/kottfarslimpa-och-rotfrukter/",
"https://mittkok.expressen.se/recept/kottfarslimpa-med-svamp/",
"https://mittkok.expressen.se/recept/kalpuddig-med-afrikanska-smaker/",
"https://mittkok.expressen.se/recept/kycklingwok-med-nudlar/",
"https://mittkok.expressen.se/recept/kycklingspett-med-jordnotssas-och-asiatisk-sallad/",
"https://mittkok.expressen.se/recept/kycklingsallad-med-frukt-och-ortmajonnas/",
"https://mittkok.expressen.se/recept/kycklingpaj-med-torkade-aprikoser/",
"https://mittkok.expressen.se/recept/kycklingklubbor-i-ugn-med-orter/",
"https://mittkok.expressen.se/recept/kycklinggratang-tandoori-med-naanbrod/",
"https://mittkok.expressen.se/recept/kycklingfile-i-ugn-med-persikor/",
"https://mittkok.expressen.se/recept/kycklingfile-i-chilimarinad/",
"https://mittkok.expressen.se/recept/kyckling-med-citron-och-orter/",
"https://mittkok.expressen.se/recept/kumminfrasta-rodbetor-med-grillat-flask/",
"https://mittkok.expressen.se/recept/kramig-nypotatissallad-serverad-med-grillad-entrecote/",
"https://mittkok.expressen.se/recept/kramig-morotssoppa-med-krutonger/",
"https://mittkok.expressen.se/recept/kramig-kaviarstromming/",
"https://mittkok.expressen.se/recept/kryddig-flaskfile-med-nudelsallad-och-limedressing/",
"https://mittkok.expressen.se/recept/krabbravioli-med-kokosbuljong/",
"https://mittkok.expressen.se/recept/kokosmjolkssoppa/",
"https://mittkok.expressen.se/recept/klassisk-kalvstek/",
"https://mittkok.expressen.se/recept/kesellatarta-med-lojrom-och-syrad-lok/",
"https://mittkok.expressen.se/recept/kaviarbraserad-makrill/",
"https://mittkok.expressen.se/recept/karrespett-med-gron-dinkelsallad/",
"https://mittkok.expressen.se/recept/karre-med-pancetta-apelsinoch-enbar/",
"https://mittkok.expressen.se/recept/karljohan-och-trattkantarellsoppa/",
"https://mittkok.expressen.se/recept/karamelliserad-kyckling-med-citronelle-och-ingefara/",
"https://mittkok.expressen.se/recept/kantarellsoppa-med-dill/",
"https://mittkok.expressen.se/recept/kalvsnitsel-med-sparris-tomatspett-och-parmesankram/",
"https://mittkok.expressen.se/recept/kalvjarpar-med-svartrotter/",
"https://mittkok.expressen.se/recept/kalvfarsbollar-med-salvia-och-citron-i-tomatsas/",
"https://mittkok.expressen.se/recept/kalvfile-med-svampwok-och-rotfruktskaka/",
"https://mittkok.expressen.se/recept/kalkonsatefondue/",
"https://mittkok.expressen.se/recept/kalkon-med-apelsingremolata/",
"https://mittkok.expressen.se/recept/julens-paella/",
"https://mittkok.expressen.se/recept/italienska-rulader-med-kramig-polenta/",
"https://mittkok.expressen.se/recept/italienska-kottbullar-av-kalvfars/",
"https://mittkok.expressen.se/recept/inkokt-lax/",
"https://mittkok.expressen.se/recept/hogrevskarna-med-orter-pistagenotter-och-glacerade-frukter/",
"https://mittkok.expressen.se/recept/halleflundra-med-pocherad-fankal-och-stekt-sidflask/",
"https://mittkok.expressen.se/recept/hickoryrokt-farskpotatis-och-helstekt-flaskkarre/",
"https://mittkok.expressen.se/recept/heta-linser/",
"https://mittkok.expressen.se/recept/heta-cajunkraftor-med-majs-och-potatis/",
"https://mittkok.expressen.se/recept/het-linssoppa-med-chorizo/",
"https://mittkok.expressen.se/recept/hemsnickrad-kebab-i-pitabrod/",
"https://mittkok.expressen.se/recept/helstekt-file-med-rotfruktstarta/",
"https://mittkok.expressen.se/recept/helstekt-file-med-fruktsalsa/",
"https://mittkok.expressen.se/recept/helstekt-entrecote-med-betor-och-tomatsallad/",
"https://mittkok.expressen.se/recept/hel-laxsida-med-svamptacke/",
"https://mittkok.expressen.se/recept/hel-kyckling-i-ugn/",
"https://mittkok.expressen.se/recept/havskraftor-med-smak-av-sydamerika/",
"https://mittkok.expressen.se/recept/havets-lackerheter-i-saffransbuljong/",
"https://mittkok.expressen.se/recept/hamburgare-med-coleslaw/",
"https://mittkok.expressen.se/recept/halstrad-lax-med-dillstuvad-potatis/",
"https://mittkok.expressen.se/recept/gosburgare-med-kalles-dressing/",
"https://mittkok.expressen.se/recept/gustavs-glaserade-anka/",
"https://mittkok.expressen.se/recept/gronpeppar-limerakor/",
"https://mittkok.expressen.se/recept/gronkalspaj-med-cheddar-och-valnotter/",
"https://mittkok.expressen.se/recept/gron-artsoppa-och-parmesanstanger/",
"https://mittkok.expressen.se/recept/grillade-revben-pa-spett/",
"https://mittkok.expressen.se/recept/grillade-lammracksspjall/",
"https://mittkok.expressen.se/recept/grillade-kycklingspett/",
"https://mittkok.expressen.se/recept/grillad-roding/",
"https://mittkok.expressen.se/recept/grillad-pizza-med-fankal-och-rokt-korv/",
"https://mittkok.expressen.se/recept/grillad-halloumi-med-rucolasallad-svarta-bonor-och-avokado/",
"https://mittkok.expressen.se/recept/gremolata-risotto-med-haricots-verts-och-biff/",
"https://mittkok.expressen.se/recept/grekiska-gronsaker-i-ugn/",
"https://mittkok.expressen.se/recept/grekisk-sallad-med-farskpotatis/",
"https://mittkok.expressen.se/recept/gratinerade-tagliatelle-a-la-cafe-de-paris/",
"https://mittkok.expressen.se/recept/gratinerade-lammfarsbiffar-med-linssallad/",
"https://mittkok.expressen.se/recept/getostpaj-med-salami/",
"https://mittkok.expressen.se/recept/gazpacho-med-pilgrimsmusslor/",
"https://mittkok.expressen.se/recept/farsspett-med-paprika-persilja/",
"https://mittkok.expressen.se/recept/fyllda-tomater/",
"https://mittkok.expressen.se/recept/fylld-kyckling-med-grillad-squash/",
"https://mittkok.expressen.se/recept/frutti-di-mare/",
"https://mittkok.expressen.se/recept/fondue-med-flask-och-apelsin/",
"https://mittkok.expressen.se/recept/flaskfilespett-fajita/",
"https://mittkok.expressen.se/recept/flaskfile-ugnstekt-med-melon-feta/",
"https://mittkok.expressen.se/recept/flaskfile-pa-spett-med-moghrabiahsallad/",
"https://mittkok.expressen.se/recept/fjallroding-pa-bon-och-rotfruktsbadd/",
"https://mittkok.expressen.se/recept/fiskgratang-med-rakor-och-artor/",
"https://mittkok.expressen.se/recept/fisk-och-skaldjursgryta-med-tomat/",
"https://mittkok.expressen.se/recept/filodegsrullar-med-quorn-och-potatis/",
"https://mittkok.expressen.se/recept/filespett-med-yoghurtsas-tabouleh/",
"https://mittkok.expressen.se/recept/file-med-smakrik-sas/",
"https://mittkok.expressen.se/recept/farfalle-med-lax-och-rosesallad/",
"https://mittkok.expressen.se/recept/entrecote-med-teriyakiglaze-och-grillade-gronsaker/",
"https://mittkok.expressen.se/recept/entrecote-med-papayasalsa-potatisbakelse/",
"https://mittkok.expressen.se/recept/enbarsburgare/",
"https://mittkok.expressen.se/recept/dill-och-citronkraftor/",
"https://mittkok.expressen.se/recept/currykyckling-med-ananas/",
"https://mittkok.expressen.se/recept/crepes-med-kantareller/",
"https://mittkok.expressen.se/recept/couscous-pa-lamm/",
"https://mittkok.expressen.se/recept/club-sandwich-med-flaskfile/",
"https://mittkok.expressen.se/recept/citruskyckling-med-farsk-potatissallad/",
"https://mittkok.expressen.se/recept/citrontimjankryddad-flaskfile-pa-spenatbadd/",
"https://mittkok.expressen.se/recept/citronpasta-med-sesamstekt-lax/",
"https://mittkok.expressen.se/recept/choucroute-garnie-a-lalsacienne/",
"https://mittkok.expressen.se/recept/chilikotlettspett-med-krispig-paprikasallad/",
"https://mittkok.expressen.se/recept/chiliglaserad-kotlett-med-stjarnanisky-och-myntakram/",
"https://mittkok.expressen.se/recept/chili-och-koriandergrillat-fiskspett-med-mango/",
"https://mittkok.expressen.se/recept/chicken-cajun-med-grillade-gronsaker/",
"https://mittkok.expressen.se/recept/chevrefyllda-algfarsbiffar/",
"https://mittkok.expressen.se/recept/cheesecake-med-rokt-farfiol-och-lojrom/",
"https://mittkok.expressen.se/recept/cesarbaguette-med-grillad-kyckling/",
"https://mittkok.expressen.se/recept/carribbean-seafood-burger/",
"https://mittkok.expressen.se/recept/caponata/",
"https://mittkok.expressen.se/recept/canneloni-med-quornbitar-spenat-och-mascarpone/",
"https://mittkok.expressen.se/recept/cannelloni-med-salami-och-spenat/",
"https://mittkok.expressen.se/recept/cake-sale-med-lax-och-graslok/",
"https://mittkok.expressen.se/recept/cake-sale-med-kyckling-och-paprika/",
"https://mittkok.expressen.se/recept/cake-sale-med-gronmogelost-valnotter-och-russin/",
"https://mittkok.expressen.se/recept/cake-sale-med-fetaost-tomat-och-svarta-oliver/",
"https://mittkok.expressen.se/recept/cake-sale-med-champinjoner-vitlok-och-persilja/",
"https://mittkok.expressen.se/recept/cake-sale-grundrecept/",
"https://mittkok.expressen.se/recept/caesarsallad-med-flaskfile-och-timjan/",
"https://mittkok.expressen.se/recept/bocklingsallad-med-agg-och-pepparrot/",
"https://mittkok.expressen.se/recept/bresaola-med-fettuccine-och-gronpeppar/",
"https://mittkok.expressen.se/recept/bolognese-med-salami-och-frikadeller/",
"https://mittkok.expressen.se/recept/blamusselgryta/",
"https://mittkok.expressen.se/recept/blt-med-tomater-och-avokadokram/",
"https://mittkok.expressen.se/recept/bloody-marytomater-med-vitloksstekt-fisk/",
"https://mittkok.expressen.se/recept/biffspett-med-solskenssallad/",
"https://mittkok.expressen.se/recept/biffspett-med-heta-potatis-och-gronsaksspett/",
"https://mittkok.expressen.se/recept/biffgryta-med-gronpeppar-och-konjak/",
"https://mittkok.expressen.se/recept/biff-med-limemarinerad-sparris-och-rucola-samt-sellerikram/",
"https://mittkok.expressen.se/recept/biff-med-chili/",
"https://mittkok.expressen.se/recept/belgiska-musslor/",
"https://mittkok.expressen.se/recept/bbq-burgare/",
"https://mittkok.expressen.se/recept/basilikamarinerad-kalkon/",
"https://mittkok.expressen.se/recept/basilikakryddad-quornburgare-med-tomatpesto/",
"https://mittkok.expressen.se/recept/balsamicobiffar-med-risoni/",
"https://mittkok.expressen.se/recept/balsamglacerade-rotfrukter/",
"https://mittkok.expressen.se/recept/baconlindad-flaskfile-lokragu-och-grillade-potatisspett/",
"https://mittkok.expressen.se/recept/asiatiska-kraftor-med-ingefara-citrongras-och-pepparrot/",
"https://mittkok.expressen.se/recept/apelsinglacerad-laxfile/",
"https://mittkok.expressen.se/recept/apelsinbrasserad-brysselkal-med-feta-och-pinjenotter/",
"https://mittkok.expressen.se/recept/apelsin-och-limelax/",
"https://mittkok.expressen.se/recept/ansjovistarta-med-apple-och-graslok/",
"https://mittkok.expressen.se/recept/ansjovissej/",
"https://mittkok.expressen.se/recept/allt-i-ett-med-gosfile/",
"https://mittkok.expressen.se/recept/allt-i-ett-kyckling-med-apelsin-och-druvor/",
"https://mittkok.expressen.se/recept/abborrpaket/",
"https://mittkok.expressen.se/recept/flasksida-och-potatis-pa-bagarhustruns-vis/"];
//börja nästa på 6k
let filename = "mittkok/mittkok11_2018-06-11.json";
//läs om alla mittkok då ignredient name in hade uppercase. 
//se till att inte köra alla 2600 recept in i createrecipes samtidigt. blir för mycket för transactions på uses. eller då kör recountuses.js efteråt.
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
                        if (!document.querySelector('.recipe .recipe__content')) {
                            return;
                        }
                        let recipe = {};
                        //title
                        recipe.title = document.querySelector('.recipe__title').innerHTML.trim();
                        //tags
                        let tags = {};
                        //cannot read property length of null
                        $('.recipe .recipe__tags a').each(function () {
                            let t = $(this).text();
                            if (t.match(/^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/)) {
                                t = t + "ERROR";
                            }
                            tags[t.charAt(0).toUpperCase() + t.slice(1).replace(/\s*\([^()]*\)$/, '').split(",")[0].replace(/([/.#$])/g, '').trim()] = true;


                        })
                        recipe.tags = tags;
                        //source
                        recipe.source = window.location.href;

                        //votes rating
                        if (document.querySelector('.recipe .recipe__rate .rate__meta')) {
                            recipe.votes = document.querySelector('.recipe .recipe__rate .rate__meta meta[itemprop=ratingCount]').getAttribute("content").trim();
                            recipe.rating = document.querySelector('.recipe .recipe__rate .rate__meta meta[itemprop=ratingValue]').getAttribute("content").trim();
                        }
                        //author
                        if (document.querySelector('.recipe .author__name')) {
                            recipe.author = document.querySelector('.recipe .author__name span[itemprop=name]').innerText.trim();
                        } else {
                            recipe.author = "Mitt kök";
                        }

                        //createdFor

                        //portions
                        if (document.querySelector('.recipe .recipe__portions')) {
                            let portionsString = document.querySelector('.recipe .recipe__portions').innerHTML.trim().split(" ")[0];
                            if (portionsString.indexOf("–") > -1) {
                                let firstPart = +portionsString.split("–")[0];
                                let secondPart = +portionsString.split("–")[1];
                                recipe.portions = (firstPart + secondPart) / 2;
                            } else if (portionsString.indexOf("-") > -1) {
                                let firstPart = +portionsString.split("-")[0];
                                let secondPart = +portionsString.split("-")[1];
                                recipe.portions = (firstPart + secondPart) / 2;
                            } else {
                                recipe.portions = +portionsString.trim();
                            }
                            if (isNaN(recipe.portions)) {
                                recipe.portions = "ERROR:" + recipe.portions;
                            }
                        }
                        //created

                        //description
                        if (document.querySelector('.recipe .recipe__description p')) {
                            recipe.description = document.querySelector('.recipe .recipe__description p').innerHTML.replace(/(\r\n|\n|\r|<[^>]*>)/gm, "").replace(/  +/g, ' ').trim();
                        }

                        //time
                        if (document.querySelector('.recipe time.recipe__time')) {
                            //90 minuter
                            //2.5 tim
                            //2 timmar
                            let timeString = document.querySelector('.recipe time.recipe__time').innerHTML.trim();
                            if (timeString.indexOf("min") > -1 && timeString.indexOf("tim") > -1) {
                                recipe.time = "ERROR" + timeString;
                            } else if (timeString.indexOf("min") > -1) {
                                if (timeString.indexOf("–") > -1) {
                                    let firstPart = +timeString.split("–")[0];
                                    let secondPart = +timeString.split("–")[1];
                                    recipe.time = (firstPart + secondPart) / 2;
                                } else if (timeString.indexOf("-") > -1) {
                                    let firstPart = +timeString.split("-")[0];
                                    let secondPart = +timeString.split("-")[1];
                                    recipe.time = (firstPart + secondPart) / 2;
                                } else {
                                    recipe.time = timeString.split(" ")[0] - 0;
                                }
                            } else if (timeString.indexOf("tim") > -1) {
                                if (timeString.indexOf("–") > -1) {
                                    let firstPart = +timeString.split("–")[0];
                                    let secondPart = +timeString.split("–")[1];
                                    recipe.time = ((firstPart + secondPart) / 2) * 60;
                                } else if (timeString.indexOf("-") > -1) {
                                    let firstPart = +timeString.split("-")[0];
                                    let secondPart = +timeString.split("-")[1];
                                    recipe.time = ((firstPart + secondPart) / 2) * 60;
                                } else {
                                    recipe.time = (timeString.split(" ")[0] - 0) * 60;
                                }
                            } else {
                                recipe.time = "ERROR" + timeString;
                            }
                            if (recipe.time < 25) {
                                if (!tags.hasOwnProperty('Snabbt')) {
                                    tags["Snabbt"] = true;
                                }
                            }
                        }
                        //ingredients
                        if (document.querySelector('.recipe .recipe__ingredients--inner ul li')) {
                            let ingredientList = document.querySelectorAll('.recipe__ingredients--inner li');
                            //ingredienser unit amount delas med visst antal mellanslag
                            //ostadigt sätt att hantera 1/2 och 3-4 osv. på amount som fastnat i name. 
                            //testa och det går alltid att backa genom att ta bort alla recept som innehåller "mittkok" i source.
                            //uppskattad förväntad antal inlästa recept 2000-2500
                            let ingredients = [];
                            let ingredientNames = [];
                            for (let i = 0; i < ingredientList.length; i++) {
                                let ingredientArray = ingredientList[i].getElementsByTagName("span")[0].innerHTML.replace(/(\r\n|\n|\r|<[^>]*>)/gm, "").replace(/&#8232;/g, "").split("            ");
                                let ingredient = {};
                                if (ingredientArray.length === 1) {
                                    ingredient.name = ingredientArray[0].trim().replace(/\s*\([^()]*\)$/, '').split(",")[0].replace(/([.#$])/g, '').trim();
                                }
                                if (ingredientArray.length === 2) {
                                    ingredient.amount = ingredientArray[0].trim();
                                    ingredient.name = ingredientArray[1].trim().replace(/\s*\([^()]*\)$/, '').split(",")[0].replace(/([.#$])/g, '').trim();
                                }
                                if (ingredientArray.length === 3) {
                                    ingredient.amount = ingredientArray[0].trim();
                                    ingredient.unit = ingredientArray[1].trim();
                                    ingredient.name = ingredientArray[2].trim().replace(/\s*\([^()]*\)$/, '').split(",")[0].replace(/([.#$])/g, '').trim();
                                }
                                if (ingredientArray.length > 3) {
                                    ingredient.name = "ERROR:" + ingredientArray.toString();
                                }
                                if (!isNaN(ingredient.name.split(" ")[0]) && ingredient.name.split(" ").length === 2) {
                                    ingredient.amount = ingredient.name.split(" ")[0];
                                    ingredient.name = ingredient.name.split(" ")[1].trim();
                                } 
                                if (!isNaN(ingredient.name.split(" ")[0]) && ingredient.name.split(" ").length === 3) {
                                    ingredient.amount = ingredient.name.split(" ")[0];
                                    ingredient.unit = ingredient.name.split(" ")[1];
                                    ingredient.name = ingredient.name.split(" ")[2];
                                } 
                                if (ingredient.name.startsWith("1/2") && ingredient.name.split(" ").length === 2) {
                                    ingredient.amount = ingredient.amount ? +ingredient.amount + 0.5 : 0.5;
                                    ingredient.amount = ingredient.amount + "";
                                    ingredient.name = ingredient.name.split(" ")[1];
                                } 
                                if (ingredient.name.startsWith("1/2") && ingredient.name.split(" ").length === 3) {
                                    ingredient.amount = ingredient.amount ? +ingredient.amount + 0.5 : 0.5;
                                    ingredient.amount = ingredient.amount + "";
                                    ingredient.unit = ingredient.name.split(" ")[1];
                                    ingredient.name = ingredient.name.split(" ")[2];
                                }
                                if (ingredient.name.startsWith("½") && ingredient.name.split(" ").length === 2) {
                                    ingredient.amount = ingredient.amount ? +ingredient.amount + 0.5 : 0.5;
                                    ingredient.amount = ingredient.amount + "";
                                    ingredient.name = ingredient.name.split(" ")[1];
                                } if (ingredient.name.startsWith("½") && ingredient.name.split(" ").length === 3) {
                                    ingredient.amount = ingredient.amount ? +ingredient.amount + 0.5 : 0.5;
                                    ingredient.amount = ingredient.amount + "";
                                    ingredient.unit = ingredient.name.split(" ")[1];
                                    ingredient.name = ingredient.name.split(" ")[2];
                                } if (ingredient.name.startsWith(ingredient.name.split("–")[0]) && !isNaN(ingredient.name.split("–")[0]) && ingredient.name.split(" ").length === 3) {
                                    let amountParts = ingredient.name.split(" ")[0];
                                    let firstPart = +amountParts.split("–")[0];
                                    let secondPart = +amountParts.split("–")[1];
                                    ingredient.amount = (firstPart + secondPart) / 2;
                                    ingredient.amount = ingredient.amount + "";
                                    ingredient.unit = ingredient.name.split(" ")[1];
                                    ingredient.name = ingredient.name.split(" ")[2];
                                } if (ingredient.name.startsWith(ingredient.name.split("–")[0]) && !isNaN(ingredient.name.split("–")[0]) && ingredient.name.split(" ").length === 2) {
                                    let amountParts = ingredient.name.split(" ")[0];
                                    let firstPart = +amountParts.split("–")[0];
                                    let secondPart = +amountParts.split("–")[1];
                                    ingredient.amount = (firstPart + secondPart) / 2;
                                    ingredient.amount = ingredient.amount + "";
                                    ingredient.name = ingredient.name.split(" ")[1];
                                }
                                if (ingredient.name.startsWith(ingredient.name.split("-")[0]) && !isNaN(ingredient.name.split("-")[0]) && ingredient.name.split(" ").length === 3) {
                                    let amountParts = ingredient.name.split(" ")[0];
                                    let firstPart = +amountParts.split("-")[0];
                                    let secondPart = +amountParts.split("-")[1];
                                    ingredient.amount = (firstPart + secondPart) / 2;
                                    ingredient.amount = ingredient.amount + "";
                                    ingredient.unit = ingredient.name.split(" ")[1];
                                    ingredient.name = ingredient.name.split(" ")[2];
                                }
                                if (ingredient.name.startsWith(ingredient.name.split("-")[0]) && !isNaN(ingredient.name.split("-")[0]) && ingredient.name.split(" ").length === 2) {
                                    let amountParts = ingredient.name.split(" ")[0];
                                    let firstPart = +amountParts.split("-")[0];
                                    let secondPart = +amountParts.split("-")[1];
                                    ingredient.amount = (firstPart + secondPart) / 2;
                                    ingredient.amount = ingredient.amount + "";
                                    ingredient.name = ingredient.name.split(" ")[1];
                                }
                                if (ingredient.amount.indexOf("½") > -1) {
                                    let splitAmount = ingredient.amount.split(" ");
                                    if (splitAmount.length === 1) {
                                        ingredient.amount = 0.5;
                                    } else {
                                        ingredient.amount = +splitAmount[0] + 0.5;
                                    }
                                    ingredient.amount = ingredient.amount + "";
                                }
                                if (ingredient.amount.indexOf("1/2") > -1) {
                                    let splitAmount = ingredient.amount.split(" ");
                                    if (splitAmount.length === 1) {
                                        ingredient.amount = 0.5;
                                    } else {
                                        ingredient.amount = +splitAmount[0] + 0.5;
                                    }
                                    ingredient.amount = ingredient.amount + "";
                                }
                                if (ingredient.amount.indexOf("–") > -1) {
                                    let firstPart = +ingredient.amount.split("–")[0];
                                    let secondPart = +ingredient.amount.split("–")[1];
                                    ingredient.amount = (firstPart + secondPart) / 2;
                                    ingredient.amount = ingredient.amount + "";
                                }
                                if (ingredient.amount.indexOf("-") > -1) {
                                    let firstPart = +ingredient.amount.split("-")[0];
                                    let secondPart = +ingredient.amount.split("-")[1];
                                    ingredient.amount = (firstPart + secondPart) / 2;
                                    ingredient.amount = ingredient.amount + "";
                                }
                                ingredient.name = ingredient.name.charAt(0).toUpperCase() + ingredient.name.slice(1);
                                if (ingredientNames.indexOf(ingredient.name) > -1) {
                                    continue;
                                }
                                if (ingredient.amount.trim() == "") {
                                    delete ingredient.amount;
                                }
                                if (ingredient.unit.trim() == "") {
                                    delete ingredient.unit;
                                }
                                if(ingredient.amount && isNaN(ingredient.amount)){
                                    ingredient.amount = ingredient.amount.replace(",",".");
                                }
                                ingredientNames.push(ingredient.name);
                                ingredients.push(ingredient);
                            }
                            recipe.ingredients = ingredients;
                        }
                        if (!recipe.ingredients || recipe.ingredients.length === 0 || (recipe.time && recipe.time < 1)) {
                            return;
                        }

                        //difficulty
                        let instructionsList = document.querySelector('.recipe .recipe__instructions--inner').getElementsByTagName("li");
                        let nrOfIngredients = recipe.ingredients.length;
                        let instructionLength = 0;
                        for (let i = 0; i < instructionsList.length; i++) {
                            instructionLength = instructionLength + instructionsList[i].innerHTML.replace(/(\r\n|\n|\r|)/gm, "").trim().length;
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