/* eslint no-console: 0 */

import React, { Component } from 'react';
import './main.css';
import {
  HashRouter as Router,
  Route,
} from 'react-router-dom';
import Utils from '../../util';
import Header from '../header/header';
import Footer from '../footer/footer';
import { fire } from '../../base';
import FilterableRecipeList from './filterableRecipeList';
import Stats from '../pages/stats/stats';
import Faq from '../pages/faq/faq';
import Contact from '../util/contact';
import MyRecipes from '../pages/favorites/favorites';
import MySnackbar from '../util/mySnackbar';
import MyGrocerylists from '../pages/grocerylist/myGrocerylists';

const indexedDB = window.indexedDB
              || window.mozIndexedDB
              || window.webkitIndexedDB
              || window.msIndexedDB
              || window.shimIndexedDB;
const MIN_USES_FOOD = 5;
const MIN_USES_TAG = 8;
const MIN_ACCEPTED_RECIPES = 100;
const DAYS_TO_SAVE_LOCALSTORAGE = 30;

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
      contactOpen: false,
      contactSubject: '',
      snackbarType: '',
      snackbarAction: null,
    };
    this.localIsOld = this.localIsOld.bind(this);
    this.getRecipesIndexedDB = this.getRecipesIndexedDB.bind(this);
    this.favListener = this.favListener.bind(this);
    this.grocerylistListener = this.grocerylistListener.bind(this);
    this.setSnackbar = this.setSnackbar.bind(this);
  }

  componentDidMount() {
    this.setState({
      tags: JSON.parse(localStorage.getItem('tags')) || [],
      foods: JSON.parse(localStorage.getItem('foods')) || [],
      units: JSON.parse(localStorage.getItem('units')) || [],
    });
    this.getRecipesIndexedDB();
    const foodRef = fire.database().ref('foods');
    const unitsRef = fire.database().ref('units');
    const tagsRef = fire.database().ref('tags');
    const usersRef = fire.database().ref('users');
    const that = this;

    const {
      foods, units, tags, users,
    } = this.state;

    if (foods.length < 1 || this.localIsOld('lastupdatedfoods')) {
      console.log('LOADING NEW FOODS');
      foodRef.orderByChild('uses').once('value', (snapshot) => {
        const foodsTmp = [];
        snapshot.forEach((child) => {
          if (child.val().uses >= MIN_USES_FOOD) {
            foodsTmp.splice(0, 0, child.val());
          }
        });
        that.setState({
          foods: foodsTmp,
        });
        localStorage.setItem('foods', JSON.stringify(foodsTmp));
      });
      localStorage.setItem('lastupdatedfoods', JSON.stringify(Date.now()));
    }

    if (units.length < 1 || this.localIsOld('lastupdatedunits')) {
      console.log('LOADING NEW UNITS');
      unitsRef.once('value', (snapshot) => {
        const unitsTmp = snapshot.val();
        for (const type in unitsTmp) {
          if (unitsTmp[type]) {
            const unit = Object.keys(unitsTmp[type]).map(key => unitsTmp[type][key]);
            unit.sort((a, b) => a.ref - b.ref);
            unitsTmp[type] = unit;
          }
        }
        that.setState({
          units: unitsTmp,
        });
        localStorage.setItem('units', JSON.stringify(unitsTmp));
      });
      localStorage.setItem('lastupdatedunits', JSON.stringify(Date.now()));
    }

    if (tags.length < 1 || this.localIsOld('lastupdatedtags')) {
      console.log('LOADING NEW TAGS');
      tagsRef.orderByChild('uses').once('value', (snapshot) => {
        const tagsTmp = [];
        snapshot.forEach((child) => {
          if (child.val().uses >= MIN_USES_TAG) {
            tagsTmp.splice(0, 0, child.val());
          }
        });
        that.setState({
          tags: tagsTmp,
        });
        localStorage.setItem('tags', JSON.stringify(tagsTmp));
      });
      localStorage.setItem('lastupdatedtags', JSON.stringify(Date.now()));
    }
    if (users.length < 1 || this.localIsOld('lastupdatedusers')) {
      console.log('LOADING NEW USERS');
      usersRef.once('value', (snapshot) => {
        const usersTmp = [];
        snapshot.forEach((child) => {
          usersTmp.splice(0, 0, child.val());
        });
        that.setState({
          users: usersTmp,
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

  setSnackbar(type, action) {
    // Denna skapar en evig loop. updatering av state rerender och runt
    this.setState({
      snackbarType: type,
      snackbarAction: action,
    });
  }

  getRecipesIndexedDB() {
    const that = this;
    console.log('getRecipesIndexedDB');
    const recipeRef = fire.database().ref('recipes');
    const open = indexedDB.open('RecipeDatabase', 1);
    let upgraded = false;
    open.onupgradeneeded = function onupgradeneeded(e) {
      console.log('onupgradeneeded');
      upgraded = true;
      console.log('INDEXDB upgrade');
      const db = open.result;
      db.createObjectStore('RecipeStore', { keyPath: 'source' });
    };
    open.onsuccess = function onsuccess() {
      console.log('onsuccess');
      const db = open.result;
      let reloadedFromFirebase = false;
      if (upgraded || that.localIsOld('lastupdatedrecipes')) {
        console.log('upgraded or localisold');
        recipeRef.once('value', (snapshot) => {
          const recipesTmp = [];
          snapshot.forEach((child) => {
            recipesTmp.push(child.val());
          });
          that.setState({
            recipes: recipesTmp,
          });
          console.log(`${recipesTmp.length} Recept laddade från firebase`);
          for (let i = 0; i < recipesTmp.length; i++) {
            const tx = db.transaction('RecipeStore', 'readwrite');
            const store = tx.objectStore('RecipeStore');
            store.put(recipesTmp[i]);
          }
        });
        localStorage.setItem('lastupdatedrecipes', JSON.stringify(Date.now()));
        reloadedFromFirebase = true;
        Utils.hideSpinner();
      }
      if (!reloadedFromFirebase && that.state.recipes.length < 1) {
        console.log('inte hämtat från firebase och recepies är fortfarande tom');
        const tx = db.transaction('RecipeStore', 'readwrite');
        const store = tx.objectStore('RecipeStore');
        const recipedb = store.getAll();
        recipedb.onsuccess = function storeOnsuccess() {
          console.log('onsuccess connected to recipedb');
          if (recipedb.result.length < MIN_ACCEPTED_RECIPES) {
            console.log('recipedb innehåller för få recept. hämtar från firebase');
            recipeRef.once('value', (snapshot) => {
              const recipesTmp = [];
              snapshot.forEach((child) => {
                recipesTmp.push(child.val());
              });
              that.setState({
                recipes: recipesTmp,
              });
              console.log(`${recipesTmp.length} Recept laddade från firebase pga result endast var ${recipedb.result.length}`);
              for (let i = 0; i < recipesTmp.length; i++) {
                const tmptx = db.transaction('RecipeStore', 'readwrite');
                const tmpstore = tmptx.objectStore('RecipeStore');
                tmpstore.put(recipesTmp[i]);
              }
            });
            localStorage.setItem('lastupdatedrecipes', JSON.stringify(Date.now()));
            Utils.hideSpinner();
          } else {
            console.log('Hämtar recept från indexDB');
            const recipesTmp = [];
            for (let i = 0; i < recipedb.result.length; i++) {
              recipesTmp.push(recipedb.result[i]);
            }
            that.setState({
              recipes: recipesTmp,
            });
            console.log(`${recipesTmp.length} Recept laddade från indexedDB`);
            Utils.hideSpinner();
          }
          console.log('recipedb success end');
        };
      }
    };
  }

    localIsOld = (localVar) => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - DAYS_TO_SAVE_LOCALSTORAGE);
      const storage = JSON.parse(localStorage.getItem(localVar)) || '';
      if (storage < yesterday.getTime()) {
        return true;
      }
      return false;
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
        contactSubject: '',
      });
    };

    grocerylistListener() {
      const groceryRef = fire.database().ref(`users/${fire.auth().currentUser.uid}/grocerylists`);
      const that = this;
      groceryRef.on('value', (snapshot) => {
        if (snapshot.val()) {
          const listTmp = [];
          snapshot.forEach((child) => {
            const groceryList = child.val();
            if (groceryList.items) {
              const itemKeys = Object.keys(groceryList.items);
              const tmpItems = [];
              for (let i = 0; i < itemKeys.length; i++) {
                const item = groceryList.items[itemKeys[i]];
                item.key = itemKeys[i];
                tmpItems.splice(0, 0, item);
              }
              tmpItems.sort((a, b) => a.done - b.done);
              groceryList.items = tmpItems;
            }
            listTmp.splice(0, 0, groceryList);
          });
          listTmp.sort((a, b) => b.created - a.created);
          that.setState({
            grocerylists: listTmp,
          });
        } else {
          that.setState({
            grocerylists: [],
          });
        }
      });
    }

    favListener() {
      const favRef = fire.database().ref(`users/${fire.auth().currentUser.uid}/fav`);
      const that = this;
      favRef.on('value', (snapshot) => {
        if (snapshot.val()) {
          const favKeys = Object.keys(snapshot.val());
          const favsTmp = favKeys.map(x => Utils.decodeSource(x));
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

    render() {
      const {
        foods, units, recipes, users, tags, grocerylists, snackbarAction, snackbarType, contactSubject, favs, contactOpen,
      } = this.state;
      return (
        <Router>
          <div>
            <Header />
            <div id="content">
              <Route exact path="/grocerylists" render={() => <MyGrocerylists grocerylists={grocerylists} foods={foods} units={units} recipes={recipes} setSnackbar={this.setSnackbar} />} />
              <Route exact path="/favorites" render={() => <MyRecipes grocerylists={grocerylists} recipes={recipes} favs={favs} setSnackbar={this.setSnackbar} units={units} />} />
              <Route exact path="/faq" render={() => <Faq openContact={this.handleContactOpen} />} />
              <Route exact path="/stats" render={() => <Stats users={users} tags={tags} foods={foods} recipes={recipes} units={units} />} />
              <Route exact path="/" render={() => <FilterableRecipeList units={units} grocerylists={grocerylists} tags={tags} foods={foods} recipes={recipes} favs={favs} setSnackbar={this.setSnackbar} />} />
            </div>
            <Footer openContact={this.handleContactOpen} />
            {contactOpen && <Contact onClose={this.handleContactClose} subject={contactSubject} />}
            {snackbarType && <MySnackbar action={snackbarAction} variant={snackbarType} setSnackbar={this.setSnackbar} />}
          </div>
        </Router>
      );
    }
}

export default Home;
