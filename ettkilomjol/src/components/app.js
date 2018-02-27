import React, { Component } from 'react';
import FilterableRecipeList from './filterableRecipeList';
import Filterbar from './search/filterbar/filterbar';
import Header from './user/header';
import {firebaseApp} from '../base';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedInUser: {},
      authenticated: false,
    };
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout() {
    this.setState({
        loggedInUser: null,
        authenticated: false,
    });
    firebaseApp.auth.signOut();
  }

  render() {
    return (
    <div>
        <Header onLogout={this.handleLogout} isAuthenticated={this.state.authenticated} loggedInUser={this.state.loggedInUser} />
        <FilterableRecipeList tags={this.props.tags} foods={this.props.foods} recipes={this.props.recipes} />
    </div>
    );
  }
}
export default App;

