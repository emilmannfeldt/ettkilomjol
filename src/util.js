const monthNames = ["jan", "feb", "mar", "apr", "maj", "jun",
    "jul", "aug", "sep", "oky", "nov", "dec"];
module.exports = {
    encodeSource(source) {
        let tmp = "";
        if (source.indexOf("ica.se") > -1) {
            tmp = source.substr(source.indexOf("ica.se"));

        } else if (source.indexOf("tasteline.com") > -1) {
            tmp = source.substr(source.indexOf("tasteline.com"));

        } else if (source.indexOf("koket.se") > -1) {
            tmp = source.substr(source.indexOf("koket.se"));

        } else if (source.indexOf("mittkok.expressen.se") > -1) {
            tmp = source.substr(source.indexOf("mittkok.expressen.se"));

        } else {
            console.error("ingen matchning på source:" + source);
        }
        return tmp.replace(/\./g, ",").replace(/\//g, "+");
    },
    decodeSource(source) {
        let tmp = source.replace(/,/g, '.').replace(/\+/g, '/');
        return tmp;

    },
    millisecToDateString(ms) {
        let date = new Date(ms);
        let dd = date.getDate();
        let mm = date.getMonth();
        let yyyy = date.getFullYear();
        let dateString = dd + " " + monthNames[mm] + " " + yyyy;
        return dateString;
    },
    getDayAndMonthString(date) {
        let dd = date.getDate();
        let mm = date.getMonth();
        let dateString = dd + " " + monthNames[mm];
        return dateString;
    },
    hideSpinner() {
        document.querySelector(".spinner").style.display = 'none';
    },
    showSpinner() {
        document.querySelector(".spinner").style.display = 'block';
    },
    mergeIngredients(ingredientA, ingredientB, units) {
        if(isIngredientsOnlyNames(ingredientA, ingredientB)){
            return ingredientB;
        }
        if(isIngredientsSameUnit(ingredientA, ingredientB)){
            let amount1 = ingredientB.amount ? +ingredientB.amount : 1;
            let amount2 = ingredientA.amount ? +ingredientA.amount : 1;
            ingredientB.amount = amount1 + amount2;
            return checkUnit(ingredientB, units);
        }
        let ingredientResult = {};
        ingredientResult.name = ingredientA.name;
        let foundUnitA;
        let foundUnitB;
        for (let type in units) {
            if (units.hasOwnProperty(type)) {
                for (let unit in units[type]) {
                    if (units[type].hasOwnProperty(unit)) {
                        let curUnit = units[type][unit];
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
            let refDiff = foundUnitA.ref / foundUnitB.ref;
            ingredientA.amount = ingredientA.amount * refDiff;
            ingredientA.unit = ingredientB.unit;
        } else {
            let refDiff = foundUnitB.ref / foundUnitA.ref;
            ingredientB.amount = ingredientB.amount * refDiff;
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
    correctIngredientUnit: checkUnit,
    closestDecimals: closestDecimals,

}
function isSameUnitScale(unitA, unitB, units) {
    let foundUnitA;
    let foundUnitB;
    for (let type in units) {
        if (units.hasOwnProperty(type)) {
            for (let unit in units[type]) {
                if (units[type].hasOwnProperty(unit)) {
                    let curUnit = units[type][unit];
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
    for (let type in units) {
        if (units.hasOwnProperty(type)) {
            for (let unit in units[type]) {
                if (units[type].hasOwnProperty(unit)) {
                    let curUnit = units[type][unit];
                    if (curUnit.name === ingredient.unit) {
                        foundUnit = curUnit;
                    }
                }
            }
        }
    }
    if (ingredient.amount >= foundUnit.max) {
        ingredient = findHigherUnit(ingredient, foundUnit, units);
    }
    else if (ingredient.amount <= foundUnit.min) {
        ingredient = findLowerUnit(ingredient, foundUnit, units);
    }
    ingredient.amount = closestDecimals(+ingredient.amount);
    return ingredient;
}
function findLowerUnit(ingredient, selectedUnit, units) {
    let selectedRef = ingredient.amount * selectedUnit.ref;
    let finalIngredient = ingredient;
    let newUnit;

    for (let unit in units[selectedUnit.type]) {
        if (units[selectedUnit.type].hasOwnProperty(unit)) {
            let curUnit = units[selectedUnit.type][unit];
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
    let selectedRef = ingredient.amount * selectedUnit.ref;
    let finalIngredient = ingredient;
    let newUnit;

    for (let unit in units[selectedUnit.type]) {
        if (units[selectedUnit.type].hasOwnProperty(unit)) {
            let curUnit = units[selectedUnit.type][unit];
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
    let arr = [0, 0.1, 0.2, 0.25, 0.33, 0.4, 0.5, 0.6, 0.66, 0.75, 0.8, 0.9];
    num = num.toFixed(3);
    let decimal = num - (Math.floor(num));
    var curr = arr[0];
    //var diff = Math.abs(decimal - curr);
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