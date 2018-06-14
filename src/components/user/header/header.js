import React, { Component } from 'react';
import './header.css';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/more-vert';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import Button from '@material-ui/core/Button';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import headerImg from './pexels-photo-262918.jpeg';
import { fire } from '../../../base';
import firebase from 'firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';


class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoginPage: false
    };
    this.logout = this.logout.bind(this);
    this.login = this.login.bind(this);

  }
  uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // We will display Google and Facebook as auth providers.
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      signInSuccessWithAuthResult: () => {
        this.setState({
          showLoginPage: false,
        });
        return false;
      }
    }
  }

  logout(e) {
    e.preventDefault();
    this.setState({
      showLoginPage: false
    });
    console.log("signout");
    fire.auth().signOut();
  }
  login(e) {
    e.preventDefault();
    this.setState({
      showLoginPage: !this.state.showLoginPage
    });
    console.log("signin");
  }

  render() {
    return (
      <div>
        {window.location.href.endsWith("/stats") ?
          null : <div className="headerImageContainer">
            <img src={headerImg} id="headerimage" />
          </div>}

        <Toolbar>
          <ToolbarGroup firstChild={true}>
            <ToolbarTitle className="toolbar-title"
              text={'Ett kilo mjöl'} />
          </ToolbarGroup>
          <ToolbarGroup>
            <FontIcon className="muidocs-icon-custom-sort" />
            {fire.auth().currentUser.isAnonymous ? (
              <Button onClick={this.login} variant="contained" className="login-btn" color="primary" >
                {this.state.showLoginPage ? 'Avbryt' : 'Logga in'}
          </Button>
            ) : (
                <Button onClick={this.logout} variant="contained" className="login-btn" color="primary" >
                  Logga ut
          </Button>)}

            <IconMenu
              iconButtonElement={
                <IconButton touch={true} className="toolbar-more-btn">
                  <NavigationExpandMoreIcon className="toolbar-more-icon" />
                </IconButton>
              }
            >
              <MenuItem primaryText="Kontakta mig" />
              <MenuItem primaryText="Om applikationen" />
            </IconMenu>
          </ToolbarGroup>
        </Toolbar>
        {this.state.showLoginPage ? (
          <div className="login-form">
            <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={fire.auth()} />
          </div>
        ) : (null)}
      </div>
    );
  }
}
export default Header;

