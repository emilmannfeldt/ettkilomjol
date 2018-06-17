import React, { Component } from 'react';
import FilterableRecipeList from './filterableRecipeList';
import './home.css';

import Header from './user/header/header';
import Footer from './user/footer/footer';
import { fire } from '../base';
import LinearProgress from '@material-ui/core/LinearProgress';
import {
    HashRouter as Router,
    Route,
} from "react-router-dom";
import Stats from './pages/stats';

let indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tags: [],
            foods: [],
            recipes: [],
            units: [],
            favs: [],
            MIN_USES_FOOD: 5,
            MIN_USES_TAG: 8,
            MIN_ACCEPTED_RECIPES: 17000,
            DAYS_TO_SAVE_LOCALSTORAGE: 1,
        }
        this.localIsOld = this.localIsOld.bind(this);
        this.getRecipesIndexedDB = this.getRecipesIndexedDB.bind(this);
        this.hideSpinner = this.hideSpinner.bind(this);
        this.favListener = this.favListener.bind(this);

    }
    componentDidMount() {
        //kanske kan sätta detta direkt i construktorn?
        this.setState({
            tags: JSON.parse(localStorage.getItem('tags')) || [],
            foods: JSON.parse(localStorage.getItem('foods')) || [],
            units: JSON.parse(localStorage.getItem('units')) || [],
        });
        this.getRecipesIndexedDB();
        let foodRef = fire.database().ref("foods");
        let unitsRef = fire.database().ref("units");
        let tagsRef = fire.database().ref("tags");
        let usersRef = fire.database().ref("users");
        let recipeRef = fire.database().ref("recipes");
        let that = this;
        if (this.state.foods.length < 1 || this.localIsOld('lastupdatedfoods')) {
            console.log("LOADING NEW FOODS");
            foodRef.orderByChild("uses").once("value", function (snapshot) {
                let foodsTmp = [];
                snapshot.forEach(function (child) {
                    if (child.val().uses >= that.state.MIN_USES_FOOD) {
                        foodsTmp.splice(0, 0, child.val());
                    }
                });
                that.setState({
                    foods: foodsTmp
                });
                localStorage.setItem('foods', JSON.stringify(foodsTmp));
            });
            localStorage.setItem('lastupdatedfoods', JSON.stringify(Date.now()));
        }

        if (this.state.units.length < 1 || this.localIsOld('lastupdatedunits')) {
            console.log("LOADING NEW UNITS");
            unitsRef.once("value", function (snapshot) {
                let unitsTmp = snapshot.val();
                for (let type in unitsTmp) {
                    if (unitsTmp.hasOwnProperty(type)) {
                        let unit = Object.keys(unitsTmp[type]).map(function (key) { return unitsTmp[type][key]; });
                        unit.sort(function (a, b) {
                            return a.ref - b.ref;
                        });
                        unitsTmp[type] = unit;
                    }
                }
                that.setState({
                    units: unitsTmp
                });
                localStorage.setItem('units', JSON.stringify(unitsTmp));
            });
            localStorage.setItem('lastupdatedunits', JSON.stringify(Date.now()));
        }

        if (this.state.tags.length < 1 || this.localIsOld('lastupdatedtags')) {
            console.log("LOADING NEW TAGS");
            tagsRef.orderByChild("uses").once("value", function (snapshot) {
                let tagsTmp = [];
                snapshot.forEach(function (child) {
                    if (child.val().uses >= that.state.MIN_USES_TAG) {
                        tagsTmp.splice(0, 0, child.val());
                    }
                });
                that.setState({
                    tags: tagsTmp
                });
                localStorage.setItem('tags', JSON.stringify(tagsTmp));
            });
            localStorage.setItem('lastupdatedtags', JSON.stringify(Date.now()));
        }
        fire.auth().onAuthStateChanged((user) => {
            if (user) {
                this.favListener();

            }
        });
    }

    favListener() {
        console.log("calling favListener")
        //denna körs väl inte varje gång det kommer in ett ny fav updateras?
        var favRef = fire.database().ref('users/' + fire.auth().currentUser.uid + '/fav');
        let that = this;
        favRef.on('value', function (snapshot) {
            if (snapshot.val()) {
                console.log("setting favs:" + Object.keys(snapshot.val()));
                let favsTmp = Object.keys(snapshot.val());
                for(let i = 0; i < favsTmp.length; i++){
                    favsTmp[i] = that.decodeSource(favsTmp[i]);
                }
                that.setState({
                    favs: favsTmp,
                });
            } else {
                that.setState({
                    favs: [],
                });
            }

        });

    }
//fixa tabort funktion. och sen fixa snackbaren så att den visar rätt info och även inloggningsrutan
    decodeSource(source){
        return source.replace(/,/g,'.').replace(/\+/g,'/');
    }

    localIsOld = function (localVar) {
        let yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - this.state.DAYS_TO_SAVE_LOCALSTORAGE);
        let storage = JSON.parse(localStorage.getItem(localVar)) || '';
        if (storage < yesterday.getTime()) {
            return true;
        }
        return false;
    }
    getRecipesIndexedDB() {
        let that = this;
        console.log("getRecipesIndexedDB");
        let recipeRef = fire.database().ref("recipes");
        let open = indexedDB.open("RecipeDatabase", 1);
        let upgraded = false;
        open.onupgradeneeded = function (e) {
            console.log("onupgradeneeded");
            upgraded = true;
            console.log("INDEXDB upgrade")
            var db = open.result;
            var store = db.createObjectStore("RecipeStore", { keyPath: "source" });
        }
        open.onsuccess = function () {
            console.log("onsuccess");
            let db = open.result;
            let reloadedFromFirebase = false;
            if (upgraded || that.localIsOld('lastupdatedrecipes')) {
                console.log("upgraded or localisold");
                recipeRef.once('value', function (snapshot) {
                    let recipesTmp = [];
                    snapshot.forEach(function (child) {
                        recipesTmp.push(child.val());
                    });
                    that.setState({
                        recipes: recipesTmp
                    });
                    console.log(recipesTmp.length + " Recept laddade från firebase");
                    for (let i = 0; i < recipesTmp.length; i++) {
                        let tx = db.transaction("RecipeStore", "readwrite");
                        let store = tx.objectStore("RecipeStore");
                        store.put(recipesTmp[i]);
                    }
                });
                localStorage.setItem('lastupdatedrecipes', JSON.stringify(Date.now()));
                reloadedFromFirebase = true;
                that.hideSpinner();
            }
            if (!reloadedFromFirebase && that.state.recipes.length < 1) {
                console.log("inte hämtat från firebase och recepies är fortfarande tom");
                let tx = db.transaction("RecipeStore", "readwrite");
                let store = tx.objectStore("RecipeStore");
                let recipedb = store.getAll();
                recipedb.onsuccess = function () {
                    console.log("onsuccess connected to recipedb");
                    if (recipedb.result.length < that.state.MIN_ACCEPTED_RECIPES) {
                        console.log("recipedb innehåller för få recept. hämtar från firebase");
                        recipeRef.once('value', function (snapshot) {
                            let recipesTmp = [];
                            snapshot.forEach(function (child) {
                                recipesTmp.push(child.val());
                            });
                            that.setState({
                                recipes: recipesTmp
                            });
                            console.log(recipesTmp.length + " Recept laddade från firebase pga result endast var " + recipedb.result.length);
                            for (let i = 0; i < recipesTmp.length; i++) {
                                let tx = db.transaction("RecipeStore", "readwrite");
                                let store = tx.objectStore("RecipeStore");
                                store.put(recipesTmp[i]);
                            }
                        });
                        localStorage.setItem('lastupdatedrecipes', JSON.stringify(Date.now()));
                        that.hideSpinner();
                    } else {
                        console.log("Hämtar recept från indexDB");
                        let recipesTmp = [];
                        for (let i = 0; i < recipedb.result.length; i++) {
                            recipesTmp.push(recipedb.result[i]);
                        }
                        that.setState({
                            recipes: recipesTmp
                        });
                        console.log(recipesTmp.length + " Recept laddade från indexedDB");
                        that.hideSpinner();
                    }
                    console.log("recipedb success end");
                };
            }
        }
    }
    hideSpinner() {
        document.querySelector(".spinner").style.display = 'none';
    }
    render() {
        return (
            <Router>
                <div>
                    <div className='spinner'>
                        <LinearProgress />
                    </div>
                    <Header />
                    <Route exact path="/stats" render={() => <Stats tags={this.state.tags} foods={this.state.foods} recipes={this.state.recipes} units={this.state.units} />} />
                    <Route exact path="/" render={() => <FilterableRecipeList tags={this.state.tags} foods={this.state.foods} recipes={this.state.recipes} favs={this.state.favs} />} />
                    <Footer />

                </div>
            </Router>
        );
    }
}

export default Home;