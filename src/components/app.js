import React, { Component } from 'react';
import FilterableRecipeList from './filterableRecipeList';
import Filterbar from './search/filterbar/filterbar';
import Header from './user/header/header';
import Footer from './user/footer/footer';
import { firebaseApp } from '../base';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from "react-router-dom";
import Stats from './pages/stats';

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
      <Router>
        <div>
          <Header onLogout={this.handleLogout} isAuthenticated={this.state.authenticated} loggedInUser={this.state.loggedInUser} />
          <Route exact path="/stats" render={()=><Stats tags={this.props.tags} foods={this.props.foods} recipes={this.props.recipes} units={this.props.units} />}/>
          <Route exact path="/" render={()=><FilterableRecipeList tags={this.props.tags} foods={this.props.foods} recipes={this.props.recipes} />}/>
          <Footer/>


        </div>
      </Router>
    );
  }
}
export default App;

