function convertIngredientPortions(ingredients, newMultiplier, prevMultiplier, units) {
  return ingredients.map((ingredient) => {
    const result = ingredient;
    if (result.amount) {
      result.amount = Utils.closestDecimals(result.amount * (newMultiplier / prevMultiplier));
      if (result.unit) {
        return Utils.correctIngredientUnit(result, units);
      }
    }
    return result;
  });
}
