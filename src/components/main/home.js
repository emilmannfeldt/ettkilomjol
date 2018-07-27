import React, { Component } from 'react';
import FilterableRecipeList from './filterableRecipeList';
import './main.css';
import Utils from '../../util';
import Header from '../header/header';
import Footer from '../footer/footer';
import { fire } from '../../base';
import {
    HashRouter as Router,
    Route,
} from "react-router-dom";
import Stats from '../pages/stats/stats';
import Faq from '../pages/faq/faq';
import Contact from '../util/contact';
import MyRecipes from '../pages/favorites/favorites';
import MySnackbar from '../util/mySnackbar';
import MyGrocerylists from '../pages/grocerylist/myGrocerylists';

let indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tags: [],
            foods: [],
            recipes: [],
            units: [],
            users: [],
            favs: [],
            grocerylists: [],
            MIN_USES_FOOD: 5,
            MIN_USES_TAG: 8,
            MIN_ACCEPTED_RECIPES: 17000,
            DAYS_TO_SAVE_LOCALSTORAGE: 30,
            contactOpen: false,
            contactSubject: '',
            snackbarType: '',
            snackbarAction: null
        }
        this.localIsOld = this.localIsOld.bind(this);
        this.getRecipesIndexedDB = this.getRecipesIndexedDB.bind(this);
        this.favListener = this.favListener.bind(this);
        this.grocerylistListener = this.grocerylistListener.bind(this);
        this.setSnackbar = this.setSnackbar.bind(this);

    }
    handleContactOpen = (subject) => {
        this.setState({
            contactOpen: true,
            contactSubject: subject,
        });
    };

    handleContactClose = () => {
        this.setState({
            contactOpen: false,
            contactSubject: ''
        });
    };
    componentDidMount() {
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
        if (this.state.users.length < 1 || this.localIsOld('lastupdatedusers')) {
            console.log("LOADING NEW USERS");
            usersRef.once('value', function (snapshot) {
                let usersTmp = [];
                snapshot.forEach(function (child) {
                    usersTmp.splice(0, 0, child.val());
                });
                that.setState({
                    users: usersTmp
                });
                localStorage.setItem('users', JSON.stringify(usersTmp));
            });
            localStorage.setItem('lastupdatedusers', JSON.stringify(Date.now()));
        }
        fire.auth().onAuthStateChanged((user) => {
            if (user) {
                this.favListener();
                this.grocerylistListener();
            }
        });
    }

    favListener() {
        var favRef = fire.database().ref('users/' + fire.auth().currentUser.uid + '/fav');
        let that = this;
        favRef.on('value', function (snapshot) {
            if (snapshot.val()) {
                let favsTmp = Object.keys(snapshot.val());
                for (let i = 0; i < favsTmp.length; i++) {
                    favsTmp[i] = Utils.decodeSource(favsTmp[i]);
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
    grocerylistListener() {
        //validate list name does not contain firebase invalid chars. and does not exist
        //kolla på icas lösning
        //varje lista ska ha en egen vy som ica.se. en enkel översyn på alla listor med namn och skap ny/radera lista
        //sen måste man klicka på varje lista för att se innehåll och ändra ingredienser.
        //lägg till en sida där listorna visas upp
        //lägg till funktion för att lägga till items
        //lägg till funktion för att skapa ny lista
        //lägg till funktion för att ta bort item
        //lägg till funktion för att ta bort lista
        //lägg till funktion på recepcard att lägga till alla ingredienser på receptet. receptet source ska kopplas till listan
        //lägg till funktion i recipecard/ingredientlist att lägga till en ignrediens som item

        //hur kan man snabbt lägga till alla saknade ingredienser från receptet. ha en till knapp i ingredientlistcomponent? 
        //ett val vid recipecard lägg till recept där man får välja alla/saknade eller 
        //så får man upp en lista med förkryssade ingredienser och sen optout på dom man inte vill ha med? med synligt vilka som är missing
        var groceryRef = fire.database().ref('users/' + fire.auth().currentUser.uid + '/grocerylists');
        let that = this;
        groceryRef.on('value', function (snapshot) {
            if (snapshot.val()) {
                let listTmp = [];
                snapshot.forEach(function (child) {
                    let groceryList = child.val();
                    if (groceryList.items) {
                        let itemKeys = Object.keys(groceryList.items);
                        let tmpItems = [];
                        for (let i = 0; i < itemKeys.length; i++) {
                            let item = groceryList.items[itemKeys[i]];
                            item.key = itemKeys[i];
                            tmpItems.splice(0, 0, item);
                        }
                        tmpItems.sort(function (a, b) {
                            return (a.done === b.done) ? 0 : a.done ? 1 : -1;
                        });
                        groceryList.items = tmpItems;
                    }
                    //loppa igenom alla .recipes och kör util.decode
                    listTmp.splice(0, 0, groceryList);
                });
                listTmp.sort(function (a, b) {
                    return b.created - a.created;
                });
                that.setState({
                    grocerylists: listTmp
                });
            } else {
                that.setState({
                    grocerylists: [],
                });
            }
        });
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
            db.createObjectStore("RecipeStore", { keyPath: "source" });
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
                Utils.hideSpinner();
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
                        Utils.hideSpinner();
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
                        Utils.hideSpinner();
                    }
                    console.log("recipedb success end");
                };
            }
        }
    }
    setSnackbar(type, action) {
        //Denna skapar en evig loop. updatering av state rerender och runt
        this.setState({
            snackbarType: type,
            snackbarAction: action,
        });
    }

    render() {
        return (
            <Router>
                <div>
                    <Header />
                    <div id="content">
                        <Route exact path="/grocerylists" render={() => <MyGrocerylists grocerylists={this.state.grocerylists} foods={this.state.foods} units={this.state.units} recipes={this.state.recipes} setSnackbar={this.setSnackbar} />} />
                        <Route exact path="/favorites" render={() => <MyRecipes grocerylists={this.state.grocerylists} recipes={this.state.recipes} favs={this.state.favs} setSnackbar={this.setSnackbar} units={this.state.units}/> } />
                        <Route exact path="/faq" render={() => <Faq openContact={this.handleContactOpen} />} />
                        <Route exact path="/stats" render={() => <Stats users={this.state.users} tags={this.state.tags} foods={this.state.foods} recipes={this.state.recipes} units={this.state.units} />} />
                        <Route exact path="/" render={() => <FilterableRecipeList units={this.state.units} grocerylists={this.state.grocerylists} tags={this.state.tags} foods={this.state.foods} recipes={this.state.recipes} favs={this.state.favs} setSnackbar={this.setSnackbar} />} />
                    </div>
                    <Footer openContact={this.handleContactOpen} />
                    {this.state.contactOpen && <Contact onClose={this.handleContactClose} subject={this.state.contactSubject} />}
                    {this.state.snackbarType && <MySnackbar action={this.state.snackbarAction} variant={this.state.snackbarType} setSnackbar={this.setSnackbar} />}
                </div>
            </Router>
        );
    }
}

export default Home;