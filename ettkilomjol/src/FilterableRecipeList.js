import React, { Component } from 'react';
import './App.css';
import RecipeList from './RecipeList';
import FilterBar from './FilterBar';

class FilterableRecipeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: {
        ingredients: [],
      }
    };

    this.handleFilterInput = this.handleFilterInput.bind(this);
  }

  handleFilterInput(changedFilter) {
    this.setState({
      filter: changedFilter
    });
  }
  render() {
    return (
      <div>
     
        <FilterBar onUserInput={ this.handleFilterInput } foods={ this.props.foods } filter={ this.state.filter } />
        <RecipeList recipeCards={ this.props.recipeCards } filter={ this.state.filter } />
      </div>
      );
  }
}
export default FilterableRecipeList;


// class App extends Component {

//   styles = {
//     chip: {
//       margin: 4,
//     },
//     wrapper: {
//       display: 'flex',
//       flexWrap: 'wrap',
//     },
//   };

//   constructor(props) {
//     super(props);
//     this.state = {
//       snackBarOpen: false,
//       snackBarText: 'this is a snackbar',
//       searchText: '',
//       searchChips: [],
//     };
//   }
//   showSnackBar = (snack) => {
//     this.setState({
//       snackBarOpen: true,
//       snackBarText: snack
//     });
//   }

//   handleRequestClose = () => {
//     this.setState({
//       snackBarOpen: false,
//     });
//   }

//   signInEmail(event) {
//     event.preventDefault();
//     let email = this.refs.email.value;
//     let password = this.refs.password.value;
//     firebase.auth.EmailAuthProvider.credential(email, password);
//     // showSnackBar('signed in!');

//   }

//   loadFoods(event) {
//     event.preventDefault();
//     console.log("LOAD FOODS");
//     // for (var i = 0; i < skafferi.length; i++) {
//     //   let foodName, foodUses;
//     //     foodName = skafferi[i].substring(0,skafferi[i].indexOf(" ("));
//     //     foodUses = skafferi[i].substring(skafferi[i].indexOf("(")+1,skafferi[i].indexOf(")"));

//     //     foodUses = Math.round(foodUses/10);

//     //     let food = {
//     //       name: foodName,
//     //       uses: foodUses
//     //     };

//     //     console.log(food);
//     //     console.log(food.name);
//     //     firebase.database().ref('foods/' + food.name).set(food);

//     // }

//   }

//   createUser(event) {
//     event.preventDefault();
//     console.log(this);
//     let email = this.refs.email.value;
//     let password = this.refs.password.value;
//     firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
//       // Handle Errors here.
//       var errorCode = error.code;
//       var errorMessage = error.message;
//       //showSnackBar(errorMessage);
//       console.log(errorMessage + errorCode + email + password);
//     // ...
//     });
//   //('user created!');
//   }

//   handleUpdateInput = (searchText) => {
//     this.setState({
//       searchText: searchText,
//     });
//   };

//   handleNewRequest = (searchText) => {
//     let foundFood = false;
//     for (var i = foods.length - 1; i >= 0; i--) {
//       if (foods[i] === searchText) {
//         foods.splice(i, 1);
//         foundFood = true;
//       }
//     }
//     if (!foundFood) {
//       this.setState({
//         searchText: ''
//       });
//       //visa snackbar att det inte finns en sådan ingrediens
//       return;
//     }
//     this.chipData = this.state.searchChips;
//     this.chipData.push(searchText);

//     this.setState({
//       searchText: '',
//       searchChips: this.chipData
//     });
//   };


//   handleRequestDelete = (key) => {
//     this.chipData = this.state.searchChips;
//     for (var i = this.chipData.length - 1; i >= 0; i--) {
//       if (this.chipData[i] === key) {
//         this.chipData.splice(i, 1);
//       }
//     }
//     foods.push(key);
//     this.setState({
//       chipData: this.chipData
//     });
//   };


//   renderChip(food) {
//     return (<Chip key={ food } onRequestDelete={ () => this.handleRequestDelete(food) } style={ this.styles.chip }>
//               { food }
//             </Chip>
//       );
//   };

//   render() {
//     return (
//       <div className="App container">
//         https://facebook.github.io/react/docs/thinking-in-react.html
//         <div className="col-lg-12" style={ this.styles.wrapper }>
//           { this.state.searchChips.map(this.renderChip, this) }
//         </div>
//         <div class="col-lg-12">
//           //autokompletten fungerar sådär. skriv eget filter? som fortfarande tar in uses i räkningen men även krav på att första bokstaven måste vara första bokstaven i söksträngen.
//           <AutoComplete searchText={ this.state.searchText } floatingLabelText="sök ingredienser" filter={ AutoComplete.caseInsensitiveFilter } onUpdateInput={ this.handleUpdateInput } dataSource={ foods }
//             onNewRequest={ this.handleNewRequest } maxSearchResults={ 5 } fullWidth={ true } />
//         </div>
//         <form onSubmit={ this.signInEmail.bind(this) }>
//           <TextField hindText="Ange Email" type="email" ref="email" /> //ref fungerar inte med material ui textfield. använd value prop till state?börja strukturera om alla delar jag har nu //och gör statiska ui componenter för
//           det jag komma använda, recipecard cardlist, filtercontainer, filter.kolla tutorial facebook
//           <input type="password" placeholder="Password" ref="password" />
//           <input type="email" placeholder="email" ref="email" />
//           <RaisedButton label="load data" primary={ true } onTouchTap={ this.loadFoods.bind(this) } />
//           <RaisedButton label="Create user" onTouchTap={ this.createUser.bind(this) } />
//         </form>
//         <Snackbar open={ this.state.snackBarOpen } message={ this.state.snackBarText } autoHideDuration={ 4000 } onRequestClose={ this.handleRequestClose } />
//       </div>
//       );
//   }
// }



