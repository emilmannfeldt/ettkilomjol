import React, { Component } from 'react';
import Home from './home';
import { fire } from '../base';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Stats from './pages/stats';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
    };
    this.authListener = this.authListener.bind(this);
  }

  componentDidMount() {
    console.log("app didmount")
    this.authListener();
    if (!this.state.user) {
      fire.auth().signInAnonymously().catch(function (error) {
        console.log("ERROR sign in anonymous" + error);
      });
    }
  }

  authListener() {
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log("app login")
        console.log(user)
        this.setState({ user });
      } else {
        fire.auth().signInAnonymously().catch(function (error) {
          console.log("ERROR sign in anonymous" + error);
        });
        console.log("app logout")
      }
    });
  }

  render() {

    return (
      <MuiThemeProvider>
        {this.state.user ? (
          <Home />
        ) : (null)}
      </MuiThemeProvider>

    );
  }
}
export default App;

