import React, { Component } from 'react';
import './stats.css';
import { Doughnut, Bar, HorizontalBar } from 'react-chartjs-2';


class Stats extends Component {
    constructor(props) {
        super(props);
        //varför finns inte laktosfri?
        this.state = {
            colors: ['#ff6384', '#4bc0c0', '#ff9f40', '#36a2eb', '#ffcd56', '#9966ff', '#c9cbcf'],
            diets: ['Vegetarisk', 'GI', 'Vegan', 'Klimatsmart', 'LCHF', 'Raw food', '5:2'],
            allergies: ['Glutenfri', 'Äggfri', 'Mjölkproteinfri', 'Laktosfri', 'Sockerfri'],
            origins: ['Nordisk', 'Svensk', 'Asiatisk', 'Italiensk', 'Fransk', 'Tex Mex', 'Thailändsk', 'Indisk', 'Latinamerikansk', 'Mellanöstern', 'Amerikansk'],
            occasions: ['Middag', 'Lunch', 'Tillbehör', 'Förrätt', 'Efterrätt', 'Fest', 'Bröllop', 'Buffé', 'Frukost', 'Grill', 'Jul', 'Nyår', 'Midsommar', 'Brunch', 'Picknick', 'Matlåda', 'Barnkalas', 'Fredagsmys', 'Halloween'],
            foodExcludes: ['']
        };

    }

    getFoodTotalScale(food, recipes) {
        let totalScales = {
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
            let recipe = recipes[i];
            for (let j = 0; j < recipe.ingredients.length; j++) {
                let ingredient = recipe.ingredients[j];
                if (ingredient.name === food && (!ingredient.amount || !isNaN(ingredient.amount))) {
                    ingredientHits++;
                    if (ingredient.unit) {
                        let unit = this.findUnit(ingredient);
                        //problemet ör när det finns en unit tsk och ingen amount. felaktigt ingrediens men men
                        if (!unit) {
                            pieceUnitsHits++;
                            totalScales.pieces += +ingredient.amount || 1;
                        } else if (unit.type === 'volume') {
                            volumeHits++;
                            //volume hits låter rimligt men 10dl är för lite. 
                            totalScales.volume.amount += (+ingredient.amount || 1) * unit.ref;
                        } else if (unit.type === 'weight') {
                            weightHits++;
                            totalScales.weight.amount += (+ingredient.amount || 1) * unit.ref;
                        } else if (unit.type === 'length') {
                            lengthHits++;
                            totalScales.length.amount += (+ingredient.amount || 1) * unit.ref;
                        } else {
                            console.log("ERROR" + unit.name);
                        }
                    } else {
                        pieceUnitsHits++;
                        totalScales.pieces += +ingredient.amount || 1;
                    }

                }
            }
        }
        if (pieceUnitsHits < ingredientHits / 4) {
            //om pieces inte ska visas så överför vi ett estimat till de andra. 
            totalScales.weight.amount += totalScales.pieces * 10; //en "st" =10g
            totalScales.volume.amount += totalScales.pieces * 15; //en "st" =msk
            totalScales.length.amount += totalScales.pieces * 10; //en "st" =cm
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
        //hitta rätt unit
    }
    findCorrectUnit(ref, unitType) {
        let newUnit;
        let units = this.props.units;
        for (let unit in units[unitType]) {
            if (units[unitType].hasOwnProperty(unit)) {
                let curUnit = units[unitType][unit];
                if ((ref / curUnit.ref < curUnit.max) && (!newUnit || curUnit.ref < newUnit.ref)) {
                    newUnit = curUnit;
                }
            }
        }
        return {
            amount: Math.round((ref / newUnit.ref)).toFixed(),
            unit: newUnit.name
        };
    }

    findUnit(ingredient) {
        let units = this.props.units;
        for (let type in units) {
            if (units.hasOwnProperty(type)) {
                for (let unit in units[type]) {
                    if (units[type].hasOwnProperty(unit)) {
                        let curUnit = units[type][unit];
                        if (curUnit.name === ingredient.unit || curUnit.fullName === ingredient.unit) {
                            return curUnit;
                        }
                    }
                }
            }
        }

    }

    getDefaultChartData() {
        let chart = {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [],
                borderWidth: 1,
            }]
        };
        return chart;
    }

    getRecipesPerSource() {
        let chartData = {
            labels: [
                'Ica',
                'Tasteline',
                'Köket.se',
                'Mitt kök'
            ],
            datasets: [{
                data: [],
                backgroundColor: [
                    '#ff6384',
                    '#4bc0c0',
                    '#ff9f40',
                    '#36a2eb'
                ]
            }]
        };
        let ica = 0;
        let tasteline = 0;
        let koket = 0;
        let mittkok = 0;
        console.log("LÄNGD" + this.props.recipes.length);
        console.log(this.props.tags)
        for (let i = 0; i < this.props.recipes.length; i++) {
            let recipe = this.props.recipes[i];
            if (recipe.source.indexOf("ica.se") > -1) {
                ica++;
            } else if (recipe.source.indexOf("tasteline.com") > -1) {
                tasteline++;
            } else if (recipe.source.indexOf("koket.se") > -1) {
                koket++;
            } else if (recipe.source.indexOf("mittkok") > -1) {
                mittkok++;
            } else {
                console.log("ERROR" + recipe.source)
            }
        }
        chartData.datasets[0].data = [ica, tasteline, koket, mittkok];
        return chartData;
    }

    getRecipesPerTag() {
        let chartData = this.getDefaultChartData();
        console.log(this.props.tags);
        for (let i = 0; i < this.props.tags.length; i++) {
            if (i === 7) {
                break;
            }
            let tag = this.props.tags[i];
            chartData.labels.push(tag.name);
            chartData.datasets[0].backgroundColor.push(this.state.colors[i]);
            chartData.datasets[0].data.push(tag.uses);

        }
        return chartData;
    }

    getRecipesPerLevel() {
        let chartData = this.getDefaultChartData();
        let easy = 0;
        let medium = 0;
        let hard = 0;
        for (let i = 0; i < this.props.recipes.length; i++) {
            let recipe = this.props.recipes[i];
            switch (recipe.level) {
                case 1:
                    easy++;
                    break;
                case 2:
                    medium++;
                    break;
                case 3:
                    hard++;
                    break;
                case undefined:
                    break;
                default:
                    break;
            }
        }
        chartData.labels.push("lätt");
        chartData.labels.push("medel");
        chartData.labels.push("svår");
        chartData.datasets[0].backgroundColor.push(this.state.colors[0]);
        chartData.datasets[0].backgroundColor.push(this.state.colors[1]);
        chartData.datasets[0].backgroundColor.push(this.state.colors[2]);
        chartData.datasets[0].data.push(easy);
        chartData.datasets[0].data.push(medium);
        chartData.datasets[0].data.push(hard);
        return chartData;
    }

    getRecipesPerDiet() {
        let chartData = this.getDefaultChartData();
        for (let i = 0; i < this.props.tags.length; i++) {
            if (chartData.datasets[0].data.length === 7) {
                break;
            }
            let tag = this.props.tags[i];
            if (this.state.diets.indexOf(tag.name) > -1) {
                chartData.datasets[0].data.push(tag.uses);
                chartData.labels.push(tag.name);
                chartData.datasets[0].backgroundColor.push(this.state.colors[chartData.datasets[0].data.length - 1]);
            }
        }
        return chartData;
    }
    getRecipesPerAllergy() {
        let chartData = this.getDefaultChartData();
        for (let i = 0; i < this.props.tags.length; i++) {
            if (chartData.datasets[0].data.length === 7) {
                break;
            }
            let tag = this.props.tags[i];
            if (this.state.allergies.indexOf(tag.name) > -1) {
                chartData.datasets[0].data.push(tag.uses);
                chartData.labels.push(tag.name);
                chartData.datasets[0].backgroundColor.push(this.state.colors[chartData.datasets[0].data.length - 1]);
            }
        }
        return chartData;
    }
    getRecipesPerOccasion() {
        let chartData = this.getDefaultChartData();
        for (let i = 0; i < this.props.tags.length; i++) {
            if (chartData.datasets[0].data.length === 7) {
                break;
            }
            let tag = this.props.tags[i];
            if (this.state.occasions.indexOf(tag.name) > -1) {
                chartData.datasets[0].data.push(tag.uses);
                chartData.labels.push(tag.name);
                chartData.datasets[0].backgroundColor.push(this.state.colors[chartData.datasets[0].data.length - 1]);
            }
        }
        return chartData;
    }
    getRecipesPerOrigin() {
        let chartData = this.getDefaultChartData();
        for (let i = 0; i < this.props.tags.length; i++) {
            if (chartData.datasets[0].data.length === 7) {
                break;
            }
            let tag = this.props.tags[i];
            if (this.state.origins.indexOf(tag.name) > -1) {
                chartData.datasets[0].data.push(tag.uses);
                chartData.labels.push(tag.name);
                chartData.datasets[0].backgroundColor.push(this.state.colors[chartData.datasets[0].data.length - 1]);
            }
        }
        return chartData;
    }

    getRecipesPerFood() {
        let chartData = this.getDefaultChartData();
        chartData.datasets[0].label = "Antal recept per ingrediens";
        chartData.datasets[0].backgroundColor.push(this.state.colors[1]);
        for (let i = 0; i < this.props.foods.length; i++) {
            if (chartData.datasets[0].data.length === 100) {
                break;
            }
            let food = this.props.foods[i];
            chartData.datasets[0].data.push(food.uses);
            chartData.labels.push(food.name);

        }

        return chartData;
    }
    getRecipesPerFoodOptions() {
        let that = this;
        let options = {
            maintainAspectRatio: false,
            responsiveAnimationDuration: 1000,
            animation: {
                easing: 'easeOutBack',
            },
            tooltips: {
                callbacks: {
                    beforeFooter: function (tooltipItem, data) {
                        let foodName = tooltipItem[0].yLabel;
                        let totalScales = that.getFoodTotalScale(foodName, that.props.recipes);
                        let footer = "";
                        if (totalScales.pieces > 0) {
                            footer += " " + totalScales.pieces + " st";
                        }
                        if (totalScales.volume.amount > 0) {
                            footer += " " + totalScales.volume.amount + " " + totalScales.volume.unit;
                        }
                        if (totalScales.weight.amount > 0) {
                            footer += " " + totalScales.weight.amount + " " + totalScales.weight.unit;
                        }
                        if (totalScales.length.amount > 0) {
                            footer += " " + totalScales.length.amount + " " + totalScales.length.unit;
                        }
                        return footer.trim();
                    },
                    afterFooter: function (tooltipItem, data) {
                        var dataset = data['datasets'][0];
                        var percent = 10;
                        return '';
                    },
                    label: function (tooltipItem, data) {
                        var label = 'Hittas i ';
                        label += tooltipItem.xLabel;
                        label += ' recept (';
                        label += ((tooltipItem.xLabel / that.props.recipes.length) * 100).toFixed(2);
                        label += '%)';
                        return label;
                    }
                },

            }
        }
        return options;
    }

    getRecipesPerVisits() {
        let chartData = this.getDefaultChartData();
        chartData.datasets[0].label = "Antal besök";
        chartData.datasets[0].backgroundColor.push(this.state.colors[1]);
        let topRecipes = [];
        let topVisits = [];
        for (let i = 0; i < this.props.recipes.length; i++) {
            let recipe = this.props.recipes[i];
            if (!recipe.visits) {
                continue;
            }
            if (topVisits.length <= 10) {
                topRecipes.push(recipe);
                topVisits.push(recipe.visits);
                continue;
            }
            for (let j = 0; j < topVisits.length; j++) {
                if (recipe.visits > topVisits[j]) {
                    topRecipes[j] = recipe;
                    topVisits[j] = recipe.visits;
                    break;
                }
            }
        }
        for (let i = 0; i < topRecipes.length; i++) {
            let recipe = topRecipes[i];
            chartData.datasets[0].data.push(recipe.visits);
            chartData.labels.push(recipe.title);
        }
        return chartData;
    }




    render() {
        console.log("RENDERING" + this.props.recipes.length)


        const defaultOptions = {
            maintainAspectRatio: false,
            responsiveAnimationDuration: 1000,
            animation: {
                easing: 'easeOutBack',
            },
        }
        return (
            <div>
                <div>
                    <h2>Mest använda källor</h2>
                    <Doughnut data={this.getRecipesPerSource()} width={100}
                        height={50}
                        options={defaultOptions} />
                </div>
                <div>
                    <h2>Tillfälle</h2>
                    <Doughnut data={this.getRecipesPerOccasion()} width={100}
                        height={50}
                        options={defaultOptions} />
                </div>
                <div>
                    <h2>Diet</h2>
                    <Doughnut data={this.getRecipesPerDiet()} width={100}
                        height={50}
                        options={defaultOptions} />
                </div>
                <div>
                    <h2>Allergier</h2>
                    <Doughnut data={this.getRecipesPerAllergy()} width={100}
                        height={50}
                        options={defaultOptions} />
                </div>
                <div>
                    <h2>Ursprung</h2>
                    <Doughnut data={this.getRecipesPerOrigin()} width={100}
                        height={50}
                        options={defaultOptions} />
                </div>
                <div>
                    <h2>Svårighetsgrad</h2>
                    <Doughnut data={this.getRecipesPerLevel()} width={100}
                        height={50}
                        options={defaultOptions} />
                </div>
                <div>
                    <h2>Ingredienser</h2>
                    <HorizontalBar data={this.getRecipesPerFood()} width={100}
                        height={1250}
                        options={this.getRecipesPerFoodOptions()} />
                </div>
                <div>
                    <h2>Populäraste recepten</h2>
                    <HorizontalBar data={this.getRecipesPerVisits()} width={100}
                        height={125}
                        options={defaultOptions} />
                </div>
            </div>
        );
    }
}
export default Stats;