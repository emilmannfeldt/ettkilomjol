import React, { Component } from 'react';
import Home from './home';
import { fire } from '../base';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import LinearProgress from '@material-ui/core/LinearProgress';

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
  }

  authListener() {
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log("app login")
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
        <div>
          <div className='spinner'>
            <LinearProgress />
          </div>
          {this.state.user ? (
            <Home />
          ) : (null)}
        </div>
      </MuiThemeProvider>
    );
  }
}
export default App;