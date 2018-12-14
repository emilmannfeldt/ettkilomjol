/* eslint no-await-in-loop: 0 */
/* eslint no-loop-func: 0 */
/* eslint no-console: 0 */

const params = process.argv;
const puppeteer = require('puppeteer');
const firebase = require('firebase');
const fs = require('fs');
const importUtil = require('./importUtil.js');

// Prod
const prodConfig = {
  apiKey: 'AIzaSyAPoXwInGdHakbqWzlhH62qSRBSxljMNn8',
  authDomain: 'ettkilomjol-10ed1.firebaseapp.com',
  databaseURL: 'https://ettkilomjol-10ed1.firebaseio.com',
  storageBucket: 'ettkilomjol-10ed1.appspot.com',
  messagingSenderId: '1028199106361',
};
// Dev
const devConfig = {
  apiKey: 'AIzaSyCRcK1UiO7j0x9OjC_8jq-kbFl9r9d38pk',
  authDomain: 'ettkilomjol-dev.firebaseapp.com',
  databaseURL: 'https://ettkilomjol-dev.firebaseio.com',
  projectId: 'ettkilomjol-dev',
  storageBucket: 'ettkilomjol-dev.appspot.com',
  messagingSenderId: '425944588036',
};
const enviromentArg = process.argv[2];
let nameArg = process.argv[3];
if (enviromentArg === 'dev') {
  firebase.initializeApp(devConfig);
} else if (enviromentArg === 'prod') {
  firebase.initializeApp(prodConfig);
} else {
  console.log('missing enviroment arguement: dev / prod');
  process.exit();
}
const foodRef = firebase.database().ref('foods');
const recipesRef = firebase.database().ref('recipes');
const existingRecipes = [];
const existingFoods = [];
let foodLoaded = false;
let recipeLoaded = false;
const log = [];
let nrOfRecipesCreated = 0;
let nrOfRecipesUpdated = 0;
const final = [];
const imageSizes = [];
let today = new Date();
let dd = today.getDate();
let mm = today.getMonth() + 1; // January is 0!
const yyyy = today.getFullYear();
if (dd < 10) {
  dd = `0${dd}`;
}
if (mm < 10) {
  mm = `0${mm}`;
}
today = `${yyyy}-${mm}-${dd}`;
if (!nameArg) {
  nameArg = 'import';
}
const filename = `${nameArg}_${today}`;

const sources = ['http://www.tasteline.com/recept/marinad-till-kott-och-fagel/',
  'http://www.tasteline.com/recept/jordgubbs-och-limepannacotta/',
  'http://www.tasteline.com/recept/ugnsrostade-gronsaker-2/',
  'http://www.tasteline.com/recept/min-basta-marinad/',
  'http://www.tasteline.com/recept/fisk-rucola-sill/',
  'http://www.tasteline.com/recept/pasta-rakravioli/',
  'http://www.tasteline.com/recept/makrill-med-ansjovissmor-och-purjo/',
  'http://www.tasteline.com/recept/ra-sparrissallad/',
  'http://www.tasteline.com/recept/peppriga-biffar/',
  'http://www.tasteline.com/recept/couscous-med-mandlar/',
  'http://www.tasteline.com/recept/laxwok/',
  'http://www.tasteline.com/recept/fisk-med-fankal/',
  'http://www.tasteline.com/recept/sommarsmoothie-med-smakakor/',
  'http://www.tasteline.com/recept/fullkornsbrod-med-potatis-kaviar-och-purjo/',
  'http://www.tasteline.com/recept/caesarsallad-med-rakor/',
  'http://www.tasteline.com/recept/rostbiff-med-italiensk-tonfisksas/',
  'http://www.tasteline.com/recept/smala-sommarmackan/',
  'http://www.tasteline.com/recept/kyckling-och-avokadosub/',
  'http://www.tasteline.com/recept/musselsas-och-penne/',
  'http://www.tasteline.com/recept/het-bonsallad-med-chipotledressing/',
  'http://www.tasteline.com/recept/farskpotatis-och-kasslersallad/',
  'http://www.tasteline.com/recept/hokifile-med-tomat-och-bonrora/',
  'http://www.tasteline.com/recept/solgul-kyckling/',
  'http://www.tasteline.com/recept/gazpacho-kall-gronsakssoppa/',
  'http://www.tasteline.com/recept/veggie-sandwich/',
  'http://www.tasteline.com/recept/plommonkompott-med-citron/',
  'http://www.tasteline.com/recept/risonisallad-2-2/',
  'http://www.tasteline.com/recept/fruktsallad-med-kardemummakeso-och-pepparkakskross/',
  'http://www.tasteline.com/recept/appelkompott-med-vaniljyoghurt-musli-och-honung/',
  'http://www.tasteline.com/recept/papaya-med-lime/',
  'http://www.tasteline.com/recept/pan-bagna-sydfransk-lunchmacka/',
  'http://www.tasteline.com/recept/gron-pastasallad-med-citronsmak/',
  'http://www.tasteline.com/recept/heta-vegotacos/',
  'http://www.tasteline.com/recept/grillade-kalvkotletter-med-ananasnudlar/',
  'http://www.tasteline.com/recept/rabarberskalar/',
  'http://www.tasteline.com/recept/gron-sparrissoppa-2-2/',
  'http://www.tasteline.com/recept/sparris-morot-och-citronflask/',
  'http://www.tasteline.com/recept/ost-och-lokrisotto/',
  'http://www.tasteline.com/recept/kyckling-med-sparris/',
  'http://www.tasteline.com/recept/kalv-och-citrongryta/',
  'http://www.tasteline.com/recept/sallad-pa-sparris-och-tonfisk/',
  'http://www.tasteline.com/recept/bakade-potatisar/',
  'http://www.tasteline.com/recept/saffranssoppa/',
  'http://www.tasteline.com/recept/biff-och-halloumispett-med-apelsingryn/',
  'http://www.tasteline.com/recept/knaprig-kyckling/',
  'http://www.tasteline.com/recept/tva-kal-med-rokt-lax/',
  'http://www.tasteline.com/recept/farspytt/',
  'http://www.tasteline.com/recept/sallad-med-bakade-tomater/',
  'http://www.tasteline.com/recept/ost-och-spenatomelett-med-rokt-lax/',
  'http://www.tasteline.com/recept/stekt-flask-med-palsternacka/',
  'http://www.tasteline.com/recept/sjomanshoki-i-het-tomatbuljong/',
  'http://www.tasteline.com/recept/mikrad-lax-med-ruccola-och-stuvad-potatis/',
  'http://www.tasteline.com/recept/sotsur-flaskfile/',
  'http://www.tasteline.com/recept/mexikackel/',
  'http://www.tasteline.com/recept/ugnsomelett-2/',
  'http://www.tasteline.com/recept/scones-med-valnotter/',
  'http://www.tasteline.com/recept/gorgonzolagratinerade-flaskkotletter/',
  'http://www.tasteline.com/recept/yoghurtrisotto/',
  'http://www.tasteline.com/recept/ost-ostpaj/',
  'http://www.tasteline.com/recept/marinad-med-thaismak-till-grillat/',
  'http://www.tasteline.com/recept/smal-avokadorora/',
  'http://www.tasteline.com/recept/vegopankisar/',
  'http://www.tasteline.com/recept/pastasallad-med-kyckling-3/',
  'http://www.tasteline.com/recept/fruktsallad-med-variation/',
  'http://www.tasteline.com/recept/inlindad-flaskfile-med-pressad-potatis/',
  'http://www.tasteline.com/recept/paprikor-fyllda-med-svamp-och-ris/',
  'http://www.tasteline.com/recept/kycklingcurry-3/',
  'http://www.tasteline.com/recept/fattiga-riddare-och-rika/',
  'http://www.tasteline.com/recept/vild-flaskkarre-med-klyftpotatis/',
  'http://www.tasteline.com/recept/tomatstromming/',
  'http://www.tasteline.com/recept/violas-banankaka/',
  'http://www.tasteline.com/recept/aggrora-med-renstek/',
  'http://www.tasteline.com/recept/rodkalsallad/',
  'http://www.tasteline.com/recept/kokt-blomkal-med-skinksas/',
  'http://www.tasteline.com/recept/flaskfilespett-med-potatis-och-pinjenotssallad/',
  'http://www.tasteline.com/recept/ansjovis-och-tomatrora-i-frasigt-pajskal/',
  'http://www.tasteline.com/recept/panerad-fetaost-med-citruscouscous/',
  'http://www.tasteline.com/recept/omelett-med-musslor-och-bacon/',
  'http://www.tasteline.com/recept/pizza-som-i-italien/',
  'http://www.tasteline.com/recept/crabfish-och-nudelpanna-med-smak-av-saffran/',
  'http://www.tasteline.com/recept/lammfars-som-i-orienten/',
  'http://www.tasteline.com/recept/stekta-jordartskockor-med-lovbiff/',
  'http://www.tasteline.com/recept/laxsallad-2/',
  'http://www.tasteline.com/recept/pasta-med-broccolipesto/',
  'http://www.tasteline.com/recept/ostgratinerad-korv/',
  'http://www.tasteline.com/recept/tropik-musli/',
  'http://www.tasteline.com/recept/laxburgare-med-mangosalsa-2/',
  'http://www.tasteline.com/recept/kokta-endiver-med-flask/',
  'http://www.tasteline.com/recept/senvintergryta/',
  'http://www.tasteline.com/recept/juggebiffar-med-klyftpotatis/',
  'http://www.tasteline.com/recept/saltbakad-gos-med-tomater/',
  'http://www.tasteline.com/recept/stuffad-zucchini/',
  'http://www.tasteline.com/recept/sweet-chili-kyckling-2-2/',
  'http://www.tasteline.com/recept/couscous-med-kottbullar/',
  'http://www.tasteline.com/recept/notfarsspett-med-mangosas/',
  'http://www.tasteline.com/recept/havrepannkakor-med-hjortron/',
  'http://www.tasteline.com/recept/snabbmarinerad-skinkstek/',
  'http://www.tasteline.com/recept/vegonudlar-med-marinerad-tofu/',
  'http://www.tasteline.com/recept/lata-och-supergoda-baguetter-fran-annas-kokbok/',
  'http://www.tasteline.com/recept/drinktilltugg-2/',
  'http://www.tasteline.com/recept/matig-skinkbaguette/',
  'http://www.tasteline.com/recept/pastasallad-med-dill-och-citron-och-grillad-halloumi/',
  'http://www.tasteline.com/recept/lax-under-ort-och-mandeltacke/',
  'http://www.tasteline.com/recept/inkokt-makrill-med-rabarbersas/',
  'http://www.tasteline.com/recept/dubbelmarinerad-flaskfile/',
  'http://www.tasteline.com/recept/kraftsoppa-phiadelphia/',
  'http://www.tasteline.com/recept/hot-sambalmango-chicken/',
  'http://www.tasteline.com/recept/att-nagot-sa-enkelt-kan-vara-sa-gott/',
  'http://www.tasteline.com/recept/min-kycklinggryta-fran-vardag-till-fest/',
  'http://www.tasteline.com/recept/min-quattro-pasta-som-gor-mig-vild-o-galen/',
  'http://www.tasteline.com/recept/min-gronsaksrora-som-passar-till-precis-allt/',
  'http://www.tasteline.com/recept/kottgryta-med-smak-av-lime-och-kokos/',
  'http://www.tasteline.com/recept/sockerkaksbruschetta-med-myntagubbar/',
  'http://www.tasteline.com/recept/paron-i-folie-med-adelost/',
  'http://www.tasteline.com/recept/ugnsbakad-lax-med-citronsas-2/',
  'http://www.tasteline.com/recept/pastasallad-med-pestodressing/',
  'http://www.tasteline.com/recept/basta-sommargronsalladen/',
  'http://www.tasteline.com/recept/fisksoppa-sweet-chili/',
  'http://www.tasteline.com/recept/spagetti-marinara/',
  'http://www.tasteline.com/recept/saffransrisotto-med-chorizo/',
  'http://www.tasteline.com/recept/kyckling-a-la-medelhavet/',
  'http://www.tasteline.com/recept/grilla-bbq-sauces/',
  'http://www.tasteline.com/recept/rora-med-soltorkade-tomater/',
  'http://www.tasteline.com/recept/mexikansk-chorizosoppa/',
  'http://www.tasteline.com/recept/glassfylld-ananas/',
  'http://www.tasteline.com/recept/rabarbersoppa-2/',
  'http://www.tasteline.com/recept/jordgubbsgazpacho-2/',
  'http://www.tasteline.com/recept/smala-brownies/',
  'http://www.tasteline.com/recept/biffsallad-med-bonor-och-bovete/',
  'http://www.tasteline.com/recept/freddagskvalls-gratang/',
  'http://www.tasteline.com/recept/kycklingsoppa-med-dill-och-potatis/',
  'http://www.tasteline.com/recept/carinas-ostlada/',
  'http://www.tasteline.com/recept/fransk-potatissallad-med-brackt-kassler/',
  'http://www.tasteline.com/recept/asas-sallad/',
  'http://www.tasteline.com/recept/kottfarspiroger-med-smak-av-senapsfro-och-dill/',
  'http://www.tasteline.com/recept/kassler-med-teriyakismak/',
  'http://www.tasteline.com/recept/limesill/',
  'http://www.tasteline.com/recept/snabba-goda-restroran/',
  'http://www.tasteline.com/recept/medelhavspaj-med-tonfisk-och-sardeller/',
  'http://www.tasteline.com/recept/ugnsstekt-torsk-med-dillpesto/',
  'http://www.tasteline.com/recept/guldgul-fisksoppa/',
  'http://www.tasteline.com/recept/seranoskinka-med-roquefortost-och-flagad-mandel/',
  'http://www.tasteline.com/recept/belgisk-rabiff/',
  'http://www.tasteline.com/recept/supergod-sas-till-varmrokt-lax/',
  'http://www.tasteline.com/recept/jattefrasch-och-smal-raksallad/',
  'http://www.tasteline.com/recept/evas-vitlokssas/',
  'http://www.tasteline.com/recept/aggakaka-med-bacon-och-apple/',
  'http://www.tasteline.com/recept/pepparrotssill/',
  'http://www.tasteline.com/recept/skaldjurssallad-med-lime-och-koriander/',
  'http://www.tasteline.com/recept/stekta-applen-med-kanelmandelknack-och-vaniljglass/',
  'http://www.tasteline.com/recept/anders-heta-salsiccia-med-penne/',
  'http://www.tasteline.com/recept/apelsinsallad-med-feta/',
  'http://www.tasteline.com/recept/nyttigt-snacks/',
  'http://www.tasteline.com/recept/rivig-appelkaka/',
  'http://www.tasteline.com/recept/kottgryta-med-polenta/',
  'http://www.tasteline.com/recept/kottfarsgulasch-med-ryska-morotter/',
  'http://www.tasteline.com/recept/lasagne-med-spenat-och-getost/',
  'http://www.tasteline.com/recept/sas-med-feta/',
  'http://www.tasteline.com/recept/myntayoghurt/',
  'http://www.tasteline.com/recept/avokadorora-3-2/',
  'http://www.tasteline.com/recept/teriyakisas-2/',
  'http://www.tasteline.com/recept/basilikaolja/',
  'http://www.tasteline.com/recept/tomatsas-3-2/',
  'http://www.tasteline.com/recept/mild-grillmarinad/',
  'http://www.tasteline.com/recept/syrlig-och-frisk-grillmarinad/',
  'http://www.tasteline.com/recept/sot-och-salt-grillmarinad/',
  'http://www.tasteline.com/recept/stark-och-het-grillmarinad/',
  'http://www.tasteline.com/recept/kryddoftande-marinad/',
  'http://www.tasteline.com/recept/pasta-med-oliv-och-kronartskockspesto-2/',
  'http://www.tasteline.com/recept/kraft-och-fankalspaj/',
  'http://www.tasteline.com/recept/kyckling-vindalooh/',
  'http://www.tasteline.com/recept/mexikansk-biff-med-bonsallad/',
  'http://www.tasteline.com/recept/ljummen-pastasallad-med-smak-av-kardemumma-och-paron/',
  'http://www.tasteline.com/recept/flaskfile-med-basilikaolja/',
  'http://www.tasteline.com/recept/sherrykarre-i-stekpase/',
  'http://www.tasteline.com/recept/kalkon-med-rostad-pumpa/',
  'http://www.tasteline.com/recept/rotmos-med-skinka-och-saltkott/',
  'http://www.tasteline.com/recept/kalkonpasta/',
  'http://www.tasteline.com/recept/sparrissoppa-med-quesadilla/',
  'http://www.tasteline.com/recept/knaprig-tomatlada/',
  'http://www.tasteline.com/recept/apelsin-och-fankalssallad/',
  'http://www.tasteline.com/recept/laxpudding-4-2/',
  'http://www.tasteline.com/recept/texmex-soppa-med-osttak/',
  'http://www.tasteline.com/recept/rabiff-pa-flera-satt/',
  'http://www.tasteline.com/recept/vitvinswokad-kyckling/',
  'http://www.tasteline.com/recept/lax-med-apelsin-selleripure/',
  'http://www.tasteline.com/recept/vinbarsbiff/',
  'http://www.tasteline.com/recept/artsoppa-2/',
  'http://www.tasteline.com/recept/spenatris-med-kikartor/',
  'http://www.tasteline.com/recept/kyckling-i-cider/',
  'http://www.tasteline.com/recept/flaskpannkaka-4/',
  'http://www.tasteline.com/recept/texmex-lasagne/',
  'http://www.tasteline.com/recept/snabb-thaigryta/',
  'http://www.tasteline.com/recept/sportlovsmackor/',
  'http://www.tasteline.com/recept/kycklinglever-med-hallonsas-och-pinjenotter/',
  'http://www.tasteline.com/recept/lamm-med-korsbarstomater-och-oliver/',
  'http://www.tasteline.com/recept/paulus-pizza/',
  'http://www.tasteline.com/recept/kyckling-och-potatissoppa/',
  'http://www.tasteline.com/recept/musli-appelpaj/',
  'http://www.tasteline.com/recept/pastakuddar-med-ruccola-och-tomat/',
  'http://www.tasteline.com/recept/lady-och-lufsens-pasta/',
  'http://www.tasteline.com/recept/kraftstjartar-med-basilika-aioli/',
  'http://www.tasteline.com/recept/fisk-pa-knaprig-potatis/',
  'http://www.tasteline.com/recept/macaroni-and-cheese/',
  'http://www.tasteline.com/recept/kraft-och-kokossoppa/',
  'http://www.tasteline.com/recept/hemmagjorda-fiskpinnar-med-bostonsas/',
  'http://www.tasteline.com/recept/ris-med-bonor-och-tomat/',
  'http://www.tasteline.com/recept/bankad-kyckling/',
  'http://www.tasteline.com/recept/korvobonor/',
  'http://www.tasteline.com/recept/uppstickarparon/',
  'http://www.tasteline.com/recept/farsbiff-med-ajvar-ris/',
  'http://www.tasteline.com/recept/fankalssoppa-2/',
  'http://www.tasteline.com/recept/tonfisk-med-pasta/',
  'http://www.tasteline.com/recept/kyckling-under-tacket/',
  'http://www.tasteline.com/recept/couscous-wrap/',
  'http://www.tasteline.com/recept/gratinerad-getost-pa-rodbeta/',
  'http://www.tasteline.com/recept/rod-linssoppa-2/',
  'http://www.tasteline.com/recept/sydeuropeiska-agg/',
  'http://www.tasteline.com/recept/italiensk-rakmacka/',
  'http://www.tasteline.com/recept/gubbvaffla/',
  'http://www.tasteline.com/recept/texmexvaffla/',
  'http://www.tasteline.com/recept/italiensk-vaffla/',
  'http://www.tasteline.com/recept/rom-vaffla/',
  'http://www.tasteline.com/recept/enkel-vaffelsmet/',
  'http://www.tasteline.com/recept/frasigaste-vafflorna/',
  'http://www.tasteline.com/recept/sweet-chili-kyckling-2/',
  'http://www.tasteline.com/recept/firre-i-ortbuljong-med-smorkokta-wokgronsaker/',
  'http://www.tasteline.com/recept/kottfars-och-tacopaj/',
  'http://www.tasteline.com/recept/banankaka-13/',
  'http://www.tasteline.com/recept/rulle-med-fetarora-och-tapenade/',
  'http://www.tasteline.com/recept/omelettrulle-med-avokadosallad-och-rostade-mandlar/',
  'http://www.tasteline.com/recept/sallad-med-paron-och-brieflarn-med-honungsdressing/',
  'http://www.tasteline.com/recept/couscous-med-brynta-rotsaker-och-sas-pa-rostad-vitlok/',
  'http://www.tasteline.com/recept/kramig-jordartskockssoppa/',
  'http://www.tasteline.com/recept/pollo-tonnato-kyckling-med-tonfisksas/',
  'http://www.tasteline.com/recept/bruschetta-med-persiljesvamp-och-insalata-caprese/',
  'http://www.tasteline.com/recept/apelsinsallad-i-kryddig-lag/',
  'http://www.tasteline.com/recept/falska-gass-med-vasterbottengratinerad-selleri-och-potatispure/',
  'http://www.tasteline.com/recept/pasta-pesto/',
  'http://www.tasteline.com/recept/biffar-med-tacosmak-och-fruktsalsa/',
  'http://www.tasteline.com/recept/kycklingbullar-med-mustig-tomatsas/',
  'http://www.tasteline.com/recept/citron-och-lime-stilldrink/',
  'http://www.tasteline.com/recept/torsk-och-olivgryta/',
  'http://www.tasteline.com/recept/kyckling-och-crabfishwok-med-smak-av-jordnotter-och-lime/',
  'http://www.tasteline.com/recept/pasjka/',
  'http://www.tasteline.com/recept/flaskfile-puttanesca/',
  'http://www.tasteline.com/recept/paj-med-chevre-och-oliver/',
  'http://www.tasteline.com/recept/broccoli-och-ostsoppa/',
  'http://www.tasteline.com/recept/vitvinswokad-kyckling-2/',
  'http://www.tasteline.com/recept/lax-och-spenatfyllda-piroger-med-smal-bearnese/',
  'http://www.tasteline.com/recept/ostfondue-2/',
  'http://www.tasteline.com/recept/sukiyaki-japansk-fondue-2-2/',
  'http://www.tasteline.com/recept/gron-sas/',
  'http://www.tasteline.com/recept/pasta-med-hasselnotspesto/',
  'http://www.tasteline.com/recept/latt-bearnaise/',
  'http://www.tasteline.com/recept/rod-salsa/',
  'http://www.tasteline.com/recept/fondue-bourguignonne/',
  'http://www.tasteline.com/recept/fruktfondue/',
  'http://www.tasteline.com/recept/wasabimajo/',
  'http://www.tasteline.com/recept/thaisas-2/',
  'http://www.tasteline.com/recept/graddfil-med-orter/',
  'http://www.tasteline.com/recept/lammkotletter-i-apelsin-och-konjakssas/',
  'http://www.tasteline.com/recept/tonfisk-och-kikartsburgare/',
  'http://www.tasteline.com/recept/caesarsallad-2-2/',
  'http://www.tasteline.com/recept/choklad-och-hasselnotsrutor/',
  'http://www.tasteline.com/recept/vegetarisk-rotfruktsgratang/',
  'http://www.tasteline.com/recept/stor-grotfrukost/',
  'http://www.tasteline.com/recept/vafflor-med-rakkeso/',
  'http://www.tasteline.com/recept/thailandsk-kycklingcurry/',
  'http://www.tasteline.com/recept/korv-och-rotfruktslada/',
  'http://www.tasteline.com/recept/lyxig-hallon-och-fladersmoothie/',
  'http://www.tasteline.com/recept/saffransrisotto-med-rimmad-torsk/',
  'http://www.tasteline.com/recept/stromming-pa-fullkornsbrod-med-hovmastarsas/',
  'http://www.tasteline.com/recept/katrinplommon-och-flaskkarregryta/',
  'http://www.tasteline.com/recept/sweet-chilinudlar/',
  'http://www.tasteline.com/recept/kycklingpasta-med-feta-2/',
  'http://www.tasteline.com/recept/tortellinisoppa/',
  'http://www.tasteline.com/recept/laxpudding-3/',
  'http://www.tasteline.com/recept/torskbiffar-med-lime-och-pepparrotssas/',
  'http://www.tasteline.com/recept/kycklinglimpa-med-svartrot/',
  'http://www.tasteline.com/recept/messmors-och-syltmacka/',
  'http://www.tasteline.com/recept/getost-pa-rodbeta/',
  'http://www.tasteline.com/recept/rotfruktslasagne-2/',
  'http://www.tasteline.com/recept/gratinerade-ostron/',
  'http://www.tasteline.com/recept/sparris-med-parmaskinka/',
  'http://www.tasteline.com/recept/quorn-i-yoghurtmarinad/',
  'http://www.tasteline.com/recept/roding-med-grovrivet/',
  'http://www.tasteline.com/recept/krabbcocktail-2/',
  'http://www.tasteline.com/recept/konjak-och-ingefarste/',
  'http://www.tasteline.com/recept/semlor-fran-viktklubben/',
  'http://www.tasteline.com/recept/fetaostbiffar-med-grekisk-potatissallad/',
  'http://www.tasteline.com/recept/sherrymarinerad-kyckling-med-limesas/',
  'http://www.tasteline.com/recept/citrontorsk-i-traktorpanna/',
  'http://www.tasteline.com/recept/kyckling-med-gurksallad/',
  'http://www.tasteline.com/recept/gratang-a-la-george-bush-senior/',
  'http://www.tasteline.com/recept/bakad-potatis-med-skaldjur/',
  'http://www.tasteline.com/recept/ugnsstekta-saker-med-pepparrotssas/',
  'http://www.tasteline.com/recept/bulgursallad-3/',
  'http://www.tasteline.com/recept/hoki-med-rodvinssas/',
  'http://www.tasteline.com/recept/huevos-rancheros-mexarfrukost/',
  'http://www.tasteline.com/recept/citronlax/',
  'http://www.tasteline.com/recept/kyckling-med-morotslada/',
  'http://www.tasteline.com/recept/ugnsstekta-applen/',
  'http://www.tasteline.com/recept/grillade-havspaket/',
  'http://www.tasteline.com/recept/rodbetssoppa-med-chevrekram/',
  'http://www.tasteline.com/recept/alltiallofisk/',
  'http://www.tasteline.com/recept/texmexspjall/',
  'http://www.tasteline.com/recept/musselspett-med-linssallad/',
  'http://www.tasteline.com/recept/fyllda-tomater-2/',
  'http://www.tasteline.com/recept/kryddig-lammpita/',
  'http://www.tasteline.com/recept/vildfras/',
  'http://www.tasteline.com/recept/potatissallad-med-kyckling/',
  'http://www.tasteline.com/recept/ris-med-currypinnar/',
  'http://www.tasteline.com/recept/fru-sjomans-musslor/',
  'http://www.tasteline.com/recept/tyrolerkotletter/',
  'http://www.tasteline.com/recept/bakad-potatis-med-majs/',
  'http://www.tasteline.com/recept/laxpasta-3/',
  'http://www.tasteline.com/recept/kalles-lammfars-med-halloumi/',
  'http://www.tasteline.com/recept/kokosrakor/',
  'http://www.tasteline.com/recept/algstek-med-potatisstrimlor/',
  'http://www.tasteline.com/recept/hulkburgare/',
  'http://www.tasteline.com/recept/strommingslada-3/',
  'http://www.tasteline.com/recept/linser-med-spenat/',
  'http://www.tasteline.com/recept/ostpaj-med-paron-och-valnotssallad/',
  'http://www.tasteline.com/recept/laxtartar-2/',
  'http://www.tasteline.com/recept/rostbiff-med-karl-johan/',
  'http://www.tasteline.com/recept/kokosapplen-2/',
  'http://www.tasteline.com/recept/algbullar-med-lingon/',
  'http://www.tasteline.com/recept/kalkon-med-valnotssas/',
  'http://www.tasteline.com/recept/libanesisk-sallad/',
  'http://www.tasteline.com/recept/lax-och-krabburgare/',
  'http://www.tasteline.com/recept/kassler-med-applen-och-plommon/',
  'http://www.tasteline.com/recept/flaskfile-med-kantareller-2-2/',
  'http://www.tasteline.com/recept/gos-med-wasabimajonnas/',
  'http://www.tasteline.com/recept/hannas-hallonmarang/',
  'http://www.tasteline.com/recept/mikrad-fisk-med-svart-smor/',
  'http://www.tasteline.com/recept/heta-och-spanska-rakor/',
  'http://www.tasteline.com/recept/skinka-med-spenat/',
  'http://www.tasteline.com/recept/semifreddo-2-2/',
  'http://www.tasteline.com/recept/mina-indiska-rotter/',
  'http://www.tasteline.com/recept/smarrig-kottfarssas-2/',
  'http://www.tasteline.com/recept/kalpudding-med-sirapssas/',
  'http://www.tasteline.com/recept/strimlad-biff-med-vattenkastanjer/',
  'http://www.tasteline.com/recept/soppa-med-trattisar-och-renstek/',
  'http://www.tasteline.com/recept/kyckling-med-fankal/',
  'http://www.tasteline.com/recept/robins-kycklinglasagne/',
  'http://www.tasteline.com/recept/uppsalakaka/',
  'http://www.tasteline.com/recept/purjo-och-potatissoppa-2/',
  'http://www.tasteline.com/recept/osso-fusco/',
  'http://www.tasteline.com/recept/sojastekt-lax-med-svart-trumpet/',
  'http://www.tasteline.com/recept/pasta-med-renskav-och-svamp/',
  'http://www.tasteline.com/recept/rodbetsburgare/',
  'http://www.tasteline.com/recept/korv-med-senapsmos/',
  'http://www.tasteline.com/recept/tiramisu-3-2/',
  'http://www.tasteline.com/recept/vartefter-soppa/',
  'http://www.tasteline.com/recept/spatta-med-mos/',
  'http://www.tasteline.com/recept/loklada-med-halloumi-och-chokladquorn/',
  'http://www.tasteline.com/recept/kinakal-nastan-som-i-kina/',
  'http://www.tasteline.com/recept/kryddkyckling-med-selleritomater/',
  'http://www.tasteline.com/recept/laxmacka/',
  'http://www.tasteline.com/recept/anna-lenas-blomkal/',
  'http://www.tasteline.com/recept/violas-falulada/',
  'http://www.tasteline.com/recept/rod-mojo-med-lammentrecote/',
  'http://www.tasteline.com/recept/anettes-pastasoppa/',
  'http://www.tasteline.com/recept/ann-britts-laxfile/',
  'http://www.tasteline.com/recept/bon-och-tonfisksallad-2/',
  'http://www.tasteline.com/recept/pannbiff-med-lok/',
  'http://www.tasteline.com/recept/asiatisk-fisksoppa-2/',
  'http://www.tasteline.com/recept/potatisgratang-3/',
  'http://www.tasteline.com/recept/biffgryta-fran-medelhavstrakten/',
  'http://www.tasteline.com/recept/rarakor-3-2/',
  'http://www.tasteline.com/recept/saffranspasta-med-rodbetor/',
  'http://www.tasteline.com/recept/sjomansbiff-4/',
  'http://www.tasteline.com/recept/ostris-med-varmrokt-lax/',
  'http://www.tasteline.com/recept/pasta-alle-vongole/',
  'http://www.tasteline.com/recept/flaskfile-med-champinjontacke-och-lattkokt-isbergssallad/',
  'http://www.tasteline.com/recept/uppiffade-nudlar/',
  'http://www.tasteline.com/recept/isterband-och-linser-med-rostad-lok/',
  'http://www.tasteline.com/recept/fisk-med-kaviarpotatis/',
  'http://www.tasteline.com/recept/morotter-med-apelsin-och-kyckling/',
  'http://www.tasteline.com/recept/stekt-njure-i-senapssas-med-artor/',
  'http://www.tasteline.com/recept/kyckling-med-bakad-smapotatis/',
  'http://www.tasteline.com/recept/stek-i-rodvin/',
  'http://www.tasteline.com/recept/spenatsoppa-3-2/',
  'http://www.tasteline.com/recept/skocksallad-med-rakor/',
  'http://www.tasteline.com/recept/recond-sill/',
  'http://www.tasteline.com/recept/skinkpytt/',
  'http://www.tasteline.com/recept/spjallets-sista-strid/',
  'http://www.tasteline.com/recept/dadelpaj-med-apelsinfrasch/',
  'http://www.tasteline.com/recept/ansjovisburken-gud-glomde-ansjovis-vinaigrette/',
  'http://www.tasteline.com/recept/trepepparlax-med-potatismos/',
  'http://www.tasteline.com/recept/biffar-med-kantarellgratang-och-broccolipure/',
  'http://www.tasteline.com/recept/bonsoppa/',
  'http://www.tasteline.com/recept/spatta-med-raksas/',
  'http://www.tasteline.com/recept/potatismos-med-stekflask-och-broccolirora/',
  'http://www.tasteline.com/recept/calamari-med-limedip/',
  'http://www.tasteline.com/recept/rostbiff-med-potatissallad/',
  'http://www.tasteline.com/recept/vintersallad-med-rostbiff-apple-och-pepparrot/',
  'http://www.tasteline.com/recept/roda-bonor-med-flask/',
  'http://www.tasteline.com/recept/eftermarinerad-fisk/',
  'http://www.tasteline.com/recept/spett-med-jordnotssas/',
  'http://www.tasteline.com/recept/swiss-i-glas/',
  'http://www.tasteline.com/recept/kikartsgryta-med-curry-3/',
  'http://www.tasteline.com/recept/kyckling-med-vitlokssas/',
  'http://www.tasteline.com/recept/tomatsoppa-i-full-fart/',
  'http://www.tasteline.com/recept/lamm-med-linser/',
  'http://www.tasteline.com/recept/fattee/',
  'http://www.tasteline.com/recept/snabb-oliv-och-ansjovispizza/',
  'http://www.tasteline.com/recept/fylld-lovbiff-pa-gronsaksbadd-med-tryffelmos/',
  'http://www.tasteline.com/recept/indisk-tonfiskgryta/',
  'http://www.tasteline.com/recept/glass-med-3-saser/',
  'http://www.tasteline.com/recept/saffranspannkaka-2/',
  'http://www.tasteline.com/recept/broccoli-och-vitlokssoppa/',
  'http://www.tasteline.com/recept/lax-i-apelsin-och-rosmarinsas/',
  'http://www.tasteline.com/recept/risotto-med-sparris-och-pecorino/',
  'http://www.tasteline.com/recept/tomatfyllda-skinkrullader-med-rotfruktsgratang/',
  'http://www.tasteline.com/recept/asas-brunostmacka/',
  'http://www.tasteline.com/recept/kottgryta-med-svenska-smaker/',
  'http://www.tasteline.com/recept/enkel-tomatsallad/',
  'http://www.tasteline.com/recept/revbensspjall-med-smak-av-apelsin-och-ingefara/',
  'http://www.tasteline.com/recept/rodkalsfras/',
  'http://www.tasteline.com/recept/laxtartar-med-raka-och-rom/',
  'http://www.tasteline.com/recept/gronsaker-med-gronkalspesto/',
  'http://www.tasteline.com/recept/enbars-och-konjakssill/',
  'http://www.tasteline.com/recept/kycklingspett-med-vitkalsyoghurt/',
  'http://www.tasteline.com/recept/creme-caramel-med-stjarnanis-och-mangopure/',
  'http://www.tasteline.com/recept/lackat-ankbrost-med-wokade-gronsaker/',
  'http://www.tasteline.com/recept/ra-tonfisk-med-thaidressing/',
  'http://www.tasteline.com/recept/sorbet-med-mandelflarn-och-frukt/',
  'http://www.tasteline.com/recept/renfile-med-rotsakstrassel/',
  'http://www.tasteline.com/recept/potatiscarpaccio-med-lojrom-och-rakor/',
  'http://www.tasteline.com/recept/skaldjursmeny/',
  'http://www.tasteline.com/recept/kobe-mandlar/',
  'http://www.tasteline.com/recept/fetaost-och-oliver/',
  'http://www.tasteline.com/recept/smala-kardemummascones/',
  'http://www.tasteline.com/recept/appelkaka-med-kardemummakram/',
  'http://www.tasteline.com/recept/appel-och-chevrebruschetta/',
  'http://www.tasteline.com/recept/kristinas-klyftpotatis/',
  'http://www.tasteline.com/recept/sondagsstek-med-blomkalspure/',
  'http://www.tasteline.com/recept/bon-och-tonfisksallad-2-2/',
  'http://www.tasteline.com/recept/hannas-hallonhit/',
  'http://www.tasteline.com/recept/lingonstrutar/',
  'http://www.tasteline.com/recept/lingonparon-2-2/',
  'http://www.tasteline.com/recept/pepparkaks-muffins-pa-mix/',
  'http://www.tasteline.com/recept/klassisk-jansson/',
  'http://www.tasteline.com/recept/minipizzor-med-skinka/',
  'http://www.tasteline.com/recept/apelsinskal-i-choklad/',
  'http://www.tasteline.com/recept/hasselnotsfudge/',
  'http://www.tasteline.com/recept/chokladplattor/',
  'http://www.tasteline.com/recept/juldadlar/',
  'http://www.tasteline.com/recept/pepparmintskyssar/',
  'http://www.tasteline.com/recept/kaffetryfflar/',
  'http://www.tasteline.com/recept/mandelmandariner/',
  'http://www.tasteline.com/recept/nissarnas-notkakor/',
  'http://www.tasteline.com/recept/ingefarskakor/',
  'http://www.tasteline.com/recept/mimmis-jitterbuggar/',
  'http://www.tasteline.com/recept/uppakrakakor/',
  'http://www.tasteline.com/recept/chokladdrommar-2/',
  'http://www.tasteline.com/recept/sota-spjall/',
  'http://www.tasteline.com/recept/apelsinspjall/',
  'http://www.tasteline.com/recept/avokadorora-4-2/',
  'http://www.tasteline.com/recept/tomat-och-paprikarora/',
  'http://www.tasteline.com/recept/heta-spjall/',
  'http://www.tasteline.com/recept/spjall-med-ingefarsglaze/',
  'http://www.tasteline.com/recept/asas-julkottbullar/',
  'http://www.tasteline.com/recept/russinbullar-2/',
  'http://www.tasteline.com/recept/lammbullar-med-mandelsas/',
  'http://www.tasteline.com/recept/rostbiff-2/',
  'http://www.tasteline.com/recept/gammaldags-kryddskinka-2/',
  'http://www.tasteline.com/recept/kalkonstek/',
  'http://www.tasteline.com/recept/julskinka-2-2/',
  'http://www.tasteline.com/recept/mor-ullas-pressylta/',
  'http://www.tasteline.com/recept/snabb-favoritkal/',
  'http://www.tasteline.com/recept/rodkal-3-2/',
  'http://www.tasteline.com/recept/svampknyten/',
  'http://www.tasteline.com/recept/tomat-och-parmesanflarn/',
  'http://www.tasteline.com/recept/fankals-och-apelsinsallad-2/',
  'http://www.tasteline.com/recept/vita-bonor-med-rodlok/',
  'http://www.tasteline.com/recept/het-laxtartar-med-chili-och-koriander/',
  'http://www.tasteline.com/recept/gravlax-med-enbarssmak/',
  'http://www.tasteline.com/recept/ugnsbakad-lax-2/',
];

firebase.auth().signInAnonymously().catch((error) => {
  // Handle Errors here.
  const errorCode = error.code;
  const errorMessage = error.message;
  // ...
});
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // firebase.database().ref('recipes').remove();
    // firebase.database().ref('foods').remove();
    // firebase.database().ref('tags').remove();

    recipesRef.once('value', (snapshot) => {
      snapshot.forEach((child) => {
        existingRecipes.push(child.val());
      });
      recipeLoaded = true;
      if (foodLoaded && recipeLoaded) {
        createRecipes();
      }
    });

    foodRef.orderByChild('uses').once('value', (snapshot) => {
      snapshot.forEach((child) => {
        existingFoods.splice(0, 0, child.val().name);
      });
      foodLoaded = true;
      if (foodLoaded && recipeLoaded) {
        createRecipes();
      }
    });
    console.log('LOGGED IN');
  }
});
// börja med tasteline all the way.
// antingen skriv receptet till firebase efter varje scrape eller gör det i batches eller allt i slutet. SE TILL ATT KÖRA MOT DEV OM INGET DEV ELLER PROD ARG ÖR MED SÅ AVSLUTA

// snygga till tastelinescriptet
// lägg till bildsource från tasteline,
// lägg till ica, koket, mittkok

// lägg till några quickimport parametrar "node recipeScraper.js dev tasteline_new" ska hämta veckans senaste/eller senaste sen senaste körningen av senaste :)) spara det värdet i firebase? ett nytt träd för import?
// kanske körs i två steg där en fil populeras och man kan se sources innan man väljer att faktiskt köpra importen.
function createRecipes() {
  (async () => {
    console.log('starting createRecipes');
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const len = sources.length;
    for (let index = 0; index < len; index++) {
      const source = sources[index];
      await page.goto(source);
      let recipe = {};
      if (source.includes('tasteline.com')) {
        recipe = await page.evaluate(() => {
          if (!document.querySelector('.page-content .recipe-content')) {
            return {};
          }
          const result = {};
          // title
          result.title = document.querySelector('.page-content .recipe-description h1').innerHTML.trim();
          // tags
          const tags = {};
          // cannot read property length of null
          const tagElements = document.querySelectorAll('.page-content .recipe-description .category-list a');
          for (const tag of tagElements) {
            const t = tag.text;
            tags[t.charAt(0).toUpperCase() + t.slice(1).replace(/\s*\([^()]*\)/g, '').split(',')[0].replace(/([/.#$])/g, '').trim()] = true;
          }

          result.tags = tags;
          // source
          result.source = window.location.href;
          result.source = result.source.substr(result.source.indexOf('tasteline.com'));

          // votes rating
          if (document.querySelector('.page-content .recipe-description .recipe-rating.voting-enabled i')) {
            const ratingLine = document.querySelector('.page-content .recipe-description .recipe-rating.voting-enabled').getAttribute('title');
            const parts = ratingLine.split('Antal röster:');
            result.votes = parts[1].trim();
            result.rating = parts[0].split(':')[1].trim();
          }
          // author
          if (document.querySelector('.page-content .recipe-author-text-inner span')) {
            result.author = document.querySelector('.page-content .recipe-author-text-inner span').innerText.trim();
          } else {
            result.author = 'tasteline';
          }

          // portions
          if (document.querySelector('.page-content .recipe-content .portions option[selected]')) {
            result.portions = document.querySelector('.page-content .recipe-content .portions option[selected]').innerHTML.trim();

            // generall portion parser
            if (result.portions.toUpperCase().startsWith('GER ')) {
              result.portions = result.portions.substr(4);
            }
            if (result.portions.toUpperCase().startsWith('CA ')) {
              result.portions = result.portions.substr(3);
            }
            const spaceArr = result.portions.split(' ');
            if (spaceArr.length === 2 && !isNaN(spaceArr[0]) && spaceArr[1].toUpperCase() === 'PORTIONER') {
              const portions = spaceArr[0];
              result.portions = portions;
            }
            result.portions = result.portions.replace(',', '.');
            if (result.portions.indexOf('1/2') > -1) {
              result.portions = result.portions.replace('1/2', '+.5');
              const parts = result.portions.split(' ');
              if (!isNaN(parts[0]) && !isNaN(parts[1])) {
                const nr = eval(parts[0] + parts[1]);
                result.portions = nr + result.portions.substr(parts[0].length + parts[1].length + 1);
              } else if (!isNaN(parts[0])) {
                const nr = eval(parts[0]);
                result.portions = nr + result.portions.substr(parts[0].length);
              } else {
                result.portions = result.portions.replace('+.5', '1/2');
              }
            }
            const firstString = result.portions.split(' ')[0];
            const seperateArray = firstString.split(/([0-9]+)/).filter(Boolean);
            if (seperateArray[1] === '-' && seperateArray.length === 4) {
              const newFirstString = `${seperateArray[0] + seperateArray[1] + seperateArray[2]} ${seperateArray[3]}`;
              result.portions = newFirstString + result.portions.substr(firstString.length);
            } else if (seperateArray.length === 2) {
              const newFirstString = `${seperateArray[0]} ${seperateArray[1]}`;
              result.portions = newFirstString + result.portions.substr(firstString.length);
            }

            if (result.portions.toUpperCase().startsWith('GER ')) {
              result.portions = result.portions.substr(4);
            }
            if (result.portions.toUpperCase().startsWith('CA ')) {
              result.portions = result.portions.substr(3);
            }
            const parts = result.portions.split(' ')[0].split('-');
            if (parts.length === 2) {
              let tmp = ((parts[0] - 0) + (parts[1] - 0)) / 2;
              if (result.portions.split(' ').length > 1) {
                tmp += result.portions.substr(result.portions.indexOf(result.portions.split(' ')[1]) - 1);
              }
              result.portions = tmp;
            }
          }

          // description
          if (document.querySelector('.page-content .recipe-ingress')) {
            result.description = document.querySelector('.page-content .recipe-ingress').innerHTML.replace(/(\r\n|\n|\r|<[^>]*>)/gm, '').replace(/  +/g, ' ').trim();
          }

          // time
          if (document.querySelector('.page-content .recipe-description .fa-clock-o')) {
            const timeString = document.querySelector('.page-content .recipe-description .fa-clock-o').nextSibling.nodeValue.trim();
            if (timeString.indexOf('minut') > -1) {
              result.time = timeString.split(' ')[0] - 0;
            } else if (timeString.indexOf('timm') > -1) {
              result.time = (timeString.split(' ')[0] - 0) * 60;
            } else {
              return {};
            }
            if (result.time < 25) {
              if (!tags.Snabbt) {
                tags.Snabbt = true;
              }
            }
          }
          if (document.querySelector('.page-content .ingredient-group li')) {
            const ingredientgroups = document.querySelector('.page-content').getElementsByClassName('ingredient-group');
            const ingredients = [];
            const ingredientNames = [];
            for (let i = 0; i < ingredientgroups.length; i++) {
              const ingredientsDom = ingredientgroups[i].getElementsByTagName('li');
              for (let j = 0; j < ingredientsDom.length; ++j) {
                const ingredient = {};
                const amountElement = ingredientsDom[j].getElementsByClassName('quantity')[0];
                if (!amountElement.classList.contains('hidden')) {
                  ingredient.amount = amountElement.getAttribute('data-quantity');
                }
                const unitElement = ingredientsDom[j].getElementsByClassName('unit')[0];
                if (!unitElement.classList.contains('hidden')) {
                  ingredient.unit = unitElement.getAttribute('data-unit-name');
                }
                if (!ingredientsDom[j].getElementsByClassName('ingredient')[0]) {
                  return {};
                }
                const namepart = ingredientsDom[j].getElementsByClassName('ingredient')[0].getElementsByTagName('span')[0].innerHTML.trim();
                ingredient.name = namepart.charAt(0).toUpperCase() + namepart.slice(1).replace(/\s*\([^()]*\)/g, '').split(',')[0].replace(/([/.#$])/g, '').trim();
                if (ingredientNames.indexOf(ingredient.name) > -1) {
                  continue;
                }
                ingredientNames.push(ingredient.name);
                ingredients.push(ingredient);
              }
            }
            result.ingredients = ingredients;
          }
          if (document.querySelector('.recipe-header-image img')) {
            if (document.querySelector('.recipe-header-image img').getAttribute('src')) {
              const img = document.querySelector('.recipe-header-image img');
              result.image = img.getAttribute('src');
              const imageSize = `${img.naturalWidth}W x ${img.naturalHeight}H`;
              result.imageSize = imageSize;
              // hur kan jag kolla storleken på bilden?
              // inte hur stor den är på sidan utan hur stor orginalbilden i bildkällan är.
              // logga alla olika storlekar med t.ex: 1250x200 - recipe.image
            }
          }

          if (!result.ingredients || result.ingredients.length === 0 || (result.time && result.time < 1)) {
            return {};
          }

          // difficulty
          const instructionsList = document.querySelector('.page-content .recipe-content .steps').getElementsByTagName('li');
          const nrOfIngredients = result.ingredients.length;
          let instructionLength = 0;
          for (let i = 0; i < instructionsList.length; i++) {
            instructionLength += instructionsList[i].innerHTML.replace(/(\r\n|\n|\r|)/gm, '').trim().length;
          }
          instructionLength -= instructionsList.length * 10;

          let levelIndex = (nrOfIngredients * 8) + (instructionLength / 14);
          if (result.tags.Enkelt || result.tags['Lättlagat']) {
            levelIndex -= 100;
          }
          if (result.tags.Snabbt) {
            levelIndex -= 20;
          }

          if (levelIndex < 100) {
            result.level = 1;
          } else if (levelIndex < 200) {
            result.level = 2;
          } else {
            result.level = 3;
          }
          return result;
        });
      } else {
        console.log(`error on:${source}`);
      }

      log.push(`IMGSIZE: ${recipe.imageSize} - ${recipe.img}`);
      if (!imageSizes.includes(recipe.imageSize)) {
        imageSizes.push(recipe.imageSize);
      }
      if (recipe.imageSize) {
        delete recipe.imageSize;
      }
      const msg = validateRecipe(recipe);
      if (msg.cause.length > 0) {
        log.push(msg);
        continue;
      }
      recipe = cleanRecipe(recipe);

      const existingRecipe = existingRecipes.find(er => er.source === recipe.source);
      if (existingRecipe) {
        recipesRef.orderByChild('source').equalTo(existingRecipe.source).once('value', (snapshot) => {
          snapshot.forEach((child) => {
            recipesRef.child(child.key).update(recipe);
          });
        });
        nrOfRecipesUpdated += 1;
      } else {
        recipesRef.push(recipe);
        nrOfRecipesCreated += 1;
        existingRecipes.push(recipe);
      }
      final.push(recipe);
      console.log(`progress:${index} ( ${Math.floor((index / len) * 100)}% )`);
    }
    await browser.close();

    log.push(`input nr: ${sources.length}`);
    log.push(`created recipes: ${nrOfRecipesCreated}`);
    log.push(`updated recipes: ${nrOfRecipesUpdated}`);
    log.push(`imagesizeList: ${imageSizes}`);
    console.log(`created recipes: ${nrOfRecipesCreated}`);
    console.log(`Updated recipes: ${nrOfRecipesUpdated}`);


    fs.writeFile(`C:/dev/${filename}-LOG.json`, JSON.stringify(log), (err) => {
      if (err) {
        return console.log(err);
      }
      log.push('logfile saved!');
      return console.log('saved logfile');
    });
    fs.writeFile(`C:/dev/ettkilomjol resources/${filename}.json`, JSON.stringify(final), (err) => {
      if (err) {
        return console.log(err);
      }
      log.push('backup saved!');
      return console.log('saved backup');
    });
    const baseDelay = 5000 + sources.length;
    setTimeout(importUtil.changeName.bind(null, params), baseDelay);
    setTimeout(importUtil.fixFaultyIngredients.bind(null, params), baseDelay + 5000);
    setTimeout(importUtil.recountUsage, baseDelay + 10000);
  })();
}

function cleanRecipe(recipe_) {
  const recipe = recipe_;
  if (recipe.title.indexOf('&amp;') > -1) {
    recipe.title = recipe.title.replace(/&amp;/g, '&');
    // lägg tilll /g så det blir replace all
    // fortsätt kollla på recplace i andra scripts
  }
  for (let h = 0; h < recipe.ingredients.length; h++) {
    if (recipe.ingredients[h].unit && recipe.ingredients[h].unit.trim() == '') {
      delete recipe.ingredients[h].unit;
    }
    if (recipe.ingredients[h].amount && recipe.ingredients[h].amount.trim() == '') {
      delete recipe.ingredients[h].amount;
    }
    if (recipe.ingredients[h].amount && isNaN(recipe.ingredients[h].amount)) {
      recipe.ingredients[h].amount = recipe.ingredients[h].amount.replace(',/g', '.');
    }
  }
  // time temporary
  recipe.ingredients = checkGrammar(recipe.ingredients);
  return recipe;
}

function validateRecipe(recipe) {
  const msg = { recipeSrc: '', cause: '' };
  if (!recipe) {
    msg.cause = 'recipe is null';
    return msg;
  }
  msg.recipeSrc = recipe.source;
  let invalidIngredients = 0;
  for (let i = 0; i < recipe.ingredients.length; i++) {
    if (!validateIngredient(recipe.ingredients[i])) {
      invalidIngredients += 1;
    }
    if (recipe.ingredients[i].name.indexOf('½') > -1) {
      invalidIngredients += 2;
    }
  }
  if ((recipe.ingredients.length / invalidIngredients) < 6) {
    msg.cause = 'recipe contains to many wierd ingredients';
    return msg;
  }
  if (!recipe.votes || (recipe.votes && recipe.votes < 1)) {
    msg.cause = 'recipe has less than 3 votes';
    return msg;
  }
  for (let i = 0; i < recipe.ingredients.length; i++) {
    if (recipe.ingredients[i].name === 'Förp') {
      msg.cause = `recipe has faulty ingredient name:${recipe.ingredients.name}`;
      return msg;
    }
  }


  // recept med många konstiga ingredienser (långa namn, siffror i namn, specialtecken i namn,)
  return msg;
  // fortsätt med mer validering.
}

function validateIngredient(ingredient) {
  const nameLength = ingredient.name.length;
  const nameWordCount = ingredient.name.split(' ').length;
  const nameSpecialChars = ingredient.name.match(/^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/);
  const containsNumbers = /\d/.test(ingredient.name);
  if (nameLength > 30 || nameLength < 1) {
    return false;
  }
  if (nameWordCount > 2) {
    return false;
  }
  if (nameSpecialChars && nameSpecialChars.length > 0) {
    return false;
  }
  if (containsNumbers) {
    return false;
  }
  return true;
}
function checkGrammar(ingredients_) {
  const ingredients = ingredients_;
  for (let i = 0; i < ingredients.length; i++) {
    const { name } = ingredients[i];
    const lastTwo = name.slice(-2);
    if (lastTwo === 'or') {
      const singular = `${name.slice(0, -2)}a`;
      if (existingFoods.indexOf(singular) > -1) {
        log.push(`changed grammar from:${ingredients[i].name} to:${singular}`);
        ingredients[i].name = singular;
        continue;
      }
    } else if (lastTwo === 'ar') {
      let singular = `${name.slice(0, -2)}e`;
      if (existingFoods.indexOf(singular) > -1) {
        log.push(`changed grammar from:${ingredients[i].name} to:${singular}`);
        ingredients[i].name = singular;
        continue;
      }
      singular = name.slice(0, -2);
      if (existingFoods.indexOf(singular) > -1) {
        log.push(`changed grammar from:${ingredients[i].name} to:${singular}`);
        ingredients[i].name = singular;
        continue;
      }
      singular = `${name.slice(0, -3)}el`;
      if (existingFoods.indexOf(singular) > -1) {
        log.push(`changed grammar from:${ingredients[i].name} to:${singular}`);
        ingredients[i].name = singular;
        continue;
      }
    } else if (lastTwo === 'er') {
      let singular = name.slice(0, -2);
      if (existingFoods.indexOf(singular) > -1) {
        log.push(`changed grammar from:${ingredients[i].name} to:${singular}`);
        ingredients[i].name = singular;
        continue;
      }
      singular = name.slice(0, -1);
      if (existingFoods.indexOf(singular) > -1) {
        log.push(`changed grammar from:${ingredients[i].name} to:${singular}`);
        ingredients[i].name = singular;
        continue;
      }
    } else if (lastTwo.slice(-1) === 'n') {
      const singular = name.slice(0, -1);
      if (existingFoods.indexOf(singular) > -1) {
        log.push(`changed grammar from:${ingredients[i].name} to:${singular}`);
        ingredients[i].name = singular;
        continue;
      }
    }
  }
  return ingredients;
}
/*
//attempt at runing parallel scraping
function runParalellScraping() {
  const promises = [];
  for (let i = 0; i < sources.length; i++) {
    const promise = async function bar() {
      await new Promise(r => setTimeout(r, 1000))
        .then(() => createRecipe(sources[i]));
    };

    promises.push(promise);
  }

  Promise.all(promises).then((values) => {
    log.push(`input nr: ${sources.length}`);
    log.push(`created recipes: ${nrOfRecipesCreated}`);
    log.push(`updated recipes: ${nrOfRecipesUpdated}`);

    console.log(`created recipes: ${nrOfRecipesCreated}`);
    console.log(`Updated recipes: ${nrOfRecipesUpdated}`);

    console.log('success!');

    fs.writeFile(`C:/dev/ettkilomjol resources/${filename}-LOG.json`, JSON.stringify(log), (err) => {
      if (err) {
        return console.log(err);
      }
      log.push('logfile saved!');
      return console.log('saved logfile');
    });
    fs.writeFile(`C:/dev/ettkilomjol resources/${filename}.json`, JSON.stringify(final), (err) => {
      if (err) {
        return console.log(err);
      }
      log.push('backup saved!');
      return console.log('saved backup');
    });
  });
}

function createRecipe(source) {
  (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(source);
    let recipe = {};
    if (source.includes('tasteline.com')) {
      recipe = await page.evaluate(() => {
        if (!document.querySelector('.page-content .recipe-content')) {
          return;
        }
        const result = {};
        // title
        result.title = document.querySelector('.page-content .recipe-description h1').innerHTML.trim();
        // tags
        const tags = {};
        // cannot read property length of null
        const tagElements = document.querySelectorAll('.page-content .recipe-description .category-list a');
        for (const tag of tagElements) {
          const t = tag.text;
          tags[t.charAt(0).toUpperCase() + t.slice(1).replace(/\s*\([^()]*\)/g, '').split(',')[0].replace(/([/.#$])/g, '').trim()] = true;
        }

        result.tags = tags;
        // source
        result.source = window.location.href;
        result.source = result.source.substr(result.source.indexOf('tasteline.com'));


        // votes rating
        if (document.querySelector('.page-content .recipe-description .recipe-rating.voting-enabled i')) {
          const ratingLine = document.querySelector('.page-content .recipe-description .recipe-rating.voting-enabled').getAttribute('title');
          const parts = ratingLine.split('Antal röster:');
          result.votes = parts[1].trim();
          result.rating = parts[0].split(':')[1].trim();
        }
        // author
        if (document.querySelector('.page-content .recipe-author-text-inner span')) {
          result.author = document.querySelector('.page-content .recipe-author-text-inner span').innerText.trim();
        } else {
          result.author = 'tasteline';
        }

        // createdFor

        // portions
        if (document.querySelector('.page-content .recipe-content .portions option[selected]')) {
          result.portions = document.querySelector('.page-content .recipe-content .portions option[selected]').innerHTML.trim();

          // generall portion parser
          if (result.portions.toUpperCase().startsWith('GER ')) {
            result.portions = result.portions.substr(4);
          }
          if (result.portions.toUpperCase().startsWith('CA ')) {
            result.portions = result.portions.substr(3);
          }
          const spaceArr = result.portions.split(' ');
          if (spaceArr.length === 2 && !isNaN(spaceArr[0]) && spaceArr[1].toUpperCase() === 'PORTIONER') {
            result.portions = spaceArr[0];
          }
          result.portions = result.portions.replace(',', '.');
          if (result.portions.indexOf('1/2') > -1) {
            result.portions = result.portions.replace('1/2', '+.5');
            const parts = result.portions.split(' ');
            if (!isNaN(parts[0]) && !isNaN(parts[1])) {
              const nr = eval(parts[0] + parts[1]);
              result.portions = nr + result.portions.substr(parts[0].length + parts[1].length + 1);
            } else if (!isNaN(parts[0])) {
              const nr = eval(parts[0]);
              result.portions = nr + result.portions.substr(parts[0].length);
            } else {
              result.portions = result.portions.replace('+.5', '1/2');
            }
          }
          const firstString = result.portions.split(' ')[0];
          const seperateArray = firstString.split(/([0-9]+)/).filter(Boolean);
          if (seperateArray[1] === '-' && seperateArray.length === 4) {
            const newFirstString = `${seperateArray[0] + seperateArray[1] + seperateArray[2]} ${seperateArray[3]}`;
            result.portions = newFirstString + result.portions.substr(firstString.length);
          } else if (seperateArray.length === 2) {
            const newFirstString = `${seperateArray[0]} ${seperateArray[1]}`;
            result.portions = newFirstString + result.portions.substr(firstString.length);
          }

          if (result.portions.toUpperCase().startsWith('GER ')) {
            result.portions = result.portions.substr(4);
          }
          if (result.portions.toUpperCase().startsWith('CA ')) {
            result.portions = result.portions.substr(3);
          }
          const parts = result.portions.split(' ')[0].split('-');
          if (parts.length === 2) {
            let tmp = ((parts[0] - 0) + (parts[1] - 0)) / 2;
            if (result.portions.split(' ').length > 1) {
              tmp += result.portions.substr(result.portions.indexOf(result.portions.split(' ')[1]) - 1);
            }
            result.portions = tmp;
          }
        }
        // created

        // description
        if (document.querySelector('.page-content .recipe-ingress')) {
          result.description = document.querySelector('.page-content .recipe-ingress').innerHTML.replace(/(\r\n|\n|\r|<[^>]*>)/gm, '').replace(/  +/g, ' ').trim();
        }

        // time
        if (document.querySelector('.page-content .recipe-description .fa-clock-o')) {
          const timeString = document.querySelector('.page-content .recipe-description .fa-clock-o').nextSibling.nodeValue.trim();
          if (timeString.indexOf('minut') > -1) {
            result.time = timeString.split(' ')[0] - 0;
          } else if (timeString.indexOf('timm') > -1) {
            result.time = (timeString.split(' ')[0] - 0) * 60;
          } else {
            return;
          }
          if (result.time < 25) {
            if (!tags.hasOwnProperty('Snabbt')) {
              tags.Snabbt = true;
            }
          }
        }
        // denna är kvar att fixa till
        // ingredients
        if (document.querySelector('.page-content .ingredient-group li')) {
          const ingredientgroups = document.querySelector('.page-content').getElementsByClassName('ingredient-group');
          const ingredients = [];
          const ingredientNames = [];
          for (let i = 0; i < ingredientgroups.length; i++) {
            const ingredientsDom = ingredientgroups[i].getElementsByTagName('li');
            for (let j = 0; j < ingredientsDom.length; ++j) {
              const ingredient = {};
              // testa läs om http://www.tasteline.com/recept/hummerfisk/
              // när en lösning finns på plats. ta bort alla recpet från tasteline
              // läs om dem från backup. måste läsa om hrefs, då recepten i backup är fel
              const amountElement = ingredientsDom[j].getElementsByClassName('quantity')[0];
              if (!amountElement.classList.contains('hidden')) {
                ingredient.amount = amountElement.getAttribute('data-quantity');
              }
              const unitElement = ingredientsDom[j].getElementsByClassName('unit')[0];
              if (!unitElement.classList.contains('hidden')) {
                ingredient.unit = unitElement.getAttribute('data-unit-name');
              }
              if (!ingredientsDom[j].getElementsByClassName('ingredient')[0]) {
                return;
              }
              const namepart = ingredientsDom[j].getElementsByClassName('ingredient')[0].getElementsByTagName('span')[0].innerHTML.trim();
              ingredient.name = namepart.charAt(0).toUpperCase() + namepart.slice(1).replace(/\s*\([^()]*\)/g, '').split(',')[0].replace(/([/.#$])/g, '').trim();
              if (ingredientNames.indexOf(ingredient.name) > -1) {
                continue;
              }
              ingredientNames.push(ingredient.name);
              ingredients.push(ingredient);
              // måste göra om till innerHTML och ta ut det som ligger i spanet till amount
              // och det andra får först trimmas och sen splitas på " " och ta ut [0] till unit
            }
          }
          result.ingredients = ingredients;
        }

        if (!result.ingredients || result.ingredients.length === 0 || (result.time && result.time < 1)) {
          return;
        }

        // difficulty
        const instructionsList = document.querySelector('.page-content .recipe-content .steps').getElementsByTagName('li');
        const nrOfIngredients = result.ingredients.length;
        let instructionLength = 0;
        for (let i = 0; i < instructionsList.length; i++) {
          instructionLength += instructionsList[i].innerHTML.replace(/(\r\n|\n|\r|)/gm, '').trim().length;
        }
        instructionLength -= instructionsList.length * 10;

        let levelIndex = (nrOfIngredients * 8) + (instructionLength / 14);
        if (result.tags.hasOwnProperty('Enkelt') || result.tags.hasOwnProperty('Lättlagat')) {
          levelIndex -= 100;
        }
        if (result.tags.hasOwnProperty('Snabbt')) {
          levelIndex -= 20;
        }

        if (levelIndex < 100) {
          result.level = 1;
        } else if (levelIndex < 200) {
          result.level = 2;
        } else {
          result.level = 3;
        }
        return result;
      });
    } else {
      console.log(`error on:${source}`);
    }


    console.log(recipe);
    const msg = validateRecipe(recipe);
    if (msg.cause.length > 0) {
      log.push(msg);
      return;
    }
    recipe = cleanRecipe(recipe);

    const existingRecipe = existingRecipes.find(er => er.source === recipe.source);
    if (existingRecipe) {
      recipesRef.orderByChild('source').equalTo(existingRecipe.source).once('value', (snapshot) => {
        snapshot.forEach((child) => {
          recipesRef.child(child.key).update(recipe);
        });
      });
      nrOfRecipesUpdated += 1;
    } else {
      recipesRef.push(recipe);
      nrOfRecipesCreated += 1;
      existingRecipes.push(recipe);
    }
    final.push(recipe);
    await browser.close();
  });
}
*/
