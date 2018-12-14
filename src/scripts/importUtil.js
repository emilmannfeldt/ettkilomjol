const firebase = require('firebase');
const fs = require('fs');

function changeName(options) {
  const recipesRef = firebase.database().ref('recipes');
  const foodRef = firebase.database().ref('foods');
  const tagRef = firebase.database().ref('tags');

  const existingFoods = [];
  const existingTags = [];
  // fixa en array med tags som ska tas bort helt? "smarrigt"
  // de osm har () i sig ska vi kolla på amount med. om amount är 1 så ta bort parantesen annars ta .to
  const unitChanges = [
    { from: 'kruka(or)', to: 'krukor' },
    { from: 'gram', to: 'g' },
    { from: 'klyfta(or)', to: 'klyftor' },
    { from: 'skiva(or)', to: 'skivor' },
    { from: 'paket', to: 'förp' },
    { from: 'förpackning', to: 'förp' },
    { from: 'stjälk(ar)', to: 'stjälkar' },
    { from: 'burk(ar)', to: 'förp' },
    { from: 'ask', to: 'förp' },
    { from: 'kvist(ar)', to: 'kvistar' },
    { from: 'bit(ar)', to: 'bit' },
    { from: 'tärning(ar)', to: 'tärningar' },
    { from: 'knippa(en)', to: 'knippen' },
    { from: 'droppe(ar)', to: 'droppar' },
    { from: 'del(ar)', to: 'delar' },
    { from: 'platta(or)', to: 'plattor' },
    { from: 'stänk', to: 'skvätt' },
    { from: 'kula(or)', to: 'kulor' },
    { from: 'flaska(or)', to: 'flaskor' },
    { from: 'sats(er)', to: 'satser' },
    { from: 'tub(er)', to: 'förp' },
    { from: 'liten bit', to: 'bit' },
    { from: 'korg', to: 'förp' },
    { from: 'meter', to: 'm' },
    { from: 'hekto', to: 'hg' },
    { from: 'påse', to: 'förp' },
    { from: 'påsar', to: 'förp' },
    { from: 'burk', to: 'förp' },
    { from: 'näve', to: 'handfull' },
    { from: 'liter', to: 'l' },
    { from: 'pkt', to: 'förp' },
    { from: 'burkar', to: 'förp' },
    { from: 'förpackningar', to: 'förp' },
    { from: 'tuber', to: 'förp' },
    { from: 'tub', to: 'förp' },
    { from: 'nävar', to: 'handfull' },
    { from: 'droppar§', to: 'droppar' },
    { from: 'kuvert', to: 'förp' },
    { from: 'tks', to: 'tsk' },
    { from: 'decimeter', to: 'dm' },
    { from: 'knippa', to: 'knippe' },
    { from: 'gr', to: 'g' },
    { from: 'portioner', to: 'port' },
    { from: 'ca', to: '' }];


  const tagChanges = [
    { from: 'Anka', to: 'DELETE' },
    { from: 'Billiga Veckan', to: 'Billigt' },
    { from: 'Billig mat', to: 'Billigt' },
    { from: 'Amerikansk mat', to: 'Amerikansk' },
    { from: 'Asiatisk mat', to: 'Asiatisk' },
    { from: 'Bakelser', to: 'Bakelse' },
    { from: 'Bröllopsmat', to: 'Bröllop' },
    { from: 'Enchiladas', to: 'Enchilada' },
    { from: 'Enkelt', to: 'Lättlagat' },
    { from: 'Fransk mat', to: 'Fransk' },
    { from: 'Förrätter', to: 'Förrätt' },
    { from: 'Glutenfritt', to: 'Glutenfri' },
    { from: 'Gratänger', to: 'Gratäng' },
    { from: 'Grekisk mat', to: 'Grekisk' },
    { from: 'Grytor', to: 'Gryta' },
    { from: 'Halloweenmat', to: 'Halloween' },
    { from: 'Husman', to: 'Husmanskost' },
    { from: 'Huvudrätter', to: 'Huvudrätt' },
    { from: 'Indisk mat', to: 'Indisk' },
    { from: 'Italiensk mat', to: 'Italiensk' },
    { from: 'Italien', to: 'Italiensk' },
    { from: 'Laktosfritt', to: 'Laktosfri' },
    { from: 'Limpor', to: 'Limpa' },
    { from: 'Mexikansk mat', to: 'Mexikansk' },
    { from: 'Mjölkfritt', to: 'Mjölkfri' },
    { from: 'Nordisk mat', to: 'Nordisk' },
    { from: 'Pajer', to: 'Paj' },
    { from: 'Rawfood', to: 'Raw food' },
    { from: 'Röror', to: 'Röra' },
    { from: 'Snabbt', to: 'Snabb' },
    { from: 'Sockerfritt', to: 'Sockerfri' },
    { from: 'Spansk mat', to: 'Spansk' },
    { from: 'Tex-mex', to: 'Tex Mex' },
    { from: 'Thailändsk mat', to: 'Thailändsk' },
    { from: 'Thailand', to: 'Thailändsk' },
    { from: 'Tårtor', to: 'Tårta' },
    { from: 'Vardagsmiddag', to: 'Vardag' },
    { from: 'Vegetariskt', to: 'Vegetarisk' },
    { from: 'Woka', to: 'Wok' },
    { from: 'Wraps', to: 'Wrap' },
    { from: 'Äggfritt', to: 'Äggfri' },
    { from: 'Grilla', to: 'Grill' },
    { from: 'Nyttigt', to: 'Nyttig' },
    { from: 'Vardagsmiddag', to: 'Vardag' },
    { from: 'Varmrätt', to: 'Huvudrätt' },
    { from: 'Enkla recept', to: 'Lättlagat' },
    { from: 'Nyttigt', to: 'Nyttig' },
    { from: 'Östeuropeisk mat', to: 'Östeuropeisk' }];


  const foodChanges = [
    { from: 'Ajvar relish', to: 'Ajvar Relish' },
    { from: 'Mild olivilja', to: 'Olivolja' },
    { from: 'Ansjovisfiléer', to: 'Ansjovisfilé' },
    { from: 'Ask färsk dill', to: 'Förp dill' },
    { from: 'Ask färsk gräslök', to: 'Förp gräslök' },
    { from: 'Ask färsk persilja', to: 'Förp persilja' },
    { from: 'Avocado', to: 'Avokado' },
    { from: 'Avokador', to: 'Avokado' },

    { from: 'Nyriven pepparrot', to: 'Pepparrot' },
    { from: 'Nyriven parmesanost', to: 'Parmesanost' },
    { from: 'Nystött kardemumma', to: 'Stött kardemumma' },
    { from: 'Grovriven parmesanost', to: 'Parmesanost' },

    { from: 'Barbecuesås', to: 'Barbequesås' },
    { from: 'Bbq-sås', to: 'Barbequesås' },
    { from: 'Bitar lax', to: 'Port lax' },
    { from: 'Bitar laxfilé', to: 'Port lax' },
    { from: 'Blandad sallad', to: 'Sallad' },
    { from: 'Blandad svamp', to: 'Svamp' },
    { from: 'Blandsallad', to: 'Sallad' },
    { from: 'Blandsvamp', to: 'Svamp' },
    { from: 'Burk bambuskott', to: 'Förp bambuskott' },
    { from: 'Burk böngroddar', to: 'Förp böngroddar' },
    { from: 'Burk hela tomater', to: 'Förp tomat' },
    { from: 'Burk kikärter', to: 'Förp kikärtor' },
    { from: 'Burk kokosmjölk', to: 'Förp kokosmjölk' },
    { from: 'Burk kokta kikärter', to: 'Förp kokta kikärtor' },
    { from: 'Burk kronärtskocksbottnar', to: 'Förp kronärtskocksbotten' },
    { from: 'Kronärtskocksbottnar', to: 'Kronärtskocksbotten' },
    { from: 'Förp kkronärtskocksbotten', to: 'Förp kronärtskocksbotten' },
    { from: 'Burk kronärtskockshjärtan', to: 'Förp kronärtskockshjärta' },
    { from: 'Burk krossade tomater', to: 'Förp krossad tomat' },
    { from: 'Burk majs', to: 'Förp majs' },
    { from: 'Burk majskorn', to: 'Förp majskorn' },
    { from: 'Burk minimajs', to: 'Förp minimajs' },
    { from: 'Burk räkor i lake', to: 'Förp räkor i lake' },
    { from: 'Burk vattenkastanjer', to: 'Förp vattenkastanjer' },
    { from: 'Burkar tonfisk i vatten', to: 'Förp tonfisk' },
    { from: 'Champinjoner', to: 'Champinjon' },
    { from: 'Chiafrö', to: 'Chiafrön' },
    { from: 'Chiliflingor', to: 'Chiliflakes' },
    { from: 'Chilikrydda', to: 'Chili' },
    { from: 'Chipotle-chili', to: 'Chipotlechili' },
    { from: 'Chilli', to: 'Chili' },
    { from: 'Chunky salsa', to: 'Chunky Salsa' },
    { from: 'Chèvre', to: 'Chèvreost' },
    { from: 'Citronskivor', to: 'Citronskiva' },
    { from: 'Clementiner', to: 'Clementin' },
    { from: 'Cocktailtomater', to: 'Cocktailtomat' },
    { from: 'Coctailtomater', to: 'Cocktailtomat' },
    { from: 'Cornichoner', to: 'Cornichons' },
    { from: 'Cottage cheese', to: 'Keso' },
    { from: 'Cream cheese', to: 'Färskost' },
    { from: 'Creme fraiche', to: 'Crème fraiche' },
    { from: 'Creme fraîche', to: 'Crème fraiche' },
    { from: 'Crème fraiche 17%', to: 'Lätt crème fraiche' },
    { from: 'Crème fraîche', to: 'Crème fraiche' },
    { from: 'Créme fraiche', to: 'Crème fraiche' },
    { from: 'Dajm', to: 'Daim' },
    { from: 'Dillkvistar', to: 'Dillkvist' },
    { from: 'En nypa salt', to: 'Salt' },
    { from: 'Espressokaffe', to: 'Espresso' },
    { from: 'Ev salt', to: 'Salt' },
    { from: 'Ev vatten', to: 'Vatten' },
    { from: 'Extra virgin olivolja', to: 'Olivolja' },
    { from: 'Fast potatis', to: 'Potatis' },
    { from: 'Fasta potatisar', to: 'Potatis' },
    { from: 'Finhackad dill', to: 'Dill' },
    { from: 'Finhackad ingefära', to: 'Ingefära' },
    { from: 'Finhackad lök', to: 'Lök' },
    { from: 'Finhackad persilja', to: 'Persilja' },
    { from: 'Finhackad rödlök', to: 'Rödlök' },
    { from: 'Finhackad schalottenlök', to: 'Schalottenlök' },
    { from: 'Finhackad vitlök', to: 'Vitlök' },
    { from: 'Finhackade vitlöksklyftor', to: 'Vitlöksklyfta' },
    { from: 'Finhackade gräslök', to: 'Gräslök' },
    { from: 'Finhackade bladpersilja', to: 'Bladpersilja' },
    { from: 'Finhackad vitlöksklyftor', to: 'Vitlöksklyfta' },
    { from: 'Finhackad gräslök', to: 'Gräslök' },
    { from: 'Finhackad bladpersilja', to: 'Bladpersilja' },
    { from: 'Finkrossade tomater', to: 'Krossad tomat' },
    { from: 'Finriven färsk ingefära', to: 'Ingefära' },
    { from: 'Finriven ingefära', to: 'Ingefära' },
    { from: 'Finriven parmesanost', to: 'Parmesanost' },
    { from: 'Finriven pepparrot', to: 'Pepparrot' },
    { from: 'Finrivet apelsinskal', to: 'Apelsinskal' },
    { from: 'Finrivet citronskal', to: 'Citronskal' },
    { from: 'Finrivet limeskal', to: 'Limeskal' },
    { from: 'Finskuren dill', to: 'Dill' },
    { from: 'Finskuren gräslök', to: 'Gräslök' },
    { from: 'Flingsalt med jod', to: 'Flingsalt' },
    { from: 'Flytande honung', to: 'Honung' },
    { from: 'Flytande margarin', to: 'Margarin' },
    { from: 'Fläderblomssaft', to: 'Flädersaft' },
    { from: 'Fläskfile', to: 'Fläskfilé' },
    { from: 'Fläskfilè', to: 'Fläskfilé' },
    { from: 'Fläskkotletter', to: 'Fläskkotlett' },
    { from: 'Fryst basilika', to: 'Basilika' },
    { from: 'Fryst bladspenat', to: 'Bladspenat' },
    { from: 'Fryst broccoli', to: 'Broccoli' },
    { from: 'Fryst dill', to: 'Dill' },
    { from: 'Fryst mango', to: 'Mango' },
    { from: 'Fryst svampmix', to: 'Svamp' },
    { from: 'Frysta blåbär', to: 'Blåbär' },
    { from: 'Frysta gröna ärter', to: 'Ärtor' },
    { from: 'Frysta hallon', to: 'Hallon' },
    { from: 'Frysta jordgubbar', to: 'Jordgubbar' },
    { from: 'Frysta lingon', to: 'Lingon' },
    { from: 'Frysta sojabönor', to: 'Sojabönor' },
    { from: 'Frysta ärter', to: 'Ärtor' },
    { from: 'Frysta ärtor', to: 'Ärtor' },
    { from: 'Färsk Salvia', to: 'Salvia' },
    { from: 'Färsk ananas', to: 'Ananas' },
    { from: 'Färsk babyspenat', to: 'Babyspenat' },
    { from: 'Färsk basilika', to: 'Basilika' },
    { from: 'Färsk bladpersilja', to: 'Bladpersilja' },
    { from: 'Färsk bladspenat', to: 'Bladspenat' },
    { from: 'Färsk broccoli', to: 'Broccoli' },
    { from: 'Färsk chilifrukt', to: 'Chilifrukt' },
    { from: 'Färsk chorizo', to: 'Chorizo' },
    { from: 'Färsk dill', to: 'Dill' },
    { from: 'Färsk dragon', to: 'Dragon' },
    { from: 'Färsk gräslök', to: 'Gräslök' },
    { from: 'Färsk ingefära', to: 'Ingefära' },
    { from: 'Färsk jäst', to: 'Jäst' },
    { from: 'Färsk karljohansvamp', to: 'Karljohansvamp' },
    { from: 'Färsk koriander', to: 'Koriander' },
    { from: 'Färsk lax', to: 'Lax' },
    { from: 'Färsk laxfilé', to: 'Laxfilé' },
    { from: 'Färsk lök', to: 'Lök' },
    { from: 'Färsk mynta', to: 'Mynta' },
    { from: 'Färsk oregano', to: 'Oregano' },
    { from: 'Färsk pajdeg', to: 'Pajdeg' },
    { from: 'Färsk pepparrot', to: 'Pepparrot' },
    { from: 'Färsk persilja', to: 'Persilja' },
    { from: 'Färsk potatis', to: 'Färskpotatis' },
    { from: 'Färsk riven ingefära', to: 'Ingefära' },
    { from: 'Färsk rosmarin', to: 'Rosmarin' },
    { from: 'Färsk röd chili', to: 'Röd chili' },
    { from: 'Färsk rödkål', to: 'Rödkål' },
    { from: 'Färsk sparris', to: 'Sparris' },
    { from: 'Färsk spenat', to: 'Spenat' },
    { from: 'Färsk timjan', to: 'Timjan' },
    { from: 'Färsk blåbär', to: 'Blåbär' },
    { from: 'Färska bär', to: 'Bär' },
    { from: 'Färska böngroddar', to: 'Böngroddar' },
    { from: 'Färska champinjoner', to: 'Champinjoner' },
    { from: 'Färska fikon', to: 'Fikon' },
    { from: 'Färska hallon', to: 'Hallon' },
    { from: 'Färska jordgubbar', to: 'Jordgubbar' },
    { from: 'Färska kantareller', to: 'Kantareller' },
    { from: 'Färska räkor', to: 'Räkor' },
    { from: 'Färska rödbetor', to: 'Rödbeta' },
    { from: 'Färska tomater', to: 'Tomat' },
    { from: 'Färska trattkantareller', to: 'Trattkantarell' },
    { from: 'Färska örter', to: 'Örter' },
    { from: 'Färskpressad apelsinjuice', to: 'Apelsinjuice' },
    { from: 'Färskpressad citron', to: 'Citron' },
    { from: 'Färskpressad citronjuice', to: 'Citronjuice' },
    { from: 'Färskpressad citronsaft', to: 'Citronsaft' },
    { from: 'Färskpressad limejuice', to: 'Limejuice' },
    { from: 'Färskpressad limesaft', to: 'Limesaft' },
    { from: 'Färskriven ingefära', to: 'Ingefära' },
    { from: 'Färskriven parmesanost', to: 'Parmesanost' },
    { from: 'Färskriven pepparrot', to: 'Pepparrot' },
    { from: 'Förkokta rödbetor', to: 'Rödbeta' },
    { from: 'Förp gröna ärter', to: 'Förp Ärtor' },
    { from: 'Förp kikärter', to: 'Förp kikärtor' },
    { from: 'Förp kokta kikärter', to: 'Förp kokta kikärtor' },
    { from: 'Förp kokta stora vita bönor', to: 'Förp kokta vita bönor' },
    { from: 'Förp krossade tomater', to: 'Förp krossad tomat' },
    { from: 'Glutenfri mjölmix', to: 'Mjölmix' },
    { from: 'Glutenfria havregryn', to: 'Havregryn' },
    { from: 'God olivolja', to: 'Olivolja' },
    { from: 'Gorgonzolaost', to: 'Gorgonzola' },
    { from: 'Gott bröd', to: 'Bröd' },
    { from: 'Grillpinnar', to: 'Grillspett' },
    { from: 'Grovhackad persilja', to: 'Persilja' },
    { from: 'Grovkornig senap', to: 'Grov senap' },
    { from: 'Grovmald svartpeppar', to: 'Svartpeppar' },
    { from: 'Grovmalen svartpeppar', to: 'Svartpeppar' },
    { from: 'Grovt salt', to: 'Grovsalt' },
    { from: 'Grytbitar av nöt', to: 'Grytbitar' },
    { from: 'Grön currypaste', to: 'Grön currypasta' },
    { from: 'Grön paprika', to: 'Paprika' },
    { from: 'Grön sparris', to: 'Sparris' },
    { from: 'Grön zucchini', to: 'Zucchini' },
    { from: 'Gröna paprikor', to: 'Paprika' },
    { from: 'Gröna äpplen', to: 'Äpple' },
    { from: 'Gröna ärter', to: 'Ärtor' },
    { from: 'Gröna ärtor', to: 'Ärtor' },
    { from: 'Grönt äpple', to: 'Äpple' },
    { from: 'Gul paprika', to: 'Paprika' },
    { from: 'Gula kantareller', to: 'Kantareller' },
    { from: 'Gula lökar', to: 'Gul lök' },
    { from: 'Gula paprikor', to: 'Paprika' },
    { from: 'Gulbetor', to: 'Gulbeta' },
    { from: 'Hackad basilika', to: 'Basilika' },
    { from: 'Hackad bladpersilja', to: 'Bladpersilja' },
    { from: 'Hackad dill', to: 'Dill' },
    { from: 'Hackad gräslök', to: 'Gräslök' },
    { from: 'Hackad grönkål', to: 'Grönkål' },
    { from: 'Hackad gul lök', to: 'Gul lök' },
    { from: 'Hackad koriander', to: 'Koriander' },
    { from: 'Hackad mynta', to: 'Mynta' },
    { from: 'Hackad persilja', to: 'Persilja' },
    { from: 'Hackad timjan', to: 'Timjan' },
    { from: 'Hackade hasselnötter', to: 'Hasselnötter' },
    { from: 'Hackade valnötter', to: 'Valnötter' },
    { from: 'Hackade vitlöksklyftor', to: 'Vitlöksklyfta' },
    { from: 'Halloumiost', to: 'Halloumi' },
    { from: 'Hel kyckling', to: 'Kyckling' },
    { from: 'Hel vitlök', to: 'Vitlök' },
    { from: 'Hela linfrö', to: 'Hela linfrön' },
    { from: 'Hela tomater', to: 'Tomat' },
    { from: 'Hett vatten', to: 'Vatten' },
    { from: 'Hjorthornsalt', to: 'Hjorthornssalt' },
    { from: 'Humrar', to: 'Hummer' },
    { from: 'Hushållsfärg', to: 'Karamellfärg' },
    { from: 'Hyvlad parmesanost', to: 'Parmesanost' },
    { from: 'Hårdkokta ägg', to: 'Ägg' },
    { from: 'Hårdost', to: 'Ost' },
    { from: 'Isbergsallad', to: 'Isbergssallad' },
    { from: 'Isbitar', to: 'Isbit' },
    { from: 'Iskallt vatten', to: 'Vatten' },
    { from: 'Jalapenos', to: 'Jalapeño' },
    { from: 'Jalapeños', to: 'Jalapeño' },
    { from: 'Jordgubbe', to: 'Jordgubbar' },
    { from: 'Jungfruolivolja', to: 'Olivolja' },
    { from: 'Kalamata oliver', to: 'Kalamataoliver' },
    { from: 'Kalles kaviar', to: 'Kaviar' },
    { from: 'Kallt smör', to: 'Smör' },
    { from: 'Kallt vatten', to: 'Vatten' },
    { from: 'Kanelstänger', to: 'Kanelstång' },
    { from: 'Kanelstångstänger', to: 'Kanelstång' },
    { from: 'Kantareller', to: 'Kantarell' },
    { from: 'Kikkoman soja', to: 'Soja' },
    { from: 'Kikärter', to: 'Kikärtor' },
    { from: 'Kinesisk soya', to: 'Kinesisk soja' },
    { from: 'Kinesiskt risvin', to: 'Risvin' },
    { from: 'Kiwifrukter', to: 'Kiwi' },
    { from: 'Klyftor vitlök', to: 'Vitlöksklyfta' },
    { from: 'Knippe grön sparris', to: 'Sparris' },
    { from: 'Kokande vatten', to: 'Vatten' },
    { from: 'Kokhett vatten', to: 'Vatten' },
    { from: 'Kokosflakes', to: 'Kokosflingor' },
    { from: 'Kokosnötmjöl', to: 'Kokosmjöl' },
    { from: 'Kokt färskpotatis', to: 'Färskpotatis' },
    { from: 'Kokt jasminris', to: 'Jasminris' },
    { from: 'Kokt potatis', to: 'Potatis' },
    { from: 'Kokt ris', to: 'Ris' },
    { from: 'Kokta bönor', to: 'Bönor' },
    { from: 'Kokta humrar', to: 'Hummer' },
    { from: 'Kokta kidneybönor', to: 'Kidneybönor' },
    { from: 'Kokta kikärter', to: 'Kikärtor' },
    { from: 'Kokta kikärtor', to: 'Kikärtor' },
    { from: 'Kokta linser', to: 'Linser' },
    { from: 'Kokta potatisar', to: 'Potatis' },
    { from: 'Kokta svarta bönor', to: 'Svarta bönor' },
    { from: 'Kokta vita bönor', to: 'Vita bönor' },
    { from: 'Kokta ägg', to: 'Ägg' },
    { from: 'Kokvatten', to: 'Vatten' },
    { from: 'Konc grönsaksfond', to: 'Grönsaksfond' },
    { from: 'Konc kalvfond', to: 'Kalvfond' },
    { from: 'Konc kycklingfond', to: 'Kycklingfond' },
    { from: 'Konc viltfond', to: 'Viltfond' },
    { from: 'Korriander', to: 'Koriander' },
    { from: 'Kronärtskockaor', to: 'Kronärtskocka' },
    { from: 'Kronärtskockshjärtan', to: 'Kronärtskockshjärta' },
    { from: 'Krossad is', to: 'Is' },
    { from: 'Krossade tomat', to: 'Krossad tomat' },
    { from: 'Krossade tomater', to: 'Krossad tomat' },
    { from: 'Kruka färsk koriander', to: 'Kruka koriander' },
    { from: 'Kruka hackad koriander', to: 'Kruka koriander' },
    { from: 'Kryddblandning', to: 'Kryddmix' },
    { from: 'Kryddnejlikor', to: 'Kryddnejlika' },
    { from: 'Kvisttomat', to: 'Tomat' },
    { from: 'Kyld pajdeg', to: 'Pajdeg' },
    { from: 'Kylskåpskallt smör', to: 'Smör' },
    { from: 'Körsbärstomater', to: 'Körsbärstomat' },
    { from: 'Körsbärstomater', to: 'Körsbärstomat' },
    { from: 'Köttbuljongtärning eller motsvarande mängd fond', to: 'Köttbuljongtärning' },
    { from: 'Lagrad ost', to: 'Ost' },
    { from: 'Lemoncurd', to: 'Lemon curd' },
    { from: 'Limefrukt', to: 'Lime' },
    { from: 'Linguini', to: 'Linguine' },
    { from: 'Lite socker', to: 'Socker' },
    { from: 'Liten fänkål', to: 'Fänkål' },
    { from: 'Liten gul lök', to: 'Gul lök' },
    { from: 'Liten gurka', to: 'Gurka' },
    { from: 'Liten klyfta vitlök', to: 'Vitlöksklyfta' },
    { from: 'Liten morot', to: 'Morot' },
    { from: 'Liten purjolök', to: 'Purjolök' },
    { from: 'Liten rödlök', to: 'Rödlök' },
    { from: 'Liten squash', to: 'Squash' },
    { from: 'Liten vitlöksklyfta', to: 'Vitlöksklyfta' },
    { from: 'Liten zucchini', to: 'Zucchini' },
    { from: 'Liter vatten', to: 'Vatten' },
    { from: 'Litet blomkålshuvud', to: 'Blomkålshuvud' },
    { from: 'Ljummet vatten', to: 'Vatten' },
    { from: 'Ljust muscovadoråsocker', to: 'Ljust muscovadosocker' },
    { from: 'Lätt crème fraîche', to: 'Lätt crème fraiche' },
    { from: 'Lätt kokosmjölk', to: 'Kokosmjölk' },
    { from: 'Machesallad', to: 'Machésallad' },
    { from: 'Majonäs', to: 'Majonnäs' },
    { from: 'Mald ingefära', to: 'Malen ingefära' },
    { from: 'Mald kanel', to: 'Kanel' },
    { from: 'Mald kardemumma', to: 'Malen kardemumma' },
    { from: 'Mald koriander', to: 'Malen koriander' },
    { from: 'Mald kryddpeppar', to: 'Malen kryddpeppar' },
    { from: 'Mald spiskummin', to: 'Malen spiskummin' },
    { from: 'Mald vitpeppar', to: 'Malen vitpeppar' },
    { from: 'Malen kanel', to: 'Kanel' },
    { from: 'Mandelflarn', to: 'Mandelspån' },
    { from: 'Mascarponeost', to: 'Mascarpone' },
    { from: 'Matlagningsyoghurt', to: 'Matyoghurt' },
    { from: 'Medelstora morötter', to: 'Morot' },
    { from: 'Medelstora potatisar', to: 'Potatis' },
    { from: 'Mellanmjölk', to: 'Mjölk' },
    { from: 'Mild yoghurt', to: 'Yoghurt' },
    { from: 'Mineralvatten', to: 'Sodavatten' },
    { from: 'Mini fraiche', to: 'Lätt crème fraiche' },
    { from: 'Minibaguetter', to: 'Minibaguette' },
    { from: 'Minifraiche', to: 'Lätt crème fraiche' },
    { from: 'Minutfilé av kyckling', to: 'Minutkycklingfilé' },
    { from: 'Minutfiléer av kyckling', to: 'Minutkycklingfilé' },
    { from: 'Mjuka tunnbröd', to: 'Tunnbröd' },
    { from: 'Mjukt smör', to: 'Smör' },
    { from: 'Mjukt tunnbröd', to: 'Tunnbröd' },
    { from: 'Mjölig potatis', to: 'Potatis' },
    { from: 'Mjölk 3 %', to: 'Mjölk' },
    { from: 'Mjölkfritt margarin', to: 'Margarin' },
    { from: 'Mjölkfritt smör', to: 'Smör' },
    { from: 'Mogen avokado', to: 'Avokado' },
    { from: 'Mogen banan', to: 'Banan' },
    { from: 'Mogna avokador', to: 'Avokado' },
    { from: 'Morötter', to: 'Morot' },
    { from: 'Mozarellaost', to: 'Mozzarella' },
    { from: 'Mozzarellaost', to: 'Mozzarella' },
    { from: 'Muscovadoråsocker', to: 'Muscovadosocker' },
    { from: 'Muskotnöt', to: 'Muskot' },
    { from: 'Mörk blockchoklad', to: 'Mörk choklad' },
    { from: 'Mörkt muscovadoråsocker', to: 'Mörkt muscovadosocker' },
    { from: 'Naturell yoghurt', to: 'Yoghurt' },
    { from: 'Naturella cashewnötter', to: 'Cashewnötter' },
    { from: 'Neutral matolja', to: 'Matolja' },
    { from: 'Neutral olja', to: 'Olja' },
    { from: 'Neutral rapsolja', to: 'Rapsolja' },
    { from: 'Nori-ark', to: 'Noriark' },
    { from: 'Normalsaltat smör', to: 'Smör' },
    { from: 'Nymald svartpeppar', to: 'Svartpeppar' },
    { from: 'Nymald vitpeppar', to: 'Vitpeppar' },
    { from: 'Nymalen peppar', to: 'Peppar' },
    { from: 'Nymalen svartpeppar', to: 'Peppar' },
    { from: 'Nymalen vitpeppar', to: 'Vitpeppar' },
    { from: 'Olivolja extra virgin', to: 'Olivolja' },
    { from: 'Olivolja till stekning', to: 'Olivolja' },
    { from: 'Olja till fritering', to: 'Olja' },
    { from: 'Olja till stekning', to: 'Olja' },
    { from: 'Orange paprika', to: 'Paprika' },
    { from: 'Oskalade räkor', to: 'Räkor' },
    { from: 'Pak choy', to: 'Pak choi' },
    { from: 'Paket bacon', to: 'Förp bacon' },
    { from: 'Paket saffran', to: 'Förp saffran' },
    { from: 'Papayaor', to: 'Papaya' },
    { from: 'Parmesan', to: 'Parmesanost' },
    { from: 'Parmigiano reggiano', to: 'Parmesanost' },
    { from: 'Pastasås med basilika', to: 'Pastasås basilika' },
    { from: 'Pecorinoost', to: 'Pecorino' },
    { from: 'Pekannötter', to: 'Pecannötter' },
    { from: 'Penne', to: 'Pasta penne' },
    { from: 'Persikaor', to: 'Persika' },
    { from: 'Philadelphia', to: 'Färskost' },
    { from: 'Philadelphiaost', to: 'Färskost' },
    { from: 'Plommontomater', to: 'Plommontomat' },
    { from: 'Polkagrisar', to: 'Polkagris' },
    { from: 'Port bulgur eller annat gryn', to: 'Port bulgur' },
    { from: 'Port couscous eller annat gryn', to: 'Port couscous' },
    { from: 'Port ris eller annat gryn', to: 'Port ris' },
    { from: 'Portioner pasta', to: 'Port pasta' },
    { from: 'Portionsbitar lax', to: 'Port lax' },
    { from: 'Portionsbitar laxfilé', to: 'Port laxfilé' },
    { from: 'Pressad apelsinsaft', to: 'Apelsinsaft' },
    { from: 'Pressad citron', to: 'Citronjuice' },
    { from: 'Pressad citronjuice', to: 'Citronjuice' },
    { from: 'Pressad citronsaft', to: 'Citronjuice' },
    { from: 'Pressad lime', to: 'Limejuice' },
    { from: 'Pressad limesaft', to: 'Limejuice' },
    { from: 'Pressad vitlök', to: 'Vitlök' },
    { from: 'Pressad vitlöksklyfta', to: 'Vitlöksklyfta' },
    { from: 'Pressad vitlöksklyftor', to: 'Vitlöksklyfta' },
    { from: 'Prosciutto', to: 'Prosciuttoskinka' },
    { from: 'Pumpafrö', to: 'Pumpafrön' },
    { from: 'Påsar babyspenat', to: 'Förp babyspenat' },
    { from: 'Påse babyspenat', to: 'Förp babyspenat' },
    { from: 'Påse färk spenat', to: 'Förp spenat' },
    { from: 'Påse mangoldskott', to: 'Förp mangoldskott' },
    { from: 'Påse mâchesallad', to: 'Förp mâchesallad' },
    { from: 'Påse ruccola', to: 'Förp ruccola' },
    { from: 'Påse salladslök', to: 'Förp salladslök' },
    { from: 'Påse salladsmix', to: 'Förp salladsmix' },
    { from: 'Rapsolja till stekning', to: 'Rapsolja' },
    { from: 'Ricottaost', to: 'Ricotta' },
    { from: 'Risonipasta', to: 'Risoni' },
    { from: 'Riven Kokos', to: 'Kokos' },
    { from: 'Riven Västerbottensost', to: 'Västerbottensost' },
    { from: 'Riven färsk ingefära', to: 'Ingefära' },
    { from: 'Riven färsk pepparrot', to: 'Pepparrot' },
    { from: 'Riven grana padano', to: 'Grana padano' },
    { from: 'Riven gratängost', to: 'Gratängost' },
    { from: 'Riven ingefära', to: 'Ingefära' },
    { from: 'Riven kokos', to: 'Kokos' },
    { from: 'Riven lagrad ost', to: 'Ost' },
    { from: 'Riven mozzarella', to: 'Mozzarella' },
    { from: 'Riven muskot', to: 'Muskot' },
    { from: 'Riven muskotnör', to: 'Muskot' },
    { from: 'Riven ost', to: 'Ost' },
    { from: 'Riven parmesan', to: 'Parmesanost' },
    { from: 'Riven parmesanost', to: 'Parmesanost' },
    { from: 'Riven pepparrot', to: 'Pepparrot' },
    { from: 'Riven prästost', to: 'Prästost' },
    { from: 'Riven vitlöksklyfta', to: 'Vitlöksklyfta' },
    { from: 'Riven västerbottensost', to: 'Västerbottensost' },
    { from: 'Riven citronskal', to: 'Citronskal' },
    { from: 'Romansallat', to: 'Romansallad' },
    { from: 'Rooiboste', to: 'Rooibosteost' },
    { from: 'Rostbiff pålägg', to: 'Rostbiff' },
    { from: 'Rotfrukt', to: 'Rotfrukter' },
    { from: 'Rotsaker', to: 'Rotfrukter' },
    { from: 'Rucola', to: 'Ruccola' },
    { from: 'Rucolasallad', to: 'Ruccolasallad' },
    { from: 'Rumstempurerat smör', to: 'Smör' },
    { from: 'Rumsvarmt smör', to: 'Smör' },
    { from: 'Rädisa', to: 'Rädisor' },
    { from: 'Räkor med skal', to: 'Räkor' },
    { from: 'Röd currypaste', to: 'Röd currypasta' },
    { from: 'Röd hushållsfärg', to: 'Röd karamellfärg' },
    { from: 'Röd lök', to: 'Rödlök' },
    { from: 'Röd paprika', to: 'Paprika' },
    { from: 'Röda chilifrukter', to: 'Röd chilifrukt' },
    { from: 'Röda lökar', to: 'Rödlök' },
    { from: 'Röda paprikor', to: 'Paprika' },
    { from: 'Röda tomater', to: 'Tomat' },
    { from: 'Röda äpplen', to: 'Äpple' },
    { from: 'Rödbetor', to: 'Rödbeta' },
    { from: 'Rött äpple', to: 'Äpple' },
    { from: 'Sallatsmix', to: 'Salladsmix' },
    { from: 'Salsicciakorv', to: 'Salsiccia' },
    { from: 'Salt efter smak', to: 'Salt' },
    { from: 'Salt och malen svartpeppar', to: 'Salt och svartpeppar' },
    { from: 'Salt och malen vitpeppar', to: 'Salt och vitpeppar' },
    { from: 'Salt och nymalen svartpeppar', to: 'Salt och svartpeppar' },
    { from: 'Salt och nymald svartpeppar', to: 'Salt och svartpeppar' },
    { from: 'Saltade jordnötter', to: 'Salta jordnötter' },
    { from: 'Sambal olek', to: 'Sambal oelek' },
    { from: 'Sardellfiléer', to: 'Sardellfilé' },
    { from: 'Savojkål', to: 'Savoykål' },
    { from: 'Scharlottenlök', to: 'Schalottenlök' },
    { from: 'Senapsfrö', to: 'Senapsfrön' },
    { from: 'Skalade hasselnötter', to: 'Hasselnötter' },
    { from: 'Skalade tomater', to: 'Tomater' },
    { from: 'Skalade räkor', to: 'Räkor' },
    { from: 'Skinn- och benfri laxfilé', to: 'Laxfilé' },
    { from: 'Skinnfri laxfilé', to: 'Laxfilé' },
    { from: 'Smulad fetaost', to: 'Fetaost' },
    { from: 'Smält smör', to: 'Smör' },
    { from: 'Små morötter', to: 'Morot' },
    { from: 'Små potatisar', to: 'Potatis' },
    { from: 'Små rödbetor', to: 'Rödbeta' },
    { from: 'Små tomater', to: 'Tomat' },
    { from: 'Små tortillabröd', to: 'Tortillabröd' },
    { from: 'Små ärtor', to: 'Ärtor' },
    { from: 'Smör &amp; rapsolja', to: 'Smör och rapsolja' },
    { from: 'Smör att steka i', to: 'Smör' },
    { from: 'Smör eller margarin', to: 'Smör' },
    { from: 'Smör eller margarin till stekning', to: 'Smör' },
    { from: 'Smör eller olja', to: 'Smör' },
    { from: 'Smör och olja till stekning', to: 'Smör och olja' },
    { from: 'Smör till formen', to: 'Smör' },
    { from: 'Smör till stekning', to: 'Smör' },
    { from: 'Snackmorötter', to: 'Morot' },
    { from: 'Sockerärter', to: 'Sockerärtor' },
    { from: 'Solrosfrö', to: 'Solrosfrön' },
    { from: 'Soltorkade tomater', to: 'Soltorkad tomat' },
    { from: 'Sommarpotatis', to: 'Färskpotatis' },
    { from: 'Soya', to: 'Soja' },
    { from: 'Spagetti', to: 'Spaghetti' },
    { from: 'Standardmjölk', to: 'Mjölk' },
    { from: 'Starkt kaffe', to: 'Kaffe' },
    { from: 'Stor aubergine', to: 'Aubergine' },
    { from: 'Stor fänkål', to: 'Fänkål' },
    { from: 'Stor gul lök', to: 'Gul lök' },
    { from: 'Stor lök', to: 'Lök' },
    { from: 'Stor morot', to: 'Morot' },
    { from: 'Stor palsternacka', to: 'Palsternacka' },
    { from: 'Stor purjolök', to: 'Purjolök' },
    { from: 'Stor rödlök', to: 'Rödlök' },
    { from: 'Stor vitlöksklyfta', to: 'Vitlöksklyfta' },
    { from: 'Stor zucchini', to: 'Zucchini' },
    { from: 'Stora gula lökar', to: 'Gul lök' },
    { from: 'Stora morötter', to: 'Morot' },
    { from: 'Stora potatisar', to: 'Potatis' },
    { from: 'Stora räkor', to: 'Räkor' },
    { from: 'Stora tomater', to: 'Tomat' },
    { from: 'Stora tortillabröd', to: 'Tortillabröd' },
    { from: 'Stora vita bönor', to: 'Vita bönor' },
    { from: 'Stora ägg', to: 'Ägg' },
    { from: 'Strimlad biff', to: 'Biff' },
    { from: 'Strimlad kycklingfilé', to: 'Kycklingfilé' },
    { from: 'Strimlad kycklinglårfilé', to: 'Kycklinglårfilé' },
    { from: 'Strimlad purjolök', to: 'Purjolök' },
    { from: 'Strimlad ryggbiff', to: 'Ryggbiff' },
    { from: 'Strimlad skinka', to: 'Skinka' },
    { from: 'Sugar snaps', to: 'Sugarsnaps' },
    { from: 'Sugersnaps', to: 'Sugarsnaps' },
    { from: 'Svartpeppar från kvarn', to: 'Svartpeppar' },
    { from: 'Svensk senap', to: 'Senap' },
    { from: 'Svenska äpplen', to: 'Äpple' },
    { from: 'Sweetchilisås', to: 'Sweet chilisås' },
    { from: 'Syrligt äpple', to: 'Äpple' },
    { from: 'Söt soja', to: 'Soja' },
    { from: 'Söt senap', to: 'Senap' },
    { from: 'Taco kryddmix', to: 'Tacokrydda' },
    { from: 'Tacokryddmix', to: 'Tacokrydda' },
    { from: 'Tacomix', to: 'Tacokrydda' },
    { from: 'Timjankvistar', to: 'Timjankvist' },
    { from: 'Tjock yoghurt', to: 'Yoghurt' },
    { from: 'Tomater', to: 'Tomat' },
    { from: 'Tomatkross', to: 'Krossad tomat' },
    { from: 'Tomatpure', to: 'Tomatpuré' },
    { from: 'Torskryggfilé', to: 'Torskrygg' },
    { from: 'Tortillas', to: 'Tortillabröd' },
    { from: 'Tärnad bacon', to: 'Tärnat bacon' },
    { from: 'Tärningar grönsaksbuljong', to: 'Tärning grönsaksbuljong' },
    { from: 'Utskuren biff', to: 'Biff' },
    { from: 'Vaniljessens', to: 'Vaniljextrakt' },
    { from: 'Vaniljstänger', to: 'Vaniljstång' },
    { from: 'Vaniljvisp', to: 'Vaniljsås' },
    { from: 'Varm mjölk', to: 'Mjölk' },
    { from: 'Vegansk majonnäs', to: 'Majonnäs' },
    { from: 'Vetemjöl special', to: 'Vetemjöl' },
    { from: 'Vispad grädde', to: 'Vispgrädde' },
    { from: 'Vit blockchoklad', to: 'Vit choklad' },
    { from: 'Västerbottenost', to: 'Västerbottensost' },
    { from: 'Wasabipasta', to: 'Wasabi' },
    { from: 'Whiskey', to: 'Whisky' },
    { from: 'Worchestershiresås', to: 'Worcestershiresås' },
    { from: 'Youghurt', to: 'Yoghurt' },
    { from: 'Ärter', to: 'Ärtor' },
    { from: 'Mild olivolja', to: 'Olivolja' },
    { from: 'Ätbara blommor', to: 'Blommor' },
    { from: 'Ananasspad', to: 'Ananasjuice' },
    { from: 'Apelsinklyfta', to: 'Apelsinskiva' },
    { from: 'Bregott', to: 'Smör' },
    { from: 'Bröd till servering', to: 'Bröd' },
    { from: 'Burk grillad paprika', to: 'Förp grillad paprika' },
    { from: 'Burk kantareller', to: 'Förp kantareller' },
    { from: 'Burk kräftstjärtar', to: 'Förp kräftstjärtar' },
    { from: 'Burk lättkokosmjölk', to: 'Förp kokosmjölk' },
    { from: 'Burk murklor', to: 'Förp murklor' },
    { from: 'Burkar hela tomater', to: 'Förp tomat' },
    { from: 'Burkar kikärter', to: 'Förp kikärtor' },
    { from: 'Burkar röda bönor', to: 'Förp röda bönor' },
    { from: 'Chillisås', to: 'Chilisås' },
    { from: 'Chipotlepaste', to: 'Chipotlepasta' },
    { from: 'Ciabattabröd', to: 'Ciabatta' },
    { from: 'Coktailtomater', to: 'Cocktailtomat' },
    { from: 'Creme bonjour', to: 'Créme bonjour' },
    { from: 'Ev bröd', to: 'Bröd' },
    { from: 'Fiberberikade havregryn', to: 'Fiberhavregryn' },
    { from: 'Finhackad chilifrukt', to: 'Chilifrukt' },
    { from: 'Finhackad färsk ingefära', to: 'Ingefära' },
    { from: 'Finhackad gul lök', to: 'Gul lök' },
    { from: 'Finhackad koriander', to: 'Koriander' },
    { from: 'Fryst blomkål', to: 'Blomkål' },
    { from: 'Fryst bönmix', to: 'Bönmix' },
    { from: 'Frysta björnbär', to: 'Björnbär' },
    { from: 'Frysta gröna ärtor', to: 'Ärtor' },
    { from: 'Frysta majskorn', to: 'Majskorn' },
    { from: 'Frysta räkor', to: 'Räkor' },
    { from: 'Frysta örter', to: 'Örter' },
    { from: 'Fänkålshuvuden', to: 'Fänkålshuvud' },
    { from: 'Färsk grönkål', to: 'Grönkål' },
    { from: 'Färsk gurkmeja', to: 'Gurkmeja' },
    { from: 'Färsk mango', to: 'Mango' },
    { from: 'Färsk minimajs', to: 'Minimajs' },
    { from: 'Färsk salsiccia', to: 'Salsiccia' },
    { from: 'Färsk salsicciakorv', to: 'Salsiccia' },
    { from: 'Färsk salvia', to: 'Salvia' },
    { from: 'Färska basilikablad', to: 'Basilikablad' },
    { from: 'Färska dadlar', to: 'Dadlar' },
    { from: 'Färska lökar', to: 'Lök' },
    { from: 'Förp halloumiost', to: 'Förp halloumi' },
    { from: 'Grevéost', to: 'Grevé' },
    { from: 'Grillade paprikor', to: 'Grillade paprika' },
    { from: 'Grovhackad dill', to: 'Dill' },
    { from: 'Grovt hackad koriander', to: 'Koriander' },
    { from: 'Grovt havssalt', to: 'Havssalt' },
    { from: 'Gröna chilifrukter', to: 'Grön chilifrukt' },
    { from: 'Gröna sparris', to: 'Sparris' },
    { from: 'Gula tomater', to: 'Gul tomat' },
    { from: 'Hackad färsk koriander', to: 'Koriander' },
    { from: 'Hackad rödlök', to: 'Rödlök' },
    { from: 'Hackade jordnötter', to: 'Jordnötter' },
    { from: 'Hackade nötter', to: 'Nötter' },
    { from: 'Hackade örter', to: 'Örter' },
    { from: 'Haloumi', to: 'Halloumi' },
    { from: 'Hela fänkålsfrö', to: 'Fänkålsfrö' },
    { from: 'Hela vitlökar', to: 'Vitlök' },
    { from: 'Helt bovete', to: 'Bovete' },
    { from: 'Hushållsmjukost', to: 'Mjukost' },
    { from: 'Klyfta vitlök', to: 'Vitlöksklyfta' },
    { from: 'Knippa dill', to: 'Dill' },
    { from: 'Knippa gräslök', to: 'Gräslök' },
    { from: 'Kokta stora vita bönor', to: 'Vita bönor' },
    { from: 'Krossad ananas', to: 'Ananas' },
    { from: 'Krossade vitlöksklyftor', to: 'Vitlöksklyfta' },
    { from: 'Kvarg gourmet', to: 'Kvarg' },
    { from: 'Kycklingkött', to: 'Kyckling' },
    { from: 'Kålrötter', to: 'Kålrot' },
    { from: 'Lime i klyftor', to: 'Lime' },
    { from: 'Lite salt', to: 'Salt' },
    { from: 'Liten aubergine', to: 'Aubergine' },
    { from: 'Liten rotselleri', to: 'Rotselleri' },
    { from: 'Liten schalottenlök', to: 'Schalottenlök' },
    { from: 'Minutfilé', to: 'Minutkycklingfilé' },
    { from: 'Mjöliga potatisar', to: 'Potatis' },
    { from: 'Mogna avokado', to: 'Avokado' },
    { from: 'Nektariner', to: 'Nektarin' },
    { from: 'Nybakat bröd', to: 'Bröd' },
    { from: 'Några blad basilika', to: 'Basilikablad' },
    { from: 'Några droppar sesamolja', to: 'Sesamolja' },
    { from: 'Pastasås med vitlök', to: 'Pastasås vitlök' },
    { from: 'Port kokt ris', to: 'Port ris' },
    { from: 'Portioner basmatiris', to: 'Port ris' },
    { from: 'Påse djupfrysta wokgrönsaker', to: 'Förp wokgrönsaker' },
    { from: 'Påse medelhavsmix', to: 'Förp medelhavsmix' },
    { from: 'Rabarberstjälkar', to: 'Rabarberstjälk' },
    { from: 'Rimmat sidfläsk i skivor', to: 'Rimmat sidfläsk' },
    { from: 'Riven cheddarost', to: 'Cheddarost' },
    { from: 'Riven morot', to: 'Morot' },
    { from: 'Riven pecorinoost', to: 'Pecorino' },
    { from: 'Rivet apelsinskal', to: 'Apelsinskal' },
    { from: 'Romansallatshuvud', to: 'Romansalladshuvud' },
    { from: 'Röd Chilli', to: 'Röd chili' },
    { from: 'Röd vinbärsgelé', to: 'Rödvinbärsgelé' },
    { from: 'Salt och peppar efter smak', to: 'Salt och peppar' },
    { from: 'Skiva vitt bröd', to: 'Vitt bröd' },
    { from: 'Skivade tomater', to: 'Tomat' },
    { from: 'Skivor bröd', to: 'Brödskiva' },
    { from: 'Skuren grönkål', to: 'Grönkål' },
    { from: 'Skuren svartkål', to: 'Svartkål' },
    { from: 'Smakrik ost', to: 'Ost' },
    { from: 'Små gröna ärter', to: 'Ärtor' },
    { from: 'Små rödlökar', to: 'Rödlök' },
    { from: 'Smör eller rapsolja', to: 'Smör' },
    { from: 'Stark senap', to: 'Senap' },
    { from: 'Stor citron', to: 'Citron' },
    { from: 'Stor gurka', to: 'Gurka' },
    { from: 'Stor röd paprika', to: 'Paprika' },
    { from: 'Stor tomat', to: 'Tomat' },
    { from: 'Stora klyftor vitlök', to: 'Vitlöksklyfta' },
    { from: 'Strimlad basilika', to: 'Basilika' },
    { from: 'Strimlad isbergssallad', to: 'Isbergssallad' },
    { from: 'Strimlad kyckling', to: 'Kyckling' },
    { from: 'Strimlad vitkål', to: 'Vitkål' },
    { from: 'Tjocka revbensspjäll', to: 'Revbensspjäll' },
    { from: 'Torra röda linser', to: 'Röda linser' },
    { from: 'Tärning köttbuljong eller motsvarande mängd fond', to: 'Köttbuljongtärning' },
    { from: 'Vanlijsocker', to: 'Vaniljsocker' },
    { from: 'Varmt vatten', to: 'Vatten' },
    { from: 'Vilt &amp; kantarellfond', to: 'Vilt och kantarellfond' },
    { from: 'Vinterpotatis', to: 'Potatis' },
    { from: 'Vitlök', to: 'Vitlök' },
    { from: 'Vätska', to: 'Vatten' },
    { from: 'Yoghurt naturell', to: 'Yoghurt' },
    { from: 'Äkta vaniljpulver', to: 'Vaniljpulver' },
    { from: 'Portioner ris', to: 'Port ris' },
    { from: 'Mogna bananer', to: 'Banan' },
    { from: 'Mogen mango', to: 'Mango' },
    { from: 'Skivad rödlök', to: 'Rödlök' },
    { from: 'Skivad banan', to: 'Banan' },
    { from: 'Smulad getost', to: 'Getost' },
    { from: 'Förkokta majskolvar', to: 'Majskolv' },
    { from: 'Cm färsk ingefära', to: 'Ingefära' },
    { from: 'Cm ingefära', to: 'Ingefära' },
    { from: 'Cm purjolök', to: 'Purjolök' },
    { from: 'Frityrolja', to: 'Olja' },
    { from: 'Benfria fläskkottleter', to: 'Fläskkottlet' },
    { from: 'Benfri fläskkarré', to: 'Fläskkarré' },
    { from: 'Laktosfritt smör', to: 'Smör' },
    { from: 'Laktosfri mjölkdryck', to: 'Mjölk' },
    { from: 'Valfri pasta', to: 'Pasta' },
    { from: 'Valfri mjölk', to: 'Mjölk' },
    { from: 'Knippa persilja', to: 'Persilja' },
    { from: 'Knippa rädisor', to: 'Rädisor' },
    { from: 'Knippa salladslök', to: 'Salladslök' },

    { from: 'Laktosfri', to: 'Laktosfritt' },

  ];
    // nya konstiga saker som upptäckts:
    // auberginer

  const filename = options[4] || 'import_changename';
  const log = [];
  let foodLoaded = false;
  let tagLoaded = false;
  firebase.auth().signInAnonymously().catch((error) => {
    console.log(`ERROR${error}`);
  });
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      foodRef.orderByChild('uses').once('value', (snapshot) => {
        snapshot.forEach((child) => {
          existingFoods.splice(0, 0, child.val().name);
        });
        foodLoaded = true;
        if (foodLoaded && tagLoaded) {
          runRecipes();
        }
      });
      tagRef.orderByChild('uses').once('value', (snapshot) => {
        snapshot.forEach((child) => {
          existingTags.splice(0, 0, child.val().name);
        });
        tagLoaded = true;
        if (foodLoaded && tagLoaded) {
          runRecipes();
        }
      });
    }
  });

  function runRecipes() {
    console.log('start changename');
    recipesRef.once('value', (snapshot) => {
      snapshot.forEach((child) => {
        const usedTagsTo = [];
        const recipe = child.val();
        let changesmade = false;
        let deleteRecipe = false;
        const tagsToRemove = [];
        for (let i = 0; i < recipe.ingredients.length; i++) {
          const ingredientName = recipe.ingredients[i].name;
          for (let j = 0; j < foodChanges.length; j++) {
            const change = foodChanges[j];
            if (change.from === ingredientName) {
              recipe.ingredients[i].name = change.to;
              changesmade = true;
              log.push(`From food:${change.from} toFood:${change.to} src:${recipe.source} key:${child.key}`);
              if (change.to.startsWith('Förp ') && (!recipe.ingredients[i].unit || recipe.ingredients[i].unit === 'st')) {
                log.push(`from:${recipe.ingredients[i].unit} ${recipe.ingredients[i].name}`);
                recipe.ingredients[i].name = change.to.substring(5).trim();
                recipe.ingredients[i].name = recipe.ingredients[i].name.charAt(0).toUpperCase() + recipe.ingredients[i].name.slice(1);
                recipe.ingredients[i].unit = 'förp';
                log.push(`to:${recipe.ingredients[i].unit} ${recipe.ingredients[i].name} source:${recipe.source}`);

                // detta behöver köras i separat script för alla som börjar på förp i datachange nu. Men sen räcker det att köra den här
                // testa, lägg till liknande för Port och skivor
                // ta sen bort ändringarna jag gjorde för FÖRP i recipecard, recipelist, ingredientlist, index
                // nästa steg fixa spinner loader för när recepten håller på att laddas in från indexjs
                // fixa en enkel pil och text med exempel på sökningar eller gör som koket.se och ha bara hjälptext i inputfältet om det inte är mobilläge annars inget alls
              } else if (change.from.startsWith('Cm ') && (!recipe.ingredients[i].unit || recipe.ingredients[i].unit === 'st')) {
                log.push(`from:${recipe.ingredients[i].unit} ${recipe.ingredients[i].name}`);
                recipe.ingredients[i].name = change.to;
                recipe.ingredients[i].unit = 'cm';
                log.push(`to:${recipe.ingredients[i].unit} ${recipe.ingredients[i].name} source:${recipe.source}`);
              } else if ((change.from.startsWith('Knippe ') || change.from.startsWith('Knippa ')) && (!recipe.ingredients[i].unit || recipe.ingredients[i].unit === 'st')) {
                log.push(`from:${recipe.ingredients[i].unit} ${recipe.ingredients[i].name}`);
                recipe.ingredients[i].name = change.to;
                recipe.ingredients[i].unit = 'Knippe';
                log.push(`to:${recipe.ingredients[i].unit} ${recipe.ingredients[i].name} source:${recipe.source}`);
              }
            }
          }
        }

        for (const property in recipe.tags) {
          if (recipe.tags.hasOwnProperty(property)) {
            const tagName = property;
            for (let j = 0; j < tagChanges.length; j++) {
              const change = tagChanges[j];
              if (change.from === tagName) {
                if (usedTagsTo.indexOf(change.to) > -1 || change.to === 'DELETE') {
                  delete recipe.tags[tagName];
                  changesmade = true;
                  log.push(`From tag:${change.from} totag:${change.to} src:${recipe.source} key:${child.key}`);
                  continue;
                }
                delete recipe.tags[tagName];
                recipe.tags[change.to] = true;
                changesmade = true;
                usedTagsTo.push(change.to);
                changesmade = true;
                log.push(`From tag:${change.from} totag:${change.to} src:${recipe.source} key:${child.key}`);
              }
            }
          }
        }

        for (let i = 0; i < recipe.ingredients.length; i++) {
          const ingredient = recipe.ingredients[i];
          for (let j = 0; j < unitChanges.length; j++) {
            const change = unitChanges[j];
            if (ingredient.unit && change.from === ingredient.unit) {
              if (ingredient.amount && ingredient.amount == '1') {
                if (change.to.trim() === '') {
                  log.push(`deleting unit:${ingredient.unit}`);
                  delete recipe.ingredients[i].unit;
                } else {
                  log.push(`setting unit to singular:${ingredient.amount} ${ingredient.unit}`);
                  if (change.from.indexOf('(') > -1) {
                    recipe.ingredients[i].unit = change.from.replace(/\s*\([^()]*\)$/, '');
                  } else {
                    recipe.ingredients[i].unit = change.to.replace(/\s*\([^()]*\)$/, '');
                  }
                  log.push(`to: ${ingredient.amount} ${recipe.ingredients[i].unit}`);
                }
              } else if (change.to.trim() === '') {
                log.push(`deleting unit:${ingredient.unit}`);
                console.log(`unit to delte${recipe.ingredients[i].unit}`);
                delete recipe.ingredients[i].unit;
              } else {
                log.push(`change unit from:${ingredient.unit}`);
                recipe.ingredients[i].unit = change.to;
                log.push(`change unit to:${recipe.ingredients[i].unit}`);
              }
              changesmade = true;
            }
          }
        }

        for (let i = 0; i < recipe.ingredients.length; i++) {
          const ingredient = recipe.ingredients[i];
          if (ingredient.amount && isNaN(ingredient.amount)) {
            if (ingredient.amount.length === 3 && (ingredient.amount.indexOf('/') === 1 || ingredient.amount.indexOf('+') === 1)) {
              log.push(`change amount from:${ingredient.amount}`);

              recipe.ingredients[i].amount = Math.round(eval(ingredient.amount) * 100) / 100;
              log.push(`to:${recipe.ingredients[i].amount}`);

              changesmade = true;
            } else {
              log.push('---------------------------------------------------------------------------------------------');
              log.push(`DELETING recipe>${recipe.source}:${ingredient.amount}`);
              log.push('---------------------------------------------------------------------------------------------');
              deleteRecipe = true;
            }
          }
        }
        if (deleteRecipe) {
          recipesRef.child(child.key).remove();
        } else if (changesmade) {
          const recipeRef = recipesRef.child(child.key);
          recipeRef.update(recipe);
        }
      });

      fs.writeFile(`C:/dev/ettkilomjol resources/${filename}-changename.json`, JSON.stringify(log), (err) => {
        if (err) {
          return console.log(err);
        }
        log.push('logfile saved!');
      });

      console.log('changename done!');
    });
  }
}

function fixFaultyIngredients(options) {
  const recipesRef = firebase.database().ref('recipes');
  const foodRef = firebase.database().ref('foods');
  const tagRef = firebase.database().ref('tags');
  const unitsRef = firebase.database().ref('units');

  const existingFoods = [];
  const existingTags = [];
  let units = {};
  const filename = options[4] || 'import_fixIngredients';
  const log = [];
  let foodLoaded = false;
  let tagLoaded = false;
  let unitsLoaded = false;

  firebase.auth().signInAnonymously().catch((error) => { });
  firebase.auth().onAuthStateChanged((user) => {
    console.log('start fixingredients');
    if (user) {
      foodRef.orderByChild('uses').once('value', (snapshot) => {
        snapshot.forEach((child) => {
          if (child.val().uses == 0) {
            existingFoods.splice(0, 0, child.val().name);
          }
        });

        foodLoaded = true;
        if (foodLoaded && tagLoaded && unitsLoaded) {
          runRecipes();
        }
      });
      tagRef.orderByChild('uses').once('value', (snapshot) => {
        snapshot.forEach((child) => {
          existingTags.splice(0, 0, child.val().name);
        });
        tagLoaded = true;
        if (foodLoaded && tagLoaded && unitsLoaded) {
          runRecipes();
        }
      });
      unitsRef.once('value', (snapshot) => {
        const unitsTmp = snapshot.val();
        for (const type in unitsTmp) {
          if (unitsTmp.hasOwnProperty(type)) {
            const unit = Object.keys(unitsTmp[type]).map(key => unitsTmp[type][key]);
            unit.sort((a, b) => a.ref - b.ref);
            unitsTmp[type] = unit;
          }
        }
        units = unitsTmp;
        unitsLoaded = true;
        if (foodLoaded && tagLoaded && unitsLoaded) {
          runRecipes();
        }
      });
    }
  });

  function runRecipes() {
  // script för att  hitta alla recept som har någon ingrediens med ett visst antal uses
    const namel = 0;
    recipesRef.once('value', (snapshot) => {
      snapshot.forEach((child) => {
        const busted = false;
        const recipe = child.val();
        const originRecipe = child.val();
        const ingredientsFound = [];
        let ingredientToMerge = {};
        const ingredientIndexesToRemove = [];
        const ingredientsToSkip = [];
        let deleteRecipe = false;
        let changesmade = false;
        for (let i = 0; i < recipe.ingredients.length; i++) {
          const ingredient = recipe.ingredients[i];

          if (ingredient.name.startsWith('Förp ') && (!ingredient.unit || ingredient.unit === 'st')) {
            log.push(`ingred changed from:${ingredient.unit}${ingredient.name}`);
            recipe.ingredients[i].name = ingredient.name.substring(5).trim();
            recipe.ingredients[i].name = recipe.ingredients[i].name.charAt(0).toUpperCase() + recipe.ingredients[i].name.slice(1);
            recipe.ingredients[i].unit = 'förp';
            changesmade = true;
            log.push(`to:${recipe.ingredients[i].unit} ${recipe.ingredients[i].name}source:${recipe.source}`);
          } else if (ingredient.name.startsWith('Port ')) {
            log.push(`ingred changed from:${ingredient.unit}${ingredient.name}`);
            recipe.ingredients[i].name = ingredient.name.substring(5).trim();
            recipe.ingredients[i].name = recipe.ingredients[i].name.charAt(0).toUpperCase() + recipe.ingredients[i].name.slice(1);
            recipe.ingredients[i].unit = 'port';
            changesmade = true;
            log.push(`to:${recipe.ingredients[i].unit} ${recipe.ingredients[i].name}source:${recipe.source}`);
          } else if (ingredient.name.startsWith('Skivor ')) {
            log.push(`ingred changed from:${ingredient.unit}${ingredient.name}`);
            recipe.ingredients[i].name = ingredient.name.substring(7).trim();
            recipe.ingredients[i].name = recipe.ingredients[i].name.charAt(0).toUpperCase() + recipe.ingredients[i].name.slice(1);
            recipe.ingredients[i].unit = 'Skivor';
            changesmade = true;
            log.push(`to:${recipe.ingredients[i].unit} ${recipe.ingredients[i].name}source:${recipe.source}`);
          }
        }

        for (let i = 0; i < recipe.ingredients.length; i++) {
          if (ingredientsToSkip.indexOf(i) > -1) {
            continue;
          }
          const ingredient = recipe.ingredients[i];
          if (ingredientToMerge.name == ingredient.name && ingredientIndexesToRemove.indexOf(i) < 0) {
            log.push(`starting merge of: ${ingredientToMerge.name} for recipe:${recipe.source}`);
            if (ingredient.unit == ingredientToMerge.unit || (!ingredient.unit && !ingredientToMerge.unit && ingredientToMerge.amount && ingredient.amount)) {
              const amount1 = recipe.ingredients[i].amount ? +recipe.ingredients[i].amount : 1;
              const amount2 = ingredientToMerge.amount ? +ingredientToMerge.amount : 1;
              recipe.ingredients[i].amount = amount1 + amount2;
              ingredientIndexesToRemove.push(ingredientToMerge.index);
              changesmade = true;
            } else if (!ingredient.unit && !ingredientToMerge.unit && !ingredientToMerge.amount && !ingredient.amount) {
              ingredientIndexesToRemove.push(ingredientToMerge.index);
              changesmade = true;
            } else if (isSameUnitScale(ingredient.unit, ingredientToMerge.unit)) {
              const mergedIngredient = mergeUnits(ingredient, ingredientToMerge);
              if (mergedIngredient && mergedIngredient.unit && mergedIngredient.amount && mergedIngredient.name) {
                recipe.ingredients[i] = mergedIngredient;
                ingredientIndexesToRemove.push(ingredientToMerge.index);
                changesmade = true;
              }
              log.push(`merge and checkunits done: ${JSON.stringify(mergedIngredient)}`);
            } else {
              log.push(`merge error:${ingredientToMerge.unit} ${recipe.ingredients[i].unit}source:${recipe.source}`);
              if (ingredientToMerge.unit && recipe.ingredients[i].unit) {
                deleteRecipe = true;
              }
              ingredientsToSkip.push(ingredientToMerge.index);
            }

            delete ingredientToMerge.index;
            ingredientToMerge = {};
          } else if (ingredientsFound.indexOf(ingredient.name) > -1 && ingredientIndexesToRemove.indexOf(i) < 0) {
            ingredientToMerge = ingredient;
            ingredientToMerge.index = i;
            i = 0;
            ingredientsFound.length = 0;
          } else {
            ingredientsFound.push(ingredient.name);
          }
        }

        if (ingredientsToSkip.length > 0) {
          if (deleteRecipe) {
            log.push('---------------------------------------------------------------------------------------------');
            log.push(`DELETING recipe>${recipe.source}`);
            log.push(`IngredientsToSKip:${JSON.stringify(ingredientsToSkip)}`);
            log.push('---------------------------------------------------------------------------------------------');
            recipesRef.child(child.key).remove();
          } else {
            log.push(`skip DELETING recipe>${recipe.source}`);
          }
        } else if (changesmade) {
          for (let i = ingredientIndexesToRemove.length - 1; i >= 0; --i) {
            recipe.ingredients.splice(ingredientIndexesToRemove[i], 1);
          // flrändringads de andra indexarna nu då? tas fel bort? måste ta i rätt ordning? högst index först?
          }
          log.push('---------------------------------------------------------------------------------------------');
          log.push(`changesmade:${recipe.source}`);
          log.push(JSON.stringify(originRecipe.ingredients));
          log.push('result:');
          log.push(JSON.stringify(recipe.ingredients));
          log.push('---------------------------------------------------------------------------------------------');

          const recipeRef = recipesRef.child(child.key);
          recipeRef.update(recipe);
        }
        function mergeUnits(ingredientA, ingredientB) {
          log.push(`merging units ingredient A ${JSON.stringify(ingredientA)}----------- INgredient B ${JSON.stringify(ingredientB)}`);
          const ingredientResult = {};
          ingredientResult.name = ingredientA.name;
          let foundUnitA;
          let foundUnitB;
          for (const type in units) {
            if (units.hasOwnProperty(type)) {
              for (const unit in units[type]) {
                if (units[type].hasOwnProperty(unit)) {
                  const curUnit = units[type][unit];
                  if (curUnit.name === ingredientA.unit || curUnit.fullName === ingredientA.unit) {
                    foundUnitA = curUnit;
                  }
                  if (curUnit.name === ingredientB.unit || curUnit.fullName === ingredientB.unit) {
                    foundUnitB = curUnit;
                  }
                }
              }
            }
          }
          if (foundUnitA.ref > foundUnitB.ref) {
            const refDiff = foundUnitA.ref / foundUnitB.ref;
            ingredientA.amount *= refDiff;
            ingredientA.unit = ingredientB.unit;
          } else {
            const refDiff = foundUnitB.ref / foundUnitA.ref;
            ingredientB.amount *= refDiff;
            ingredientB.unit = ingredientA.unit;
          }
          ingredientResult.unit = ingredientA.unit;
          ingredientResult.amount = +ingredientA.amount + +ingredientB.amount;

          // den ingrediensen som har den högre uniten ska jag konvertera till den lägre och sen adderar jag amountsen när de är samma unit
          // efter addering så kan jag köra checkUnit() för att möjligen konvertera om det till en högra scale om det behövs
          log.push(`merge fininshed: ${JSON.stringify(ingredientResult)}`);

          return checkUnit(ingredientResult);
        }
        function isSameUnitScale(unitA, unitB) {
          let foundUnitA;
          let foundUnitB;
          for (const type in units) {
            if (units.hasOwnProperty(type)) {
              for (const unit in units[type]) {
                if (units[type].hasOwnProperty(unit)) {
                  const curUnit = units[type][unit];
                  if (curUnit.name === unitA || curUnit.fullName === unitA) {
                    foundUnitA = curUnit;
                  }
                  if (curUnit.name === unitB || curUnit.fullName === unitB) {
                    foundUnitB = curUnit;
                  }
                }
              }
            }
          }
          if (!foundUnitB || !foundUnitA) {
            return false;
          }
          log.push(`foundunits${foundUnitB.name} ${foundUnitA.name}`);
          if (foundUnitA.type === foundUnitB.type) {
            log.push('foundunits return true');

            return true;
          }
          log.push('foundunits return false');
          return false;
        }

        function checkUnit(ingredient) {
          let foundUnit = {};
          for (const type in units) {
            if (units.hasOwnProperty(type)) {
              for (const unit in units[type]) {
                if (units[type].hasOwnProperty(unit)) {
                  const curUnit = units[type][unit];
                  if (curUnit.name === ingredient.unit) {
                    foundUnit = curUnit;
                  }
                }
              }
            }
          }
          if (ingredient.amount >= foundUnit.max) {
            ingredient = findHigherUnit(ingredient, foundUnit);
          } else if (ingredient.amount <= foundUnit.min) {
            ingredient = findLowerUnit(ingredient, foundUnit);
          }
          // här använder jag även lib fraction.js för att hantera decimaler till bråkdelar
          // avrunda till närmsta 1/16 del? 0.0625
          // http://stackoverflow.com/questions/1506554/how-to-round-a-decimal-to-the-nearest-fraction
          // if decimaler finns så fixa fractions istället. 1/16 är det lägsta
          ingredient.amount = closestDecimals(+ingredient.amount);
          // ingredient.amount = Math.round(+ingredient.amount * 100) / 100;
          return ingredient;
        }
        function findLowerUnit(ingredient, selectedUnit) {
          const selectedRef = ingredient.amount * selectedUnit.ref;
          const finalIngredient = ingredient;
          let newUnit;

          for (const unit in units[selectedUnit.type]) {
            if (units[selectedUnit.type].hasOwnProperty(unit)) {
              const curUnit = units[selectedUnit.type][unit];
              if ((selectedRef / curUnit.ref > curUnit.min) && (selectedRef / curUnit.ref < curUnit.max) && (!newUnit || curUnit.ref > newUnit.ref)) {
                newUnit = curUnit;
              }
            }
          }
          if (newUnit) {
            finalIngredient.amount = selectedRef / newUnit.ref;
            finalIngredient.unit = newUnit.name;
          }
          return finalIngredient;
        }


        function findHigherUnit(ingredient, selectedUnit) {
          const selectedRef = ingredient.amount * selectedUnit.ref;
          const finalIngredient = ingredient;
          let newUnit;

          for (const unit in units[selectedUnit.type]) {
            if (units[selectedUnit.type].hasOwnProperty(unit)) {
              const curUnit = units[selectedUnit.type][unit];
              if ((selectedRef / curUnit.ref < curUnit.max) && (selectedRef / curUnit.ref > curUnit.min) && (!newUnit || curUnit.ref < newUnit.ref)) {
                newUnit = curUnit;
              }
            }
          }
          if (newUnit) {
            finalIngredient.amount = selectedRef / newUnit.ref;
            finalIngredient.unit = newUnit.name;
          }
          return finalIngredient;
        }
        function closestDecimals(num) {
          const arr = [0, 0.1, 0.2, 0.25, 0.33, 0.4, 0.5, 0.6, 0.66, 0.75, 0.8, 0.9];
          num = num.toFixed(3);
          const decimal = num - (Math.floor(num));
          let curr = arr[0];
          const diff = Math.abs(decimal - curr);
          for (let i = 0; i < arr.length; i++) {
            if (arr[i] >= decimal) {
              curr = arr[i];
              break;
            }
            if (i == arr.length - 1) {
              curr = 1;
            }
          }
          return num - decimal + curr;
        }
      });
      fs.writeFile(`C:/dev/ettkilomjol resources/${filename}-fixingredients.json`, JSON.stringify(log), (err) => {
        if (err) {
          return console.log(err);
        }
        console.log('logilfe save');
        log.push('logfile saved!');
      });
      console.log('fixingredients done');
    });
  }
}

function recountUsage(options) {
  console.log('recountUsage starting');
  const recipesRef = firebase.database().ref('recipes');
  const foodsRef = firebase.database().ref('foods');
  const tagsRef = firebase.database().ref('tags');

  const existingFoods = [];
  const existingTags = [];
  const recipes = [];
  const foods = {};
  const removedTags = [];
  const tags = {};
  const log = [];
  firebase.auth().signInAnonymously().catch((error) => {
  });
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      firebase.database().ref('foods').remove();
      recipesRef.once('value', (snapshot) => {
        snapshot.forEach((child) => {
          recipes.push(child.val());
        });
        runRecipes();
      });
    }
  });

  function runRecipes() {
    log.push('starting');
    for (let i = 0; i < recipes.length; i++) {
      const recipe = recipes[i];
      for (let j = 0; j < recipe.ingredients.length; j++) {
        const food = recipe.ingredients[j].name;
        if (existingFoods.indexOf(food) > -1) {
          foods[food].uses = foods[food].uses + 1;
        } else if (food.indexOf('/') < 0 && food.trim().length > 0) {
          foods[food] = {
            name: food,
            uses: 0,
          };
          existingFoods.push(food);
        }
      }

      for (const property in recipe.tags) {
        if (recipe.tags.hasOwnProperty(property)) {
          const tag = property;
          if (existingFoods.indexOf(tag) > -1) {
            if (removedTags.indexOf(tag) == -1) {
              removedTags.push(tag);
            }
            continue;
          } else if (existingTags.indexOf(tag) > -1) {
            tags[tag].uses = tags[tag].uses + 1;
          } else {
            tags[tag] = {
              name: tag,
              uses: 0,
            };
            existingTags.push(tag);
          }
        }
      }
    }

    /*
    //filter low usage
    for (const prop in foods) {
      const food = foods[prop];
      if (food.uses < 8) {
        delete foods[prop];
      }
    }
    */

    foodsRef.set(foods);
    tagsRef.set(tags);
    console.log('recountUsage done');
  }
}

module.exports.changeName = changeName;
module.exports.fixFaultyIngredients = fixFaultyIngredients;
module.exports.recountUsage = recountUsage;
