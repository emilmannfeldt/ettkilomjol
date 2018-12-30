/* eslint no-prototype-builtins: 0 */
import React, { Component } from 'react';
import './stats.css';
import { Doughnut, HorizontalBar } from 'react-chartjs-2';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import PropTypes from 'prop-types';

const colors = ['#ff6384', '#4bc0c0', '#ff9f40', '#36a2eb', '#ffcd56', '#9966ff', '#c9cbcf'];
const diets = ['Vegetarisk', 'GI', 'Vegan', 'Klimatsmart', 'LCHF', 'Raw food', '5:2'];
const allergies = ['Glutenfri', 'Äggfri', 'Mjölkproteinfri', 'Laktosfri', 'Sockerfri'];
const origins = ['Nordisk', 'Svensk', 'Asiatisk', 'Italiensk', 'Fransk', 'Tex Mex', 'Thailändsk', 'Indisk', 'Latinamerikansk', 'Mellanöstern', 'Amerikansk'];
const occasions = ['Middag', 'Lunch', 'Tillbehör', 'Förrätt', 'Efterrätt', 'Fest', 'Bröllop', 'Buffé', 'Frukost', 'Grill', 'Jul', 'Nyår', 'Midsommar', 'Brunch', 'Picknick', 'Matlåda', 'Barnkalas', 'Fredagsmys', 'Halloween'];
function getDefaultChartData() {
  const chart = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [],
      borderWidth: 1,
    }],
  };
  return chart;
}

class Stats extends Component {
  getFoodTotalScale(food, recipes) {
    const totalScales = {
      weight: {
        amount: 0,
        unit: '',
      },
      volume: {
        amount: 0,
        unit: '',
      },
      length: {
        amount: 0,
        unit: '',
      },
      pieces: 0,
    };
    let volumeHits = 0;
    let weightHits = 0;
    let lengthHits = 0;
    let pieceUnitsHits = 0;
    let ingredientHits = 0;
    for (let i = 0; i < recipes.length; i++) {
      const recipe = recipes[i];
      for (let j = 0; j < recipe.ingredients.length; j++) {
        const ingredient = recipe.ingredients[j];
        if (ingredient.name === food && (!ingredient.amount || !isNaN(ingredient.amount))) {
          ingredientHits += 1;
          if (ingredient.unit) {
            const unit = this.findUnit(ingredient);
            if (!unit) {
              pieceUnitsHits += 1;
              totalScales.pieces += +ingredient.amount || 1;
            } else if (unit.type === 'volume') {
              volumeHits += 1;
              totalScales.volume.amount += (+ingredient.amount || 1) * unit.ref;
            } else if (unit.type === 'weight') {
              weightHits += 1;
              totalScales.weight.amount += (+ingredient.amount || 1) * unit.ref;
            } else if (unit.type === 'length') {
              lengthHits += 1;
              totalScales.length.amount += (+ingredient.amount || 1) * unit.ref;
            } else {
              // console.log("ERROR" + unit.name);
            }
          } else {
            pieceUnitsHits += 1;
            totalScales.pieces += +ingredient.amount || 1;
          }
        }
      }
    }
    if (pieceUnitsHits < ingredientHits / 4) {
      // om pieces inte ska visas så överför vi ett estimat till de andra.
      totalScales.weight.amount += totalScales.pieces * 10; // en "st" =10g
      totalScales.volume.amount += totalScales.pieces * 15; // en "st" =msk
      totalScales.length.amount += totalScales.pieces * 10; // en "st" =cm
      totalScales.pieces = 0;
    } else {
      totalScales.pieces = totalScales.pieces.toFixed();
    }
    if (volumeHits < ingredientHits / 10) {
      totalScales.volume.amount = 0;
    } else {
      totalScales.volume = this.findCorrectUnit(totalScales.volume.amount, 'volume');
    }
    if (weightHits < ingredientHits / 10) {
      totalScales.weight.amount = 0;
    } else {
      totalScales.weight = this.findCorrectUnit(totalScales.weight.amount, 'weight');
    }
    if (lengthHits < ingredientHits / 10) {
      totalScales.length.amount = 0;
    } else {
      totalScales.length = this.findCorrectUnit(totalScales.length.amount, 'length');
    }

    return totalScales;
  }

  getRecipesPerSource() {
    const { recipes } = this.props;
    const chartData = {
      labels: [
        'Ica',
        'Tasteline',
        'Köket.se',
        'Mitt kök',
      ],
      datasets: [{
        data: [],
        backgroundColor: [
          '#ff6384',
          '#4bc0c0',
          '#ff9f40',
          '#36a2eb',
        ],
      }],
    };


    const {
      ica, tasteline, koket, mittkok,
    } = recipes.reduce((result_, recipe) => {
      const result = result_;
      if (recipe.source.includes('ica.se')) {
        result.ica += 1;
      } else if (recipe.source.includes('tasteline.com')) {
        result.tasteline += 1;
      } else if (recipe.source.includes('koket.se')) {
        result.koket += 1;
      } else if (recipe.source.includes('mittkok')) {
        result.mittkok += 1;
      }
      return result;
    }, {
      ica: 0, tasteline: 0, koket: 0, mittkok: 0,
    });

    chartData.datasets[0].data = [ica, tasteline, koket, mittkok];
    return chartData;
  }

  getRecipesPerTag() {
    const { tags } = this.props;
    const chartData = getDefaultChartData();

    for (let i = 0; i < tags.length; i++) {
      if (i === 7) {
        break;
      }
      const tag = tags[i];
      chartData.labels.push(tag.name);
      chartData.datasets[0].backgroundColor.push(colors[i]);
      chartData.datasets[0].data.push(tag.uses);
    }
    return chartData;
  }

  getRecipesPerLevel() {
    const { recipes } = this.props;
    const chartData = getDefaultChartData();
    const {
      easy, medium, hard,
    } = recipes.reduce((result_, recipe) => {
      const result = result_;
      if (recipe.level === 1) {
        result.easy += 1;
      } else if (recipe.level === 2) {
        result.medium += 1;
      } else if (recipe.level === 3) {
        result.hard += 1;
      }
      return result;
    }, {
      easy: 0, medium: 0, hard: 0,
    });

    chartData.labels.push('lätt');
    chartData.labels.push('medel');
    chartData.labels.push('svår');
    chartData.datasets[0].backgroundColor.push(colors[0]);
    chartData.datasets[0].backgroundColor.push(colors[1]);
    chartData.datasets[0].backgroundColor.push(colors[2]);
    chartData.datasets[0].data.push(easy);
    chartData.datasets[0].data.push(medium);
    chartData.datasets[0].data.push(hard);
    return chartData;
  }

  getRecipesPerDiet() {
    const { tags } = this.props;
    const chartData = getDefaultChartData();
    for (let i = 0; i < tags.length; i++) {
      if (chartData.datasets[0].data.length === 7) {
        break;
      }
      const tag = tags[i];
      if (diets.indexOf(tag.name) > -1) {
        chartData.datasets[0].data.push(tag.uses);
        chartData.labels.push(tag.name);
        chartData.datasets[0].backgroundColor.push(colors[chartData.datasets[0].data.length - 1]);
      }
    }
    return chartData;
  }

  getRecipesPerAllergy() {
    const { tags } = this.props;
    const chartData = getDefaultChartData();
    for (let i = 0; i < tags.length; i++) {
      if (chartData.datasets[0].data.length === 7) {
        break;
      }
      const tag = tags[i];
      if (allergies.indexOf(tag.name) > -1) {
        chartData.datasets[0].data.push(tag.uses);
        chartData.labels.push(tag.name);
        chartData.datasets[0].backgroundColor.push(colors[chartData.datasets[0].data.length - 1]);
      }
    }
    return chartData;
  }

  getRecipesPerOccasion() {
    const { tags } = this.props;
    const chartData = getDefaultChartData();
    for (let i = 0; i < tags.length; i++) {
      if (chartData.datasets[0].data.length === 7) {
        break;
      }
      const tag = tags[i];
      if (occasions.indexOf(tag.name) > -1) {
        chartData.datasets[0].data.push(tag.uses);
        chartData.labels.push(tag.name);
        chartData.datasets[0].backgroundColor.push(colors[chartData.datasets[0].data.length - 1]);
      }
    }
    return chartData;
  }

  getRecipesPerOrigin() {
    const { tags } = this.props;
    const chartData = getDefaultChartData();
    for (let i = 0; i < tags.length; i++) {
      if (chartData.datasets[0].data.length === 7) {
        break;
      }
      const tag = tags[i];
      if (origins.indexOf(tag.name) > -1) {
        chartData.datasets[0].data.push(tag.uses);
        chartData.labels.push(tag.name);
        chartData.datasets[0].backgroundColor.push(colors[chartData.datasets[0].data.length - 1]);
      }
    }
    return chartData;
  }

  getRecipesPerFood() {
    const { foods } = this.props;

    const chartData = getDefaultChartData();
    chartData.datasets[0].label = 'Antal recept per ingrediens';
    chartData.datasets[0].backgroundColor.push(colors[1]);
    for (let i = 0; i < foods.length; i++) {
      if (chartData.datasets[0].data.length === 100) {
        break;
      }
      const food = foods[i];
      chartData.datasets[0].data.push(food.uses);
      chartData.labels.push(food.name);
    }

    return chartData;
  }


  getRecipesPerFoodOptions() {
    const that = this;
    const options = {
      maintainAspectRatio: false,
      responsiveAnimationDuration: 1000,
      animation: {
        easing: 'easeOutBack',
      },
      tooltips: {
        callbacks: {
          beforeFooter(tooltipItem, data) {
            const foodName = tooltipItem[0].yLabel;
            const totalScales = that.getFoodTotalScale(foodName, that.props.recipes);
            let footer = '';
            if (totalScales.pieces > 0) {
              footer += ` ${totalScales.pieces} st`;
            }
            if (totalScales.volume.amount > 0) {
              footer += ` ${totalScales.volume.amount} ${totalScales.volume.unit}`;
            }
            if (totalScales.weight.amount > 0) {
              footer += ` ${totalScales.weight.amount} ${totalScales.weight.unit}`;
            }
            if (totalScales.length.amount > 0) {
              footer += ` ${totalScales.length.amount} ${totalScales.length.unit}`;
            }
            return footer.trim();
          },
          label(tooltipItem, data) {
            let label = 'Hittas i ';
            label += tooltipItem.xLabel;
            label += ' recept (';
            label += ((tooltipItem.xLabel / that.props.recipes.length) * 100).toFixed(2);
            label += '%)';
            return label;
          },
        },

      },
    };
    return options;
  }

  getRecipesPerVisits() {
    const { recipes } = this.props;

    const chartData = getDefaultChartData();
    chartData.datasets[0].label = 'Antal besök';
    chartData.datasets[0].backgroundColor.push(colors[1]);

    const topRecipes = recipes.sort((a, b) => a.visits - b.visits);
    topRecipes.length = 10;

    for (let i = 0; i < topRecipes.length; i++) {
      const recipe = topRecipes[i];
      chartData.datasets[0].data.push(recipe.visits);
      chartData.labels.push(recipe.title);
    }
    return chartData;
  }

  findCorrectUnit(ref, unitType) {
    const { units } = this.props;
    let newUnit;
    for (const unit in units[unitType]) {
      if (units[unitType].hasOwnProperty(unit)) {
        const curUnit = units[unitType][unit];
        if ((ref / curUnit.ref < curUnit.max) && (!newUnit || curUnit.ref < newUnit.ref)) {
          newUnit = curUnit;
        }
      }
    }
    return {
      amount: Math.round((ref / newUnit.ref)).toFixed(),
      unit: newUnit.name,
    };
  }

  findUnit(ingredient) {
    const { units } = this.props;
    for (const type in units) {
      if (units.hasOwnProperty(type)) {
        for (const unit in units[type]) {
          if (units[type].hasOwnProperty(unit)) {
            const curUnit = units[type][unit];
            if (curUnit.name === ingredient.unit || curUnit.fullName === ingredient.unit) {
              return curUnit;
            }
          }
        }
      }
    }
    return null;
  }

  render() {
    const {
      users, recipes, foods, tags,
    } = this.props;
    let visits = 0;
    let favs = 0;
    for (let i = 0; i < recipes.length; i++) {
      visits += (recipes[i].visits || 0);
    }
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      if (user.fav) {
        favs += (Object.keys(user.fav).length || 0);
      }
    }

    const defaultDoughnutOptions = {
      maintainAspectRatio: false,
      responsiveAnimationDuration: 1000,
      animation: {
        easing: 'easeOutBack',
      },
      legend: {
        position: 'top',
      },
    };

    return (
      <div className="container chart-container">
        <List>
          <ListItem className="stat-listitem">
            <ListItemText primary="Recept" secondary={recipes.length} />
          </ListItem>
          <ListItem className="stat-listitem">
            <ListItemText primary="Sökbara ingredienser" secondary={foods.length} />
          </ListItem>
          <ListItem className="stat-listitem">
            <ListItemText primary="Sökbara preferenser" secondary={tags.length} />
          </ListItem>
          <ListItem className="stat-listitem">
            <ListItemText primary="Aktiva användare" secondary={users.length} />
          </ListItem>
          <ListItem className="stat-listitem">
            <ListItemText primary="Favoritiserade recept" secondary={favs} />
          </ListItem>
          <ListItem className="stat-listitem">
            <ListItemText primary="Antal besök" secondary={visits} />
          </ListItem>
        </List>
        <div className="chart">
          <div className="chart-title">Mest använda källor</div>
          <Doughnut
            data={this.getRecipesPerSource()}
            width={50}
            height={100}
            options={defaultDoughnutOptions}
          />
        </div>
        <div className="chart">
          <div className="chart-title">Tillfällen</div>
          <Doughnut
            data={this.getRecipesPerOccasion()}
            width={50}
            height={100}
            options={defaultDoughnutOptions}
          />
        </div>
        <div className="chart">
          <div className="chart-title">Dieter</div>
          <Doughnut
            data={this.getRecipesPerDiet()}
            width={100}
            height={100}
            options={defaultDoughnutOptions}
          />
        </div>
        <div className="chart">
          <div className="chart-title">Allergier</div>
          <Doughnut
            data={this.getRecipesPerAllergy()}
            width={100}
            height={100}
            options={defaultDoughnutOptions}
          />
        </div>
        <div className="chart">
          <div className="chart-title">Ursprung</div>
          <Doughnut
            data={this.getRecipesPerOrigin()}
            width={100}
            height={100}
            options={defaultDoughnutOptions}
          />
        </div>
        <div className="chart">
          <div className="chart-title">Svårgihetsgrad</div>
          <Doughnut
            data={this.getRecipesPerLevel()}
            width={100}
            height={100}
            options={defaultDoughnutOptions}
          />
        </div>
        <div className="chart">
          <div className="chart-title">Mest använda ingredienser</div>
          <HorizontalBar
            data={this.getRecipesPerFood()}
            width={100}
            height={1250}
            options={this.getRecipesPerFoodOptions()}
          />
        </div>
      </div>
    );
  }
}
Stats.propTypes = {
  recipes: PropTypes.array.isRequired,
  units: PropTypes.any.isRequired,
  foods: PropTypes.array.isRequired,
  tags: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
};
export default Stats;
