const monthNames = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun',
  'jul', 'aug', 'sep', 'oky', 'nov', 'dec'];
module.exports = {
  filterIsEmpty(filter) {
    return filter.ingredients.length > 0 || filter.tags.length > 0;
  },
  convertIngredientPortions(ingredients, newMultiplier, prevMultiplier, units) {
    return ingredients.map((ingredient) => {
      const result = ingredient;
      if (result.amount) {
        result.amount = closestDecimals(result.amount * (newMultiplier / prevMultiplier));
        if (result.unit) {
          return checkUnit(result, units);
        }
      }
      return result;
    });
  },
  encodeSource(source) {
    let tmp = '';
    if (source.indexOf('ica.se') > -1) {
      tmp = source.substr(source.indexOf('ica.se'));
    } else if (source.indexOf('tasteline.com') > -1) {
      tmp = source.substr(source.indexOf('tasteline.com'));
    } else if (source.indexOf('koket.se') > -1) {
      tmp = source.substr(source.indexOf('koket.se'));
    } else if (source.indexOf('mittkok.expressen.se') > -1) {
      tmp = source.substr(source.indexOf('mittkok.expressen.se'));
    } else {
      console.error(`ingen matchning på source:${source}`);
    }
    return tmp.replace(/\./g, ',').replace(/\//g, '+');
  },
  decodeSource(source) {
    const tmp = source.replace(/,/g, '.').replace(/\+/g, '/');
    return tmp;
  },
  millisecToDateString(ms) {
    const date = new Date(ms);
    const dd = date.getDate();
    const mm = date.getMonth();
    const yyyy = date.getFullYear();
    const dateString = `${dd} ${monthNames[mm]} ${yyyy}`;
    return dateString;
  },
  getDayAndMonthString(date) {
    const dd = date.getDate();
    const mm = date.getMonth();
    const dateString = `${dd} ${monthNames[mm]}`;
    return dateString;
  },
  hideSpinner() {
    document.querySelector('.spinner').style.display = 'none';
  },
  showSpinner() {
    document.querySelector('.spinner').style.display = 'block';
  },
  mergeIngredients(ingredientA, ingredientB, units) {
    if (isIngredientsOnlyNames(ingredientA, ingredientB)) {
      return ingredientB;
    }
    if (isIngredientsSameUnit(ingredientA, ingredientB)) {
      const amount1 = ingredientB.amount ? +ingredientB.amount : 1;
      const amount2 = ingredientA.amount ? +ingredientA.amount : 1;
      ingredientB.amount = amount1 + amount2;
      return checkUnit(ingredientB, units);
    }
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
    return checkUnit(ingredientResult, units);
  },
  ingredientsCanMerge(ingredientA, ingredientB, units) {
    if (ingredientA.name !== ingredientB.name) {
      return false;
    }
    if (isIngredientsOnlyNames(ingredientA, ingredientB)) {
      return true;
    }
    if (isIngredientsSameUnit(ingredientA, ingredientB)) {
      return true;
    }
    return isSameUnitScale(ingredientA.unit, ingredientB.unit, units);
  },
  closestDecimals,
  checkUnit,

};
function isSameUnitScale(unitA, unitB, units) {
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
  if (foundUnitA.type === foundUnitB.type) {
    return true;
  }
  return false;
}
function isIngredientsSameUnit(ingredientA, ingredientB) {
  return ingredientA.unit === ingredientB.unit || (!ingredientA.unit && !ingredientB.unit && ingredientB.amount && ingredientA.amount);
}
function isIngredientsOnlyNames(ingredientA, ingredientB) {
  return !ingredientA.unit && !ingredientB.unit && !ingredientB.amount && !ingredientA.amount;
}
function checkUnit(ingredient, units) {
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
    ingredient = findHigherUnit(ingredient, foundUnit, units);
  } else if (ingredient.amount <= foundUnit.min) {
    ingredient = findLowerUnit(ingredient, foundUnit, units);
  }
  ingredient.amount = closestDecimals(+ingredient.amount);
  return ingredient;
}
function findLowerUnit(ingredient, selectedUnit, units) {
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


function findHigherUnit(ingredient, selectedUnit, units) {
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
  // var diff = Math.abs(decimal - curr);
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] >= decimal) {
      curr = arr[i];
      break;
    }
    if (i === arr.length - 1) {
      curr = 1;
    }
  }
  return num - decimal + curr;
}
