exports.sortOnBetyg = function sortOnBetyg(a, b) {
  if (a.rating === b.rating) {
    return b.votes - a.votes;
  }
  return b.rating - a.rating;
};

exports.sortOnPopularitet = function sortOnPopularitet(a, b) {
  if (!a.visits && !b.visits) {
    sortOnVotes(a, b);
  }
  if (!a.visits) {
    return 1;
  }
  if (!b.visits) {
    return -1;
  }
  if (a.visits === b.visits) {
    sortOnVotes(a, b);
  }
  return b.visits - a.visits;
};
function sortOnVotes(a, b) {
  if (b.votes === a.votes) {
    return b.rating - a.rating;
  }
  return b.votes - a.votes;
}

exports.sortOnTid = function sortOnTid(a, b) {
  if (!b.time && !a.time) {
    return 0;
  }
  if (!b.time) {
    return -1;
  }
  if (!a.time) {
    return 1;
  }
  if (a.time === b.time) {
    return a.level - b.level;
  }
  return a.time - b.time;
};
exports.sortOnAntalIngredienserAsc = function sortOnAntalIngredienserAsc(a, b) {
  if (a.ingredients.length === b.ingredients.length) {
    return this.sortOnBetyg(a, b);
  }
  return a.ingredients.length - b.ingredients.length;
};
exports.sortOnRelevans = function sortOnRelevans(a, b, filterTags, filterIngredients) {
  // const tagsHitsA = filterTags.filter(t => a.tags[t]).length;
  // const tagsHitsB = filterTags.filter(t => b.tags[t]).length;
  const { tagsHitsA, tagsHitsB } = filterTags.reduce((result, tag) => {
    const res = result;
    if (a.tags[tag]) {
      res.tagsHitsA += 1;
    }
    if (b.tags[tag]) {
      res.tagsHitsB += 1;
    }
    return res;
  },
  { tagsHitsA: 0, tagsHitsB: 0 });

  if (filterIngredients.length === 0) {
    return tagsHitsB - tagsHitsA;
  }

  const ingredientHitsA = a.ingredients.filter(i => filterIngredients.includes(i.name)).length;
  const ingredientHitsB = b.ingredients.filter(i => filterIngredients.includes(i.name)).length;

  const aIngredients = a.ingredients.length;
  const bIngredients = b.ingredients.length;
  const hitsA = ingredientHitsA + (tagsHitsA * 0.6);
  const hitsB = ingredientHitsB + (tagsHitsB * 0.6);
  // om båda är full match: Välj den som har flest antal ingredienser
  if (hitsA === hitsB) {
    return aIngredients - bIngredients;
  }
  return hitsB - hitsA;
};
exports.runFilter = function runFilter(recipe, filter) {
  let tagHits = 0;
  let ingredientHits = 0;
  if (filter.tags.length > 0 && recipe.tags) {
    tagHits = filter.tags.filter(x => recipe.tags[x]).length;
    if (tagHits < (filter.tagsIsMandatory ? filter.tags.length : 1)) {
      return false;
    }
  }
  if (filter.ingredients.length > 0) {
    ingredientHits = recipe.ingredients.filter(i => filter.ingredients.includes(i.name)).length;
    if (ingredientHits === 0) {
      return false;
    }
  }
  if (ingredientHits === 0) {
    return simpleFilter(filter.tags.length, recipe.tags ? Object.keys(recipe.tags).length : 0, tagHits);
  }
  if (tagHits === 0) {
    return simpleFilter(filter.ingredients.length, recipe.ingredients.length, ingredientHits);
  }
  return simpleFilter(filter.ingredients.length + filter.tags.length, recipe.ingredients.length + Object.keys(recipe.tags).length, ingredientHits + tagHits);
};
exports.filterIsEmpty = function filterIsEmpty(filter) {
  return !(filter.ingredients.length > 0 || filter.tags.length > 0);
};

function simpleFilter(filterLength, recipeLength, hits) {
  let keeper = false;
  if (filterLength > 10) {
    keeper = hits / filterLength > 0.24;
  } else if (filterLength > 6) {
    keeper = hits / filterLength > 0.3;
  } else if (filterLength > 3) {
    keeper = hits / filterLength > 0.38;
  } else {
    keeper = hits > 0;
  }
  if (!keeper) {
    if (recipeLength > 20) {
      keeper = hits / recipeLength > 0.8;
    } else if (recipeLength > 10) {
      keeper = hits / recipeLength > 0.7;
    } else {
      keeper = hits / recipeLength > 0.6;
    }
  }
  return keeper;
}
