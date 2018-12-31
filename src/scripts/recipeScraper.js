/* eslint no-await-in-loop: 0 */
/* eslint no-loop-func: 0 */
/* eslint no-console: 0 */
const puppeteer = require('puppeteer');
const firebase = require('firebase');
const fs = require('fs');
const importUtil = require('./importUtil.js');

const params = process.argv;

const hardcopySources = [];

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
const isHelp = process.argv.includes('--help');
if (isHelp) {
  console.log('----------------------------------------------------------------------------------------------------------------');
  console.log('| This script is used for scraping recipes from known websites.');
  console.log("| First argument points to which environment to import the recipes. 'dev' or 'prod'");
  console.log('| Second argument is a name for the execution wich will be used to name logfiles etc');
  console.log('| Per default the script will run an array of predefined urls');
  console.log('| You can choose to scrape the latest recipes from each source by using the --latest flag followed by a number or expected recipes per source');
  console.log("| Example 1: 'node recipeScraper.js dev initial_load'");
  console.log("| Example 2: 'node recipeScraper.js prod latest_2019-1 --latest 100'");
  console.log('----------------------------------------------------------------------------------------------------------------');

  process.exit();
}

const enviromentArg = process.argv[2];
let nameArg = process.argv[3];
const isLatest = process.argv.includes('--latest');
const recipesPerSource = process.argv[process.argv.indexOf('--latest') + 1];
if (isLatest && (!recipesPerSource || isNaN(recipesPerSource))) {
  console.log('missing argument for number of recipes per source for latest flag');
  process.exit();
}

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
if (!nameArg || nameArg === '--latest') {
  nameArg = 'import';
}
const filename = `${nameArg}_${today}`;

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
      checkDataLoadComplete();
    });

    foodRef.orderByChild('uses').once('value', (snapshot) => {
      snapshot.forEach((child) => {
        existingFoods.splice(0, 0, child.val().name);
      });
      foodLoaded = true;
      checkDataLoadComplete();
    });
    console.log('LOGGED IN');
  }
});
function checkDataLoadComplete() {
  if (foodLoaded && recipeLoaded) {
    if (isLatest) {
      createLatesRecipes(recipesPerSource);
    } else {
      createRecipes();
    }
  }
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function createLatesRecipes(maxSources) {
  let latestSources = [];
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // koket
  console.log('fetching koket sources');
  let koketSources = [];
  const koketPageLimit = Math.floor(maxSources / 40);

  await page.goto('https://www.koket.se/recept');
  for (let i = 0; i < koketPageLimit; i++) {
    const tmpList = await page.evaluate(() => {
      const xpath = "//h2[text()='Senaste recepten']";
      const matchingElement = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      const recipeList = matchingElement.parentElement;
      if (recipeList.querySelector('.pagination button')) {
        recipeList.querySelector('.pagination button').click();
      }
      return Array.from(recipeList.querySelectorAll('article.recipe h2 a')).map(a => a.href);
    });
    if (koketSources.length === tmpList.length) {
      console.log('koket.se latest: no more recipes');

      break;
    }

    koketSources = tmpList;
    lastBatch = { ...koketSources };
    if (koketSources.length > maxSources) {
      koketSources.length = maxSources;
      break;
    }
    await sleep(2000);
  }

  latestSources = latestSources.concat(koketSources);
  console.log(`sources gathered ${latestSources.length}`);

  // mittkok
  console.log('fetching mittkok sources');
  let mittkokSources = [];
  const recipesPerPage = 12;
  const mittkokDefaultRatio = Math.max(1, Math.floor((maxSources / recipesPerPage) / 10));
  const foodTypes = [
    { url: 'https://mittkok.expressen.se/typ/frukost/', maxPages: mittkokDefaultRatio },
    { url: 'https://mittkok.expressen.se/typ/lunch/', maxPages: mittkokDefaultRatio * 2 },
    { url: 'https://mittkok.expressen.se/typ/middag/', maxPages: mittkokDefaultRatio * 2 },
    { url: 'https://mittkok.expressen.se/typ/forratt/', maxPages: mittkokDefaultRatio * 2 },
    { url: 'https://mittkok.expressen.se/typ/efterratt/', maxPages: mittkokDefaultRatio },
    { url: 'https://mittkok.expressen.se/typ/mellanmal/', maxPages: mittkokDefaultRatio },
    { url: 'https://mittkok.expressen.se/typ/brunch/', maxPages: mittkokDefaultRatio },
  ];
  for (let i = 0; i < foodTypes.length; i++) {
    const foodType = foodTypes[i];
    await page.goto(foodType.url);
    for (let j = 1; j < foodType.maxPages; j++) {
      await page.evaluate(() => {
        if (document.querySelector('.button--get-more')) {
          document.querySelector('.button--get-more').click();
        }
      });
      await sleep(2000);
    }
    const tmpSources = await page.evaluate(() => {
      const tmp = Array.from(document.querySelectorAll('#taxonomy-latest .tile-item--recipe a.tile-item__link')).map(a => a.href);
      return tmp;
    });
    mittkokSources = mittkokSources.concat(tmpSources);
  }
  latestSources = latestSources.concat(mittkokSources);
  console.log(`sources gathered ${latestSources.length}`);


  // ica
  console.log('fetching ica sources');
  let icaSources = [];
  await page.goto('https://www.ica.se/recept/');
  for (let i = 1; i < maxSources; i++) {
    const tmplist = await page.evaluate(() => {
      if ($('a.loadmore')) {
        $('a.loadmore').click();
      }
      return Array.from(document.querySelectorAll('article.recipe header h2.title a')).map(a => a.href);
    });

    icaSources = tmplist;
    if (icaSources.length > maxSources) {
      icaSources.length = maxSources;
      break;
    }
    await sleep(2000);
  }
  latestSources = latestSources.concat(icaSources);
  console.log(`sources gathered ${latestSources.length}`);

  // tasteline
  console.log('fetching tasteline sources');
  let tastelineSources = [];
  const tastelinePagelimit = Math.floor(maxSources / 12);
  for (let i = 1; i < tastelinePagelimit; i++) {
    await page.goto(`https://www.tasteline.com/recept/?sort=senaste&sida=${i}#sok`);
    const tmpSrcs = await page.evaluate(() => Array.from(document.querySelectorAll('.recipe-description a')).map(a => a.href));
    tastelineSources = tastelineSources.concat(tmpSrcs);
    if (tastelineSources.length > maxSources) {
      tastelineSources.length = maxSources;
      break;
    }
  }
  latestSources = latestSources.concat(tastelineSources);
  console.log(`sources gathered ${latestSources.length}`);
  latestSources = latestSources.map(x => x.replace('https:', ''));
  createRecipes(latestSources);
}

async function createRecipes(sources_ = hardcopySources) {
  const sources = [...new Set(sources_)];
  console.log('starting createRecipes');
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const len = sources.length;
  try {
    for (let index = 0; index < len; index++) {
      const source = sources[index];
      console.log(`goto:${source}`);
      await page.goto(`https:${source}`);
      let recipe = {};
      if (source.includes('tasteline.com')) {
        recipe = await page.evaluate(() => {
          if (!document.querySelector('.page-content .recipe-content')) {
            return {};
          }
          const tastelineRecipe = {};
          // title
          tastelineRecipe.title = document.querySelector('.page-content .recipe-description h1').innerHTML.trim();
          // tags
          const tags = {};
          // cannot read property length of null
          const tagElements = document.querySelectorAll('.page-content .recipe-description .category-list a');
          for (const tag of tagElements) {
            const t = tag.text;
            tags[t.charAt(0).toUpperCase() + t.slice(1).replace(/\s*\([^()]*\)/g, '').split(',')[0].replace(/([/.#$])/g, '').trim()] = true;
          }

          tastelineRecipe.tags = tags;
          // source
          tastelineRecipe.source = window.location.href;
          tastelineRecipe.source = tastelineRecipe.source.substr(tastelineRecipe.source.indexOf('tasteline.com'));

          // votes rating
          if (document.querySelector('.page-content .recipe-description .recipe-rating.voting-enabled i')) {
            const ratingLine = document.querySelector('.page-content .recipe-description .recipe-rating.voting-enabled').getAttribute('title');
            const parts = ratingLine.split('Antal röster:');
            tastelineRecipe.votes = parts[1].trim();
            tastelineRecipe.rating = parts[0].split(':')[1].trim();
          }
          // author
          if (document.querySelector('.page-content .recipe-author-text-inner span')) {
            tastelineRecipe.author = document.querySelector('.page-content .recipe-author-text-inner span').innerText.trim();
          } else {
            tastelineRecipe.author = 'tasteline';
          }

          // portions
          if (document.querySelector('.page-content .recipe-content .portions option[selected]')) {
            tastelineRecipe.portions = document.querySelector('.page-content .recipe-content .portions option[selected]').innerHTML.trim();

            // generall portion parser
            if (tastelineRecipe.portions.toUpperCase().startsWith('GER ')) {
              tastelineRecipe.portions = tastelineRecipe.portions.substr(4);
            }
            if (tastelineRecipe.portions.toUpperCase().startsWith('CA ')) {
              tastelineRecipe.portions = tastelineRecipe.portions.substr(3);
            }
            const spaceArr = tastelineRecipe.portions.split(' ');
            if (spaceArr.length === 2 && !isNaN(spaceArr[0]) && spaceArr[1].toUpperCase() === 'PORTIONER') {
              const portions = spaceArr[0];
              tastelineRecipe.portions = portions;
            }
            tastelineRecipe.portions = tastelineRecipe.portions.replace(',', '.');
            if (tastelineRecipe.portions.indexOf('1/2') > -1) {
              tastelineRecipe.portions = tastelineRecipe.portions.replace('1/2', '+.5');
              const parts = tastelineRecipe.portions.split(' ');
              if (!isNaN(parts[0]) && !isNaN(parts[1])) {
                const nr = eval(parts[0] + parts[1]);
                tastelineRecipe.portions = nr + tastelineRecipe.portions.substr(parts[0].length + parts[1].length + 1);
              } else if (!isNaN(parts[0])) {
                const nr = eval(parts[0]);
                tastelineRecipe.portions = nr + tastelineRecipe.portions.substr(parts[0].length);
              } else {
                tastelineRecipe.portions = tastelineRecipe.portions.replace('+.5', '1/2');
              }
            }
            const firstString = tastelineRecipe.portions.split(' ')[0];
            const seperateArray = firstString.split(/([0-9]+)/).filter(Boolean);
            if (seperateArray[1] === '-' && seperateArray.length === 4) {
              const newFirstString = `${seperateArray[0] + seperateArray[1] + seperateArray[2]} ${seperateArray[3]}`;
              tastelineRecipe.portions = newFirstString + tastelineRecipe.portions.substr(firstString.length);
            } else if (seperateArray.length === 2) {
              const newFirstString = `${seperateArray[0]} ${seperateArray[1]}`;
              tastelineRecipe.portions = newFirstString + tastelineRecipe.portions.substr(firstString.length);
            }

            if (tastelineRecipe.portions.toUpperCase().startsWith('GER ')) {
              tastelineRecipe.portions = tastelineRecipe.portions.substr(4);
            }
            if (tastelineRecipe.portions.toUpperCase().startsWith('CA ')) {
              tastelineRecipe.portions = tastelineRecipe.portions.substr(3);
            }
            const parts = tastelineRecipe.portions.split(' ')[0].split('-');
            if (parts.length === 2) {
              let tmp = ((parts[0] - 0) + (parts[1] - 0)) / 2;
              if (tastelineRecipe.portions.split(' ').length > 1) {
                tmp += tastelineRecipe.portions.substr(tastelineRecipe.portions.indexOf(tastelineRecipe.portions.split(' ')[1]) - 1);
              }
              tastelineRecipe.portions = tmp;
            }
          }

          // description
          if (document.querySelector('.page-content .recipe-ingress')) {
            tastelineRecipe.description = document.querySelector('.page-content .recipe-ingress').innerHTML.replace(/(\r\n|\n|\r|<[^>]*>)/gm, '').replace(/  +/g, ' ').trim();
          }

          // time
          if (document.querySelector('.page-content .recipe-description .fa-clock-o')) {
            const timeString = document.querySelector('.page-content .recipe-description .fa-clock-o').nextSibling.nodeValue.trim();
            if (timeString.indexOf('minut') > -1) {
              tastelineRecipe.time = timeString.split(' ')[0] - 0;
            } else if (timeString.indexOf('timm') > -1) {
              tastelineRecipe.time = (timeString.split(' ')[0] - 0) * 60;
            } else {
              return {};
            }
            if (tastelineRecipe.time < 25) {
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
            tastelineRecipe.ingredients = ingredients;
          }
          if (document.querySelector('.recipe-header-image img')) {
            if (document.querySelector('.recipe-header-image img').getAttribute('src')) {
              const img = document.querySelector('.recipe-header-image img');
              tastelineRecipe.image = img.getAttribute('src');
              const imageSize = `${img.naturalWidth}W x ${img.naturalHeight}H`;
              tastelineRecipe.imageSize = imageSize;
            }
          }
          if (!tastelineRecipe.image) {
            tastelineRecipe.image = 'FAILIMG';
          }

          if (!tastelineRecipe.ingredients || tastelineRecipe.ingredients.length === 0 || (tastelineRecipe.time && tastelineRecipe.time < 1)) {
            return {};
          }

          // difficulty
          const instructionsList = document.querySelector('.page-content .recipe-content .steps').getElementsByTagName('li');
          const nrOfIngredients = tastelineRecipe.ingredients.length;
          let instructionLength = 0;
          for (let i = 0; i < instructionsList.length; i++) {
            instructionLength += instructionsList[i].innerHTML.replace(/(\r\n|\n|\r|)/gm, '').trim().length;
          }
          instructionLength -= instructionsList.length * 10;

          let levelIndex = (nrOfIngredients * 8) + (instructionLength / 14);
          if (tastelineRecipe.tags.Enkelt || tastelineRecipe.tags['Lättlagat']) {
            levelIndex -= 100;
          }
          if (tastelineRecipe.tags.Snabbt) {
            levelIndex -= 20;
          }

          if (levelIndex < 100) {
            tastelineRecipe.level = 1;
          } else if (levelIndex < 200) {
            tastelineRecipe.level = 2;
          } else {
            tastelineRecipe.level = 3;
          }
          return tastelineRecipe;
        });
      } else if (source.includes('ica.se')) {
        recipe = await page.evaluate(() => {
          if (!document.querySelector('.recipepage main.container--main')) {
            return {};
          }
          const icaRecipe = {};
          // title
          icaRecipe.title = document.querySelector('.recipepage header h1.recipepage__headline').innerHTML.trim();
          // tags
          const tags = {};

          const tagElements = document.querySelectorAll('.related-recipes .related-recipe-tags__container a');
          for (const tag of tagElements) {
            const t = tag.text;
            tags[t.charAt(0).toUpperCase() + t.slice(1).replace(/\s*\([^()]*\)/g, '').split(',')[0].replace(/([/.#$])/g, '').trim()] = true;
          }
          // cannot read property length of null
          icaRecipe.tags = tags;
          // source
          icaRecipe.source = window.location.href;
          icaRecipe.source = icaRecipe.source.substr(icaRecipe.source.indexOf('ica.se'));
          // rating
          icaRecipe.rating = document.querySelector('.recipepage header .recipe-header a.rating-stars').getAttribute('title');
          if (icaRecipe.rating.endsWith('.0')) {
            icaRecipe.rating = icaRecipe.rating.slice(0, -2);
          }
          // votes
          icaRecipe.votes = document.querySelector('.recipepage header .recipe-header a.rating-stars .recipe-meta .js-number-of-votes').innerHTML;
          // author
          icaRecipe.author = 'ICA';
          // createdFor
          if (document.querySelector('.recipepage .magazine-row a.magazine-row__link')) {
            if (document.querySelector('.recipepage .magazine-row a.magazine-row__link').getAttribute('href') === '/buffe/') {
              icaRecipe.createdFor = 'Buffé';
            }
          }
          // portions  "4småpotioner" trattkantarellsoppan. replace alla bokstäver med ""?
          if (document.querySelector('.recipepage .servings-picker')) {
            icaRecipe.portions = document.querySelector('.recipepage .servings-picker').getAttribute('data-default-portions');
            if (icaRecipe.portions.toUpperCase().startsWith('GER ')) {
              icaRecipe.portions = icaRecipe.portions.substr(4);
            }
            if (icaRecipe.portions.toUpperCase().startsWith('CA ')) {
              icaRecipe.portions = icaRecipe.portions.substr(3);
            }
            icaRecipe.portions = icaRecipe.portions.replace(',', '.');
            if (icaRecipe.portions.indexOf('1/2') > -1) {
              icaRecipe.portions = icaRecipe.portions.replace('1/2', '+.5');
              const parts = icaRecipe.portions.split(' ');
              if (!isNaN(parts[0]) && !isNaN(parts[1])) {
                const nr = eval(parts[0] + parts[1]);
                icaRecipe.portions = nr + icaRecipe.portions.substr(parts[0].length + parts[1].length + 1);
              } else if (!isNaN(parts[0])) {
                const nr = eval(parts[0]);
                icaRecipe.portions = nr + icaRecipe.portions.substr(parts[0].length);
              } else {
                icaRecipe.portions = icaRecipe.portions.replace('+.5', '1/2');
              }
            }
            const firstString = icaRecipe.portions.split(' ')[0];
            const seperateArray = firstString.split(/([0-9]+)/).filter(Boolean);
            if (seperateArray[1] === '-' && seperateArray.length === 4) {
              const newFirstString = `${seperateArray[0] + seperateArray[1] + seperateArray[2]} ${seperateArray[3]}`;
              icaRecipe.portions = newFirstString + icaRecipe.portions.substr(firstString.length);
            } else if (seperateArray.length === 2) {
              const newFirstString = `${seperateArray[0]} ${seperateArray[1]}`;
              icaRecipe.portions = newFirstString + icaRecipe.portions.substr(firstString.length);
            }

            if (icaRecipe.portions.toUpperCase().startsWith('GER ')) {
              icaRecipe.portions = icaRecipe.portions.substr(4);
            }
            if (icaRecipe.portions.toUpperCase().startsWith('CA ')) {
              icaRecipe.portions = icaRecipe.portions.substr(3);
            }
            const parts = icaRecipe.portions.split(' ')[0].split('-');
            if (parts.length === 2) {
              let tmp = ((parts[0] - 0) + (parts[1] - 0)) / 2;
              if (icaRecipe.portions.split(' ').length > 1) {
                tmp += icaRecipe.portions.substr(icaRecipe.portions.indexOf(icaRecipe.portions.split(' ')[1]) - 1);
              }
              icaRecipe.portions = tmp;
            }
          }
          // created

          // description
          if (document.querySelector('.recipepage p.recipe-preamble')) {
            icaRecipe.description = document.querySelector('.recipepage p.recipe-preamble').innerHTML.replace(/(\r\n|\n|\r|<[^>]*>)/gm, '').replace(/  +/g, ' ').trim();
          }
          // time and difficulty
          if (document.querySelector('.recipepage .recipe-meta.recipe-meta--header')) {
            const timeDiff = document.querySelector('.recipepage .recipe-meta.recipe-meta--header').innerHTML.replace(/(\r\n|\n|\r|<[^>]*>)/gm, '').trim().split(' | ');
            const diff = timeDiff[1];
            // diff
            if (diff === 'Enkel') {
              icaRecipe.level = 1;
            } else if (diff === 'Medel') {
              icaRecipe.level = 2;
            } else if (diff === 'Avancerad') {
              icaRecipe.level = 3;
            } else {
              icaRecipe.level = 'FAILEDLEVEL';
            }
            // time
            const timeString = timeDiff[0];
            if (timeString.indexOf('MIN') > -1) {
              icaRecipe.time = timeString.split(' ')[0] - 0;
            } else if (timeString.indexOf('TIM')) {
              const parts = timeString.split(' ')[0].split('-');
              if (parts.length === 1) {
                icaRecipe.time = (timeString.split(' ')[0] - 0) * 60;
              } else {
                icaRecipe.time = (((parts[0] - 0) + (parts[1] - 0)) / 2) * 60;
              }
            } else {
              return {};
            }
            if (icaRecipe.time < 25) {
              if (!tags.Snabbt) {
                tags.Snabbt = true;
              }
            }
          }
          // ingredients
          if (document.querySelector('.recipepage #ingredients-section .ingredients__content .ingredients__list .ingredients__list__item')) {
            const ingredientsDom = document.querySelector('.recipepage #ingredients-section .ingredients__content').getElementsByTagName('li');
            const ingredients = [];
            const ingredientNames = [];
            for (let i = 0; i < ingredientsDom.length; ++i) {
              const ingredient = {};
              const innerHtml = ingredientsDom[i].innerHTML;
              ingredient.amount = ingredientsDom[i].getElementsByTagName('span')[0].innerHTML.trim();
              if (ingredient.amount.indexOf('\/')) {
                const y = ingredient.amount.split(' ');
                if (y.length > 1) {
                  const z = y[1].split('/');
                  ingredient.amount = `${+y[0] + (z[0] / z[1])}`;
                } else {
                  const z = y[0].split('/');
                  if (z.length > 1) {
                    ingredient.amount = `${z[0] / z[1]}`;
                  } else {
                    ingredient.amount = `${z[0]}`;
                  }
                }
              }
              const parts = innerHtml.slice(innerHtml.indexOf('</span>') + 7).split(' ');
              const unit = parts[i];
              ingredient.unit = unit;

              const namepart = innerHtml.slice(innerHtml.indexOf(parts[2] === 'st' ? parts[3] : parts[2])).trim();

              ingredient.name = namepart.charAt(0).toUpperCase() + namepart.slice(1).replace(/\s*\([^()]*\)/g, '').split(',')[0].replace(/([/.#$])/g, '').trim();
              if (ingredientNames.indexOf(ingredient.name) > -1) {
                continue;
              }

              if (ingredient.amount && ingredient.amount.trim() === '') {
                delete ingredient.amount;
              }
              if (ingredient.unit && ingredient.unit.trim() === '') {
                delete ingredient.unit;
              }
              ingredientNames.push(ingredient.name);
              ingredients.push(ingredient);
            }
            icaRecipe.ingredients = ingredients;
          } else if (document.querySelector('.recipepage #ingredients-section ul li span.ingredient')) {
            const ingredientsDom = document.querySelector('.recipepage #ingredients-section').getElementsByClassName('ingredient');
            const ingredients = [];
            const ingredientNames = [];
            for (let i = 0; i < ingredientsDom.length; ++i) {
              const ingredient = {};
              const ingredientDom = ingredientsDom[i];
              const { innerText } = ingredientDom;
              ingredient.amount = ingredientDom.getAttribute('data-amount');
              if (ingredient.amount.endsWith('.0')) {
                ingredient.amount = ingredient.amount.slice(0, -2);
              }
              if (ingredient.amount === '0') {
                ingredient.amount = '';
              }
              ingredient.unit = ingredientDom.getAttribute('data-type');
              let namepart = innerText.slice(ingredient.amount.length + ingredient.unit.length).trim();
              if (ingredient.unit.length > 0) {
                namepart = innerText.slice(innerText.indexOf(ingredient.unit) + ingredient.unit.length + 1).trim();
              } else if (ingredient.amount.length > 0) {
                if (ingredient.amount % 1 !== 0) {
                  const parts = innerText.split(' ');
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

              ingredient.name = namepart.charAt(0).toUpperCase() + namepart.slice(1).replace(/\s*\([^()]*\)/g, '').split(',')[0].replace(/([/.#$])/g, '').trim();
              if (ingredientNames.indexOf(ingredient.name) > -1) {
                continue;
              }

              ingredientNames.push(ingredient.name);
              ingredients.push(ingredient);
            }
            icaRecipe.ingredients = ingredients;
          }
          if (document.querySelector('.recipe-image-square__image')) {
            icaRecipe.image = document.querySelector('.recipe-image-square__image').style.backgroundImage.slice(4, -1).replace(/"/g, '');
          }
          if (!icaRecipe.image) {
            icaRecipe.image = 'FAILIMG';
          }
          if (!icaRecipe.ingredients || icaRecipe.ingredients.length === 0 || (icaRecipe.time && icaRecipe.time < 1)) {
            return {};
          }
          return icaRecipe;
        });
      } else if (source.includes('koket.se')) {
        recipe = await page.evaluate(() => {
          if (document.querySelector('.recipe-column-wrapper .endorsed-banner') || !document.querySelector('.recipe-content-wrapper')) {
            return {};
          }
          const koketRecipe = {};
          // title
          if (document.querySelector('.recipe-content-wrapper h1')) {
            koketRecipe.title = document.querySelector('.recipe-content-wrapper h1').innerHTML;
          }
          // tags
          const tags = {};

          const tagElements = document.querySelectorAll('.category-touch-scroll .btn.green-btn.category');
          for (const tag of tagElements) {
            const t = tag.text.split('/');
            for (let i = 0; i < t.length; i++) {
              tags[t[i].charAt(0).toUpperCase() + t[i].slice(1).replace(/\s*\([^()]*\)/g, '').split(',')[0].replace(/([/.#$])/g, '').trim()] = true;
            }
          }
          koketRecipe.tags = tags;
          // source
          koketRecipe.source = window.location.href;
          koketRecipe.source = koketRecipe.source.substr(koketRecipe.source.indexOf('koket.se'));

          // rating
          koketRecipe.rating = document.querySelector('.recipe-content-wrapper .rating-container.rating').getAttribute('data-setrating');
          // votes
          if (document.querySelector('.recipe-content-wrapper .rating-container.rating span.text')) {
            const votes = document.querySelector('.recipe-content-wrapper .rating-container.rating span.text').innerHTML.split(' ')[0];
            koketRecipe.votes = votes;
          }
          // author
          if (document.querySelector('.recipe-content-wrapper .author-chef a')) {
            koketRecipe.author = document.querySelector('.recipe-content-wrapper .author-chef a').innerHTML;
          }
          // createdFor
          if (document.querySelector('.recipe-content-wrapper .author-source a')) {
            koketRecipe.createdFor = document.querySelector('.recipe-content-wrapper .author-source a').innerHTML;
          }
          // portions  "4småpotioner" trattkantarellsoppan. replace alla bokstäver med ""?
          if (document.querySelector('.recipe-content-wrapper .recipe-info.portions span.amount')) {
            koketRecipe.portions = document.querySelector('.recipe-content-wrapper .recipe-info.portions span.amount').innerText.trim();
            // generall portion parser
            if (koketRecipe.portions.toUpperCase().startsWith('GER ')) {
              koketRecipe.portions = koketRecipe.portions.substr(4);
            }
            if (koketRecipe.portions.toUpperCase().startsWith('CA ')) {
              koketRecipe.portions = koketRecipe.portions.substr(3);
            }
            const spaceArr = koketRecipe.portions.split(' ');
            if (spaceArr.length === 2 && !isNaN(spaceArr[0]) && spaceArr[1].toUpperCase() === 'PORTIONER') {
              const portions = spaceArr[0];
              koketRecipe.portions = portions;
            }
            koketRecipe.portions = koketRecipe.portions.replace(',', '.');
            if (koketRecipe.portions.indexOf('1/2') > -1) {
              koketRecipe.portions = koketRecipe.portions.replace('1/2', '+.5');
              const parts = koketRecipe.portions.split(' ');
              if (!isNaN(parts[0]) && !isNaN(parts[1])) {
                const nr = eval(parts[0] + parts[1]);
                koketRecipe.portions = nr + koketRecipe.portions.substr(parts[0].length + parts[1].length + 1);
              } else if (!isNaN(parts[0])) {
                const nr = eval(parts[0]);
                koketRecipe.portions = nr + koketRecipe.portions.substr(parts[0].length);
              } else {
                koketRecipe.portions = koketRecipe.portions.replace('+.5', '1/2');
              }
            }
            const firstString = koketRecipe.portions.split(' ')[0];
            const seperateArray = firstString.split(/([0-9]+)/).filter(Boolean);
            if (seperateArray[1] === '-' && seperateArray.length === 4) {
              const newFirstString = `${seperateArray[0] + seperateArray[1] + seperateArray[2]} ${seperateArray[3]}`;
              koketRecipe.portions = newFirstString + koketRecipe.portions.substr(firstString.length);
            } else if (seperateArray.length === 2) {
              const newFirstString = `${seperateArray[0]} ${seperateArray[1]}`;
              koketRecipe.portions = newFirstString + koketRecipe.portions.substr(firstString.length);
            }

            if (koketRecipe.portions.toUpperCase().startsWith('GER ')) {
              koketRecipe.portions = koketRecipe.portions.substr(4);
            }
            if (koketRecipe.portions.toUpperCase().startsWith('CA ')) {
              koketRecipe.portions = koketRecipe.portions.substr(3);
            }
            const parts = koketRecipe.portions.split(' ')[0].split('-');
            if (parts.length === 2) {
              let tmp = ((parts[0] - 0) + (parts[1] - 0)) / 2;
              if (koketRecipe.portions.split(' ').length > 1) {
                tmp += koketRecipe.portions.substr(koketRecipe.portions.indexOf(koketRecipe.portions.split(' ')[1]) - 1);
              }
              koketRecipe.portions = tmp;
            }
          }
          // created
          if (document.querySelector('.recipe-content-wrapper .description meta[itemprop="datePublished"]')) {
            koketRecipe.created = document.querySelector('.recipe-content-wrapper .description meta[itemprop="datePublished"]').getAttribute('content');
          }
          // description
          if (document.querySelector('.recipe-content-wrapper .recipe-article .description p:first-child')) {
            koketRecipe.description = document.querySelector('.recipe-content-wrapper .recipe-article .description p:first-child').innerHTML.replace(/(\r\n|\n|\r|<[^>]*>)/gm, '').replace(/  +/g, ' ');
          }
          // time
          if (document.querySelector('.recipe-content-wrapper .cooking-time')) {
          // koket.se använder flera olika format på tid så det är inte lätt att ta ut ett generellt värde
            let timenr = 0;
            const timeString = document.querySelector('.recipe-content-wrapper .cooking-time .time').innerHTML.replace(/(\r\n|\n|\r|)/gm, '').trim();
            const parts = timeString.replace('ca', '').replace(/,/g, '.').trim().split(' ');
            for (let j = 0; j < parts.length; j++) {
              if (Number.isInteger(parts[j] - 0) || parts[j].indexOf('.') > -1) {
                if (!parts[j + 1] || parts[j + 1].indexOf('min') > -1 || parts[j + 1].indexOf('m') > -1) {
                  timenr += parts[j] - 0;
                } else if (parts[j + 1].indexOf('dagar') > -1 || parts[j + 1].indexOf('dygn') > -1) {
                  timenr += parts[j] * 60 * 24;
                } else if (parts[j + 1].indexOf('h') > -1) {
                  timenr += parts[j] * 60;
                } else {
                  return {};
                }
                j += 1;
              } else if (parts[j].indexOf('-') > -1) {
                const nrparts = parts[j].split('-');
                if (!parts[j + 1] || parts[j + 1].indexOf('m') > -1 || parts[j + 1].indexOf('min') > -1) {
                  timenr += ((nrparts[0] - 0) + (nrparts[1] - 0)) / 2;
                } else if (parts[j + 1].indexOf('h') > -1) {
                  timenr += (((nrparts[0] - 0) + (nrparts[1] - 0)) / 2) * 60;
                } else if (parts[j + 1].indexOf('d') > -1) {
                  timenr += ((((nrparts[0] - 0) + (nrparts[1] - 0)) / 2) * 60) * 24;
                }
              } else if (parts[j].indexOf('h') > -1) {
                timenr += (parts[j].substring(0, parts[j].indexOf('h')) - 0) * 60;
              } else if (parts[j].indexOf('m') > -1) {
                timenr += parts[j].substring(0, parts[j].indexOf('m')) - 0;
              } else if (parts[j].indexOf('min') > -1) {
                timenr += parts[j].substring(0, parts[j].indexOf('min')) - 0;
              } else {
                return {};
              }
            }
            if (timenr === 0) {
              return {};
            }
            koketRecipe.time = timenr;
            if (koketRecipe.time < 25) {
              if (!tags.Snabbt) {
                tags.Snabbt = true;
              }
            }
          }
          // ingredients
          if (document.querySelector('.recipe-column-wrapper #ingredients-component')) {
            const ingredientsDom = document.querySelector('.recipe-column-wrapper #ingredients-component #ingredients').getElementsByTagName('li');
            const ingredients = [];
            const ingredientNames = [];
            for (let i = 0; i < ingredientsDom.length; ++i) {
              const ingredient = {};
              const parts = ingredientsDom[i].getElementsByTagName('span');
              const namepart = parts[2].innerHTML.trim();
              ingredient.name = namepart.charAt(0).toUpperCase() + namepart.slice(1).replace(/\s*\([^()]*\)/g, '').split(',')[0].replace(/([/.#$])/g, '');
              if (ingredientNames.indexOf(ingredient.name) > -1) {
                continue;
              }
              const amount = parts[1].innerHTML;
              if (amount.length > 0) {
                const amountParts = amount.split(' ');
                const amountPart = amountParts[0];
                ingredient.amount = amountPart;
                if (amountParts.length > 1) {
                  const unitPart = amountParts[1];
                  ingredient.unit = unitPart;
                  if (!/\d/.test(ingredient.amount)) {
                    const amountPart2 = amountParts[1];
                    const unitPart2 = amountParts[0];
                    ingredient.amount = amountPart2;
                    ingredient.unit = unitPart2;
                  }
                }
              }
              if (ingredient.amount.trim() === '') {
                delete ingredient.amount;
              }
              if (ingredient.unit.trim() === '') {
                delete ingredient.unit;
              }
              if (ingredient.amount && isNaN(ingredient.amount)) {
                ingredient.amount = ingredient.amount.replace(/,/g, '.');
                if (ingredient.amount.indexOf('-') > -1) {
                  const splited = ingredient.amount.split('-');
                  const first = +splited[0];
                  const second = +splited[1];
                  ingredient.amount = (first + second) / 2;
                  ingredient.amount += '';
                }
                if (ingredient.amount.indexOf('/') > -1) {
                  ingredient.amount = `${eval(ingredient.amount).toFixed(2)}`;
                }
              }
              ingredientNames.push(ingredient.name);
              ingredients.push(ingredient);
            }
            koketRecipe.ingredients = ingredients;
          }
          // difficulty
          const instructionsList = document.querySelector('.recipe-column-wrapper #step-by-step').getElementsByTagName('li');
          const nrOfIngredients = koketRecipe.ingredients.length;
          let instructionLength = 0;
          for (let i = 0; i < instructionsList.length; i++) {
            instructionLength += instructionsList[i].getElementsByTagName('span')[0].innerHTML.replace(/(\r\n|\n|\r|)/gm, '').trim().length;
          }
          instructionLength -= instructionsList.length * 10;

          let levelIndex = (nrOfIngredients * 8) + (instructionLength / 14);
          if (koketRecipe.tags.Enkelt || koketRecipe.tags['Lättlagat']) {
            levelIndex -= 100;
          }
          if (koketRecipe.tags.Snabbt) {
            levelIndex -= 20;
          }

          if (levelIndex < 100) {
            koketRecipe.level = 1;
          } else if (levelIndex < 200) {
            koketRecipe.level = 2;
          } else {
            koketRecipe.level = 3;
          }
          if (document.querySelector('.image-container meta[itemprop="image"]')) {
            koketRecipe.image = document.querySelector('.image-container meta[itemprop="image"]').getAttribute('content');
          }
          if (!koketRecipe.image) {
            koketRecipe.image = 'FAILIMG';
          }

          if (koketRecipe.ingredients.length === 0 || (koketRecipe.time && koketRecipe.time < 1)) {
            return {};
          }
          return koketRecipe;
        });
      } else if (source.includes('mittkok')) {
        recipe = await page.evaluate(() => {
          if (!document.querySelector('.recipe .recipe__content')) {
            return {};
          }
          const mittkokRecipe = {};
          // title
          mittkokRecipe.title = document.querySelector('.recipe__title').innerHTML.trim();
          // tags
          const tags = {};
          // cannot read property length of null
          const tagElements = document.querySelectorAll('.recipe .recipe__tags a');
          for (const tag of tagElements) {
            let t = tag.text;
            if (t.match(/^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/)) {
              t += 'ERROR';
            }
            tags[t.charAt(0).toUpperCase() + t.slice(1).replace(/\s*\([^()]*\)/g, '').split(',')[0].replace(/([/.#$])/g, '').trim()] = true;
          }
          mittkokRecipe.tags = tags;
          // source
          mittkokRecipe.source = window.location.href;
          mittkokRecipe.source = mittkokRecipe.source.substr(mittkokRecipe.source.indexOf('mittkok.expressen.se'));

          // votes rating
          if (document.querySelector('.recipe .recipe__rate .rate__meta')) {
            mittkokRecipe.votes = document.querySelector('.recipe .recipe__rate .rate__meta meta[itemprop=ratingCount]').getAttribute('content').trim();
            mittkokRecipe.rating = document.querySelector('.recipe .recipe__rate .rate__meta meta[itemprop=ratingValue]').getAttribute('content').trim();
          }
          // author
          if (document.querySelector('.recipe .author__name')) {
            mittkokRecipe.author = document.querySelector('.recipe .author__name span[itemprop=name]').innerText.trim();
          } else {
            mittkokRecipe.author = 'Mitt kök';
          }

          // createdFor

          // portions
          if (document.querySelector('.recipe .recipe__portions')) {
            mittkokRecipe.portions = document.querySelector('.recipe .recipe__portions').innerText.trim();
            // generall portion parser
            if (mittkokRecipe.portions.toUpperCase().startsWith('GER ')) {
              mittkokRecipe.portions = mittkokRecipe.portions.substr(4);
            }
            if (mittkokRecipe.portions.toUpperCase().startsWith('CA ')) {
              mittkokRecipe.portions = mittkokRecipe.portions.substr(3);
            }
            const spaceArr = mittkokRecipe.portions.split(' ');
            if (spaceArr.length === 2 && !isNaN(spaceArr[0]) && spaceArr[1].toUpperCase() === 'PORTIONER') {
              const portions = spaceArr[0];
              mittkokRecipe.portions = portions;
            }
            mittkokRecipe.portions = mittkokRecipe.portions.replace(',', '.');
            if (mittkokRecipe.portions.indexOf('1/2') > -1) {
              mittkokRecipe.portions = mittkokRecipe.portions.replace('1/2', '+.5');
              const parts = mittkokRecipe.portions.split(' ');
              if (!isNaN(parts[0]) && !isNaN(parts[1])) {
                const nr = eval(parts[0] + parts[1]);
                mittkokRecipe.portions = nr + mittkokRecipe.portions.substr(parts[0].length + parts[1].length + 1);
              } else if (!isNaN(parts[0])) {
                const nr = eval(parts[0]);
                mittkokRecipe.portions = nr + mittkokRecipe.portions.substr(parts[0].length);
              } else {
                mittkokRecipe.portions = mittkokRecipe.portions.replace('+.5', '1/2');
              }
            }
            const firstString = mittkokRecipe.portions.split(' ')[0];
            const seperateArray = firstString.split(/([0-9]+)/).filter(Boolean);
            if (seperateArray[1] === '-' && seperateArray.length === 4) {
              const newFirstString = `${seperateArray[0] + seperateArray[1] + seperateArray[2]} ${seperateArray[3]}`;
              mittkokRecipe.portions = newFirstString + mittkokRecipe.portions.substr(firstString.length);
            } else if (seperateArray.length === 2) {
              const newFirstString = `${seperateArray[0]} ${seperateArray[1]}`;
              mittkokRecipe.portions = newFirstString + mittkokRecipe.portions.substr(firstString.length);
            }

            if (mittkokRecipe.portions.toUpperCase().startsWith('GER ')) {
              mittkokRecipe.portions = mittkokRecipe.portions.substr(4);
            }
            if (mittkokRecipe.portions.toUpperCase().startsWith('CA ')) {
              mittkokRecipe.portions = mittkokRecipe.portions.substr(3);
            }
            const parts = mittkokRecipe.portions.split(' ')[0].split('-');
            if (parts.length === 2) {
              let tmp = ((parts[0] - 0) + (parts[1] - 0)) / 2;
              if (mittkokRecipe.portions.split(' ').length > 1) {
                tmp += mittkokRecipe.portions.substr(mittkokRecipe.portions.indexOf(mittkokRecipe.portions.split(' ')[1]) - 1);
              }
              mittkokRecipe.portions = tmp;
            }
          }
          // created

          // description
          if (document.querySelector('.recipe .recipe__description p')) {
            mittkokRecipe.description = document.querySelector('.recipe .recipe__description p').innerHTML.replace(/(\r\n|\n|\r|<[^>]*>)/gm, '').replace(/  +/g, ' ').trim();
          }

          // time
          if (document.querySelector('.recipe time.recipe__time')) {
          // 90 minuter
          // 2.5 tim
          // 2 timmar
            const timeString = document.querySelector('.recipe time.recipe__time').innerHTML.trim();
            if (timeString.indexOf('min') > -1 && timeString.indexOf('tim') > -1) {
              mittkokRecipe.time = `ERROR${timeString}`;
            } else if (timeString.indexOf('min') > -1) {
              if (timeString.indexOf('–') > -1) {
                const firstPart = +timeString.split('–')[0];
                const secondPart = +timeString.split('–')[1];
                mittkokRecipe.time = (firstPart + secondPart) / 2;
              } else if (timeString.indexOf('-') > -1) {
                const firstPart = +timeString.split('-')[0];
                const secondPart = +timeString.split('-')[1];
                mittkokRecipe.time = (firstPart + secondPart) / 2;
              } else {
                mittkokRecipe.time = timeString.split(' ')[0] - 0;
              }
            } else if (timeString.indexOf('tim') > -1) {
              if (timeString.indexOf('–') > -1) {
                const firstPart = +timeString.split('–')[0];
                const secondPart = +timeString.split('–')[1];
                mittkokRecipe.time = ((firstPart + secondPart) / 2) * 60;
              } else if (timeString.indexOf('-') > -1) {
                const firstPart = +timeString.split('-')[0];
                const secondPart = +timeString.split('-')[1];
                mittkokRecipe.time = ((firstPart + secondPart) / 2) * 60;
              } else {
                mittkokRecipe.time = (timeString.split(' ')[0] - 0) * 60;
              }
            } else {
              mittkokRecipe.time = `ERROR${timeString}`;
            }
            if (mittkokRecipe.time < 25) {
              if (!tags.Snabbt) {
                tags.Snabbt = true;
              }
            }
          }
          // ingredients
          if (document.querySelector('.recipe .recipe__ingredients--inner ul li')) {
            const ingredientList = document.querySelectorAll('.recipe__ingredients--inner li');
            // ingredienser unit amount delas med visst antal mellanslag
            // ostadigt sätt att hantera 1/2 och 3-4 osv. på amount som fastnat i name.
            // testa och det går alltid att backa genom att ta bort alla recept som innehåller "mittkok" i source.
            // uppskattad förväntad antal inlästa recept 2000-2500
            const ingredients = [];
            const ingredientNames = [];
            for (let i = 0; i < ingredientList.length; i++) {
              const ingredientArray = ingredientList[i].getElementsByTagName('span')[0].innerHTML.replace(/(\r\n|\n|\r|<[^>]*>)/gm, '').replace(/&#8232;/g, '').split('            ');
              let ingredient = {};
              if (ingredientArray.length === 1) {
                ingredient.name = ingredientArray[0].trim().replace(/\s*\([^()]*\)/g, '').split(',')[0].replace(/([.#$])/g, '').trim();
              }
              if (ingredientArray.length === 2) {
                ingredient.amount = ingredientArray[0].trim();
                ingredient.name = ingredientArray[1].trim().replace(/\s*\([^()]*\)/g, '').split(',')[0].replace(/([.#$])/g, '').trim();
              }
              if (ingredientArray.length === 3) {
                ingredient.amount = ingredientArray[0].trim();
                ingredient.unit = ingredientArray[1].trim();
                ingredient.name = ingredientArray[2].trim().replace(/\s*\([^()]*\)/g, '').split(',')[0].replace(/([.#$])/g, '').trim();
              }
              if (ingredientArray.length > 3) {
                ingredient.name = `ERROR:${ingredientArray.toString()}`;
              }
              if (!isNaN(ingredient.name.split(' ')[0]) && ingredient.name.split(' ').length === 2) {
                const amount = ingredient.name.split(' ')[0];
                ingredient.amount = amount;
                ingredient.name = ingredient.name.split(' ')[1].trim();
              }
              if (!isNaN(ingredient.name.split(' ')[0]) && ingredient.name.split(' ').length === 3) {
                ingredient = {
                  amount: ingredient.name.split(' ')[0],
                  unit: ingredient.name.split(' ')[1],
                  name: ingredient.name.split(' ')[2],
                };
              }
              if (ingredient.name.startsWith('1/2') && ingredient.name.split(' ').length === 2) {
                ingredient.amount = ingredient.amount ? +ingredient.amount + 0.5 : 0.5;
                ingredient.amount += '';
                const name = ingredient.name.split(' ')[1];
                ingredient.name = name;
              }
              if (ingredient.name.startsWith('1/2') && ingredient.name.split(' ').length === 3) {
                ingredient = {
                  amount: ingredient.amount ? +ingredient.amount + 0.5 : 0.5,
                  unit: ingredient.name.split(' ')[1],
                  name: ingredient.name.split(' ')[2],
                };
                ingredient.amount += '';
              }
              if (ingredient.name.startsWith('½') && ingredient.name.split(' ').length === 2) {
                ingredient.amount = ingredient.amount ? +ingredient.amount + 0.5 : 0.5;
                ingredient.amount += '';
                const name = ingredient.name.split(' ')[1];
                ingredient.name = name;
              } if (ingredient.name.startsWith('½') && ingredient.name.split(' ').length === 3) {
                ingredient = {
                  amount: ingredient.amount ? +ingredient.amount + 0.5 : 0.5,
                  unit: ingredient.name.split(' ')[1],
                  name: ingredient.name.split(' ')[2],
                };
                ingredient.amount += '';
              } if (ingredient.name.startsWith(ingredient.name.split('–')[0]) && !isNaN(ingredient.name.split('–')[0]) && ingredient.name.split(' ').length === 3) {
                const amountParts = ingredient.name.split(' ')[0];
                const firstPart = +amountParts.split('–')[0];
                const secondPart = +amountParts.split('–')[1];
                ingredient = {
                  amount: (firstPart + secondPart) / 2,
                  unit: ingredient.name.split(' ')[1],
                  name: ingredient.name.split(' ')[2],
                };
                ingredient.amount += '';
              } if (ingredient.name.startsWith(ingredient.name.split('–')[0]) && !isNaN(ingredient.name.split('–')[0]) && ingredient.name.split(' ').length === 2) {
                const amountParts = ingredient.name.split(' ')[0];
                const firstPart = +amountParts.split('–')[0];
                const secondPart = +amountParts.split('–')[1];
                ingredient.amount = (firstPart + secondPart) / 2;
                ingredient.amount += '';
                const name = ingredient.name.split(' ')[1];
                ingredient.name = name;
              }
              if (ingredient.name.startsWith(ingredient.name.split('-')[0]) && !isNaN(ingredient.name.split('-')[0]) && ingredient.name.split(' ').length === 3) {
                const amountParts = ingredient.name.split(' ')[0];
                const firstPart = +amountParts.split('-')[0];
                const secondPart = +amountParts.split('-')[1];
                ingredient = {
                  amount: (firstPart + secondPart) / 2,
                  unit: ingredient.name.split(' ')[1],
                  name: ingredient.name.split(' ')[2],
                };
                ingredient.amount += '';
              }
              if (ingredient.name.startsWith(ingredient.name.split('-')[0]) && !isNaN(ingredient.name.split('-')[0]) && ingredient.name.split(' ').length === 2) {
                const amountParts = ingredient.name.split(' ')[0];
                const firstPart = +amountParts.split('-')[0];
                const secondPart = +amountParts.split('-')[1];
                ingredient.amount = (firstPart + secondPart) / 2;
                ingredient.amount += '';
                const name = ingredient.name.split(' ')[1];
                ingredient.name = name;
              }
              if (ingredient.amount.indexOf('½') > -1) {
                const splitAmount = ingredient.amount.split(' ');
                if (splitAmount.length === 1) {
                  ingredient.amount = 0.5;
                } else {
                  ingredient.amount = +splitAmount[0] + 0.5;
                }
                ingredient.amount += '';
              }
              if (ingredient.amount.indexOf('1/2') > -1) {
                const splitAmount = ingredient.amount.split(' ');
                if (splitAmount.length === 1) {
                  ingredient.amount = 0.5;
                } else {
                  ingredient.amount = +splitAmount[0] + 0.5;
                }
                ingredient.amount += '';
              }
              if (ingredient.amount.indexOf('–') > -1) {
                const firstPart = +ingredient.amount.split('–')[0];
                const secondPart = +ingredient.amount.split('–')[1];
                ingredient.amount = (firstPart + secondPart) / 2;
                ingredient.amount += '';
              }
              if (ingredient.amount.indexOf('-') > -1) {
                const firstPart = +ingredient.amount.split('-')[0];
                const secondPart = +ingredient.amount.split('-')[1];
                ingredient.amount = (firstPart + secondPart) / 2;
                ingredient.amount += '';
              }
              ingredient.name = ingredient.name.charAt(0).toUpperCase() + ingredient.name.slice(1);
              if (ingredientNames.indexOf(ingredient.name) > -1) {
                continue;
              }
              if (ingredient.amount.trim() === '') {
                delete ingredient.amount;
              }
              if (ingredient.unit.trim() === '') {
                delete ingredient.unit;
              }
              if (ingredient.amount && isNaN(ingredient.amount)) {
                ingredient.amount = ingredient.amount.replace(/,/g, '.');
              }
              ingredientNames.push(ingredient.name);
              ingredients.push(ingredient);
            }
            mittkokRecipe.ingredients = ingredients;
          }
          if (!mittkokRecipe.ingredients || mittkokRecipe.ingredients.length === 0 || (mittkokRecipe.time && mittkokRecipe.time < 1)) {
            return {};
          }

          // difficulty
          const instructionsList = document.querySelector('.recipe .recipe__instructions--inner').getElementsByTagName('li');
          const nrOfIngredients = mittkokRecipe.ingredients.length;
          let instructionLength = 0;
          for (let i = 0; i < instructionsList.length; i++) {
            instructionLength += instructionsList[i].innerHTML.replace(/(\r\n|\n|\r|)/gm, '').trim().length;
          }
          instructionLength -= instructionsList.length * 10;

          let levelIndex = (nrOfIngredients * 8) + (instructionLength / 14);
          if (mittkokRecipe.tags.Enkelt || mittkokRecipe.tags['Lättlagat']) {
            levelIndex -= 100;
          }
          if (mittkokRecipe.tags.Snabbt) {
            levelIndex -= 20;
          }
          if (levelIndex < 100) {
            mittkokRecipe.level = 1;
          } else if (levelIndex < 200) {
            mittkokRecipe.level = 2;
          } else {
            mittkokRecipe.level = 3;
          }
          if (document.querySelector('.recipe__card .recipe__image > img')) {
            const img = document.querySelector('.recipe__card .recipe__image > img');
            mittkokRecipe.image = img.getAttribute('src');
            const imageSize = `${img.naturalWidth}W x ${img.naturalHeight}H`;
            mittkokRecipe.imageSize = imageSize;
          }
          if (!mittkokRecipe.image) {
            mittkokRecipe.image = 'FAILIMG';
          }
          return mittkokRecipe;
        });
      } else {
        console.log(`error on:${source}`);
      }
      console.log(`progress:${index} ( ${Math.floor((index / len) * 100)}% )`);
      if (!recipe.source) {
        continue;
      }
      log.push(`IMGSIZE: ${recipe.imageSize} - ${recipe.image}`);
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
        console.log('updated');
        nrOfRecipesUpdated += 1;
      } else {
        recipesRef.push(recipe);
        nrOfRecipesCreated += 1;
        existingRecipes.push(recipe);
        console.log('created');
      }
      final.push(recipe);
    }
  } catch (error) {
    console.log(error);
    log.push(error);
  } finally {
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
  }
  const baseDelay = sources.length + existingRecipes.length;
  setTimeout(importUtil.changeName, baseDelay + 5000);
  setTimeout(importUtil.fixFaultyIngredients, baseDelay * 2 + 10000);
  setTimeout(importUtil.recountUsage, baseDelay * 3 + 20000);
  setTimeout(process.exit, baseDelay * 4 + 25000);
}

function cleanRecipe(recipe_) {
  const recipe = recipe_;
  if (recipe.title.indexOf('&amp;') > -1) {
    recipe.title = recipe.title.replace(/&amp;/g, '&');
    // lägg tilll /g så det blir replace all
    // fortsätt kollla på recplace i andra scripts
  }
  for (let h = 0; h < recipe.ingredients.length; h++) {
    if (recipe.ingredients[h].unit && recipe.ingredients[h].unit.trim() === '') {
      delete recipe.ingredients[h].unit;
    }
    if (recipe.ingredients[h].amount && recipe.ingredients[h].amount.trim() === '') {
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
