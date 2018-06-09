import React, { Component } from 'react';
import './stats.css';
import { Doughnut, Bar } from 'react-chartjs-2';


class Stats extends Component {
    constructor(props) {
        super(props);
    }


// refresh på /stats kör index.js men props kommer inte med hit? 
// eller gör dem det men det inte uppdateras
//jag behöver simluera klick på stats eller force rerender efter några sekunder?
    getRecipesPerSource() {
        //fix for page refresh not getting not getting props
        //it waits for props to have been set and then updates component
        //can i move this to a own function? and also take props.tags and props.foods in to a count?
        if(this.props.recipes.length == 0){
            let that = this;
            let j = 0;
            let waitProps = setInterval(function() {
                if(that.props.recipes.length > 0){
                    console.log("force rerender")
                    that.forceUpdate();
                    clearInterval(waitProps);
                }
                j++;
                if(j > 100){
                    clearInterval(waitProps);
                }
            }, 500);
            return;
        }
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
            }else{
                console.log("ERROR" + recipe.source)
            }
        }
console.log(mittkok);
        return [ica, tasteline, koket, mittkok];
    }

    render() {

        //lightblue: #4bc0c0 purple: #9966ff red: #ff6384 orange: #ff9f40 yellow: #ffcd56 blue: #36a2eb gray: #c9cbcf
        const defaultOptions = {
            maintainAspectRatio: false,
            responsiveAnimationDuration: 1000,
            animation: {
                easing: 'easeOutQuart',
            },
        }

        let recipesPerSource = {
            labels: [
                'Ica',
                'Tasteline',
                'Köket.se',
                'Mitt kök'
            ],
            datasets: [{
                data: this.getRecipesPerSource(),
                backgroundColor: [
                    '#ff6384',
                    '#4bc0c0',
                    '#ff9f40',
                    '#36a2eb'
                ]
            }]
        };
        const barData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'My First dataset',
                    backgroundColor: 'rgba(255,99,132,0.2)',
                    borderColor: 'rgba(255,99,132,1)',
                    borderWidth: 1,
                    hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                    hoverBorderColor: 'rgba(255,99,132,1)',
                    data: [65, 59, 80, 81, 56, 55, 40]
                }
            ]
        };
        return (
            <div>
                <div>
                    <h2>Doughnut Example</h2>
                    <Doughnut data={recipesPerSource} width={100}
                        height={50}
                        options={defaultOptions} />
                </div>
                <div>                   <h2>Bar Example (custom size)</h2>
                    <Bar
                        data={barData}
                        width={100}
                        height={50}
                        options={defaultOptions}
                    /></div>
            </div>
        );
    }
}
export default Stats;