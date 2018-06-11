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
            foodExcludes: [''],
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
            pieces: 0,
            forp: 0,
        };
        let volumeHits = 0;
        let weightHits = 0;
        let otherUnitHits = 0;
        let noUnitsHits = 0;
        let ingredientHits = 0;
        for (let i = 0; i < recipes.length; i++) {
            let recipe = recipes[i];
            for (let j = 0; j < recipe.ingredients.length; j++) {
                let ingredient = recipe.ingredients[j];
                if (ingredient.name === food && !isNaN(ingredient.amount)) {
                    ingredientHits++;
                    if (ingredient.unit) {
                        let unit = this.findUnit(ingredient);
                        if (!unit) {
                            otherUnitHits++;
                            totalScales.forp += +ingredient.amount || 1;
                        } else if (unit.type === 'volume') {
                            volumeHits++;
                            totalScales.volume.amount += +ingredient.amount * unit.ref;
                        } else if (unit.type === 'weight') {
                            weightHits++;
                            totalScales.weight.amount += +ingredient.amount * unit.ref;
                        } else {
                            console.log("ERROR" + unit);
                        }
                    } else {
                        noUnitsHits++;
                        totalScales.pieces += +ingredient.amount || 1;
                    }

                }
            }
        }
        if (volumeHits < ingredientHits / 4) {
            totalScales.volume.amount = 0;
        } else {
            totalScales.volume = this.findCorrectUnit(totalScales.volume.amount, 'volume');
        }
        if (weightHits < ingredientHits / 4) {
            totalScales.weight.amount = 0;
        } else {
            totalScales.weight = this.findCorrectUnit(totalScales.weight.amount, 'weight');
        }
        if (noUnitsHits < ingredientHits / 4) {
            totalScales.pieces = 0;
        } else {
            totalScales.pieces = totalScales.pieces.toFixed();
        }
        if (otherUnitHits < ingredientHits / 2) {
            //kolla över hanteringen av förp/st ska se bra ut och stämma
            //kolla på ägg och vitlöksklytor
            totalScales.forp = 0;
        } else {
            totalScales.forp = totalScales.forp.toFixed();
        }
        return totalScales;
        //hitta rätt unit
    }
    findCorrectUnit(ref, unitType) {
        let newUnit;
        let units = this.props.units;
        let unitsIndex;
        if (unitType === 'volume') {
            unitsIndex = 0;
        } else if (unitType === 'weight') {
            unitsIndex = 1;
        }
        for (let unit in units[unitsIndex]) {
            if (units[unitsIndex].hasOwnProperty(unit)) {
                let curUnit = units[unitsIndex][unit];
                if ((ref / curUnit.ref < curUnit.max) && (!newUnit || curUnit.ref < newUnit.ref)) {
                    newUnit = curUnit;
                }
            }
        }
        return {
            amount: (ref / newUnit.ref).toFixed(),
            unit: newUnit.name
        };
    }

    findUnit(ingredient) {
        let units = this.props.units;
        for (let i = 0; i < units.length; i++) {
            for (let unit in units[i]) {
                if (units[i].hasOwnProperty(unit)) {
                    let curUnit = units[i][unit];
                    if (curUnit.name === ingredient.unit || curUnit.fullName === ingredient.unit) {
                        return curUnit;
                    }
                }
            }
        }
    }

    waitForProps() {
        let that = this;
        let j = 0;
        let waitProps = setInterval(function () {
            if (that.props.recipes.length > 0) {
                console.log("force rerender")
                that.forceUpdate();
                clearInterval(waitProps);
            }
            j++;
            if (j > 100) {
                clearInterval(waitProps);
            }
        }, 500);
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
        for (let i = 0; i < this.props.foods.length; i++) {
            if (chartData.datasets[0].data.length === 100) {
                break;
            }
            let food = this.props.foods[i];
            //lägg till att när man hovrar eller klickar på en dataPoint så ska man se totalt antal av den ingrediensen?
            //eller blir det svårt? Nytt diagram med funfacts på förutbestämda ingredienser?
            //eller hämta både volym, vikt och antal på alla ingredienser i top 100. Om vikt eller volym är väldigt liten del så visai nte alls

            chartData.datasets[0].label = "Antal recept per ingrediens";
            if (this.state.foodExcludes.indexOf(food.name) === -1) {
                chartData.datasets[0].data.push(food.uses);
                chartData.labels.push(food.name);
                chartData.datasets[0].backgroundColor.push(this.state.colors[i % 2]);
            }
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
                            footer += " " + totalScales.pieces+totalScales.forp + " st";
                        }
                        if (totalScales.forp > 0) {
                            footer += " " + totalScales.forp + " förp";
                        }
                        if (totalScales.volume.amount > 0) {
                            footer += " " + totalScales.volume.amount + " " + totalScales.volume.unit;
                        }
                        if (totalScales.weight.amount > 0) {
                            footer += " " + totalScales.weight.amount + " " + totalScales.weight.unit;
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




    render() {
        if (this.props.recipes.length === 0) {
            this.waitForProps();
        }

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
                    <h2>Ingredienser</h2>
                    <HorizontalBar data={this.getRecipesPerFood()} width={100}
                        height={1250}
                        options={this.getRecipesPerFoodOptions()} />
                </div>
            </div>
        );
    }
}
export default Stats;