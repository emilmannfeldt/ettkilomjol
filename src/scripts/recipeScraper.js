/* eslint no-await-in-loop: 0 */
/* eslint no-loop-func: 0 */


const puppeteer = require('puppeteer');

const sources = ['http://www.tasteline.com/recept/lax-och-potatiswraps/',
  'http://www.tasteline.com/recept/kesosallad-med-aprikoser-och-notter/',
  'http://www.tasteline.com/recept/frasch-sallad/',
  'http://www.tasteline.com/recept/blabarsfrukost/',
  'http://www.tasteline.com/recept/auberginerora-3/',
];
// börja med tasteline all the way.
// antingen skriv receptet till firebase efter varje scrape eller gör det i batches eller allt i slutet.
// testa starta det här scritpet från en knapp i appen.
// Får nog lägga in det här i en react component och skapa en hel route för import av recept. mocka hur jag gjort med faq/stats.
// testa ta in värden för sources genom formulär brevid knappen.
// logga ut resultat och progress till formuläret

// snygga till tastelinescriptet
// lägg till bildsource från tasteline,
// lägg till ica, koket, mittkok

// lägg till några quickimport knappar ("improtera senaste från tasteline") där jag har yterligare script redo som hämtar vissa sources.
// kanske körs i två steg där formuläret populeras och man kan se sources innan man väljer att faktiskt köpra importen.

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  for (let index = 0; index < sources.length; index++) {
    const source = sources[index];
    await page.goto(source);
    let result = {};
    if (source.includes('tasteline.com')) {
      result = await page.evaluate(() => {
        if (!document.querySelector('.page-content .recipe-content')) {
          return;
        }
        const recipe = {};
        // title
        recipe.title = document.querySelector('.page-content .recipe-description h1').innerHTML.trim();
        // tags
        const tags = {};
        // cannot read property length of null
        const tagElements = document.querySelectorAll('.page-content .recipe-description .category-list a');
        for (const tag of tagElements) {
          const t = tag.text;
          tags[t.charAt(0).toUpperCase() + t.slice(1).replace(/\s*\([^()]*\)/g, '').split(',')[0].replace(/([/.#$])/g, '').trim()] = true;
        }

        recipe.tags = tags;
        // source
        recipe.source = window.location.href;
        recipe.source = recipe.source.substr(recipe.source.indexOf('tasteline.com'));


        // votes rating
        if (document.querySelector('.page-content .recipe-description .recipe-rating.voting-enabled i')) {
          const ratingLine = document.querySelector('.page-content .recipe-description .recipe-rating.voting-enabled').getAttribute('title');
          const parts = ratingLine.split('Antal röster:');
          recipe.votes = parts[1].trim();
          recipe.rating = parts[0].split(':')[1].trim();
        }
        // author
        if (document.querySelector('.page-content .recipe-author-text-inner span')) {
          recipe.author = document.querySelector('.page-content .recipe-author-text-inner span').innerText.trim();
        } else {
          recipe.author = 'tasteline';
        }

        // createdFor

        // portions
        if (document.querySelector('.page-content .recipe-content .portions option[selected]')) {
          recipe.portions = document.querySelector('.page-content .recipe-content .portions option[selected]').innerHTML.trim();

          // generall portion parser
          if (recipe.portions.toUpperCase().startsWith('GER ')) {
            recipe.portions = recipe.portions.substr(4);
          }
          if (recipe.portions.toUpperCase().startsWith('CA ')) {
            recipe.portions = recipe.portions.substr(3);
          }
          const spaceArr = recipe.portions.split(' ');
          if (spaceArr.length === 2 && !isNaN(spaceArr[0]) && spaceArr[1].toUpperCase() === 'PORTIONER') {
            recipe.portions = spaceArr[0];
          }
          recipe.portions = recipe.portions.replace(',', '.');
          if (recipe.portions.indexOf('1/2') > -1) {
            recipe.portions = recipe.portions.replace('1/2', '+.5');
            const parts = recipe.portions.split(' ');
            if (!isNaN(parts[0]) && !isNaN(parts[1])) {
              const nr = eval(parts[0] + parts[1]);
              recipe.portions = nr + recipe.portions.substr(parts[0].length + parts[1].length + 1);
            } else if (!isNaN(parts[0])) {
              const nr = eval(parts[0]);
              recipe.portions = nr + recipe.portions.substr(parts[0].length);
            } else {
              recipe.portions = recipe.portions.replace('+.5', '1/2');
            }
          }
          const firstString = recipe.portions.split(' ')[0];
          const seperateArray = firstString.split(/([0-9]+)/).filter(Boolean);
          if (seperateArray[1] === '-' && seperateArray.length === 4) {
            const newFirstString = `${seperateArray[0] + seperateArray[1] + seperateArray[2]} ${seperateArray[3]}`;
            recipe.portions = newFirstString + recipe.portions.substr(firstString.length);
          } else if (seperateArray.length === 2) {
            const newFirstString = `${seperateArray[0]} ${seperateArray[1]}`;
            recipe.portions = newFirstString + recipe.portions.substr(firstString.length);
          }

          if (recipe.portions.toUpperCase().startsWith('GER ')) {
            recipe.portions = recipe.portions.substr(4);
          }
          if (recipe.portions.toUpperCase().startsWith('CA ')) {
            recipe.portions = recipe.portions.substr(3);
          }
          const parts = recipe.portions.split(' ')[0].split('-');
          if (parts.length === 2) {
            let tmp = ((parts[0] - 0) + (parts[1] - 0)) / 2;
            if (recipe.portions.split(' ').length > 1) {
              tmp += recipe.portions.substr(recipe.portions.indexOf(recipe.portions.split(' ')[1]) - 1);
            }
            recipe.portions = tmp;
          }
        }
        // created

        // description
        if (document.querySelector('.page-content .recipe-ingress')) {
          recipe.description = document.querySelector('.page-content .recipe-ingress').innerHTML.replace(/(\r\n|\n|\r|<[^>]*>)/gm, '').replace(/  +/g, ' ').trim();
        }

        // time
        if (document.querySelector('.page-content .recipe-description .fa-clock-o')) {
          const timeString = document.querySelector('.page-content .recipe-description .fa-clock-o').nextSibling.nodeValue.trim();
          if (timeString.indexOf('minut') > -1) {
            recipe.time = timeString.split(' ')[0] - 0;
          } else if (timeString.indexOf('timm') > -1) {
            recipe.time = (timeString.split(' ')[0] - 0) * 60;
          } else {
            return;
          }
          if (recipe.time < 25) {
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
          recipe.ingredients = ingredients;
        }

        if (!recipe.ingredients || recipe.ingredients.length === 0 || (recipe.time && recipe.time < 1)) {
          return;
        }

        // difficulty
        const instructionsList = document.querySelector('.page-content .recipe-content .steps').getElementsByTagName('li');
        const nrOfIngredients = recipe.ingredients.length;
        let instructionLength = 0;
        for (let i = 0; i < instructionsList.length; i++) {
          instructionLength += instructionsList[i].innerHTML.replace(/(\r\n|\n|\r|)/gm, '').trim().length;
        }
        instructionLength -= instructionsList.length * 10;

        let levelIndex = (nrOfIngredients * 8) + (instructionLength / 14);
        if (recipe.tags.hasOwnProperty('Enkelt') || recipe.tags.hasOwnProperty('Lättlagat')) {
          levelIndex -= 100;
        }
        if (recipe.tags.hasOwnProperty('Snabbt')) {
          levelIndex -= 20;
        }

        if (levelIndex < 100) {
          recipe.level = 1;
        } else if (levelIndex < 200) {
          recipe.level = 2;
        } else {
          recipe.level = 3;
        }
        return recipe;
      });
    } else {
      console.log(`error on:${source}`);
    }


    console.log(result);


    await page.screenshot({ path: `example${index}.png` });
  }
  await browser.close();
})();
