import React, { Component } from 'react';
import './header.css';
import { Link } from 'react-router-dom';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import LoggedInIcon from 'material-ui/svg-icons/social/person';
import LoginIcon from '@material-ui/icons/PersonOutline';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/more-vert';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import Button from '@material-ui/core/Button';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import headerImg from './pexels-photo-262918.jpeg';
import { fire } from '../../../base';
import firebase from 'firebase/app';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
//https://www.youtube.com/watch?v=2ciHixbc4HE bra genomgång av userdata koppling
//det ska vara effektivt att spara nya recept listor, lägga till saker..
//hämting gör jag en gång i början och sen cachar? eller behöver jag ladda det on the go?
//ha en "userData" object i cachen och props som hämtat både favoriter och köplistor. koll om den den stämmer med currentUserId. 
//

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
    function MenuItemList(props) {
      if (!fire.auth().currentUser || fire.auth().currentUser.isAnonymous) {
        return (<div>
          <Link to={'/'}><MenuItem primaryText="Sök recept" /></Link>
          <Link to={'/stats'}><MenuItem primaryText="Siffror" /></Link>
          <MenuItem primaryText="Logga in" onClick={props.loginAction} />
        </div>
        );
      } else {
        return (<div>
          <Link to={'/'}><MenuItem primaryText="Sök recept" /></Link>
          <Link to={'/stats'}><MenuItem primaryText="Siffror" /></Link>
          <MenuItem primaryText="Mina favoritrecept" />
          <MenuItem primaryText="Mina inköpslistor" />
          <MenuItem primaryText="Logga ut" onClick={props.logoutAction} />
        </div>);
      }
    }
    let backgroundImage = <div className="headerImageContainer">
      <img src={headerImg} id="headerimage" />
    </div>;
    if (window.location.href.endsWith("/stats") || window.location.href.endsWith("/faq")) {
      backgroundImage = null;
    }

    return (
      <div>
        {backgroundImage}
        <Toolbar className="toolbar">
          <ToolbarGroup firstChild={true}>
            <Link to={'/'}>
              <ToolbarTitle className="toolbar-title"
                text={'Ett kilo mjöl'} />
            </Link>
          </ToolbarGroup>
          <ToolbarGroup>
            <FontIcon className="muidocs-icon-custom-sort" />
            {fire.auth().currentUser.isAnonymous ? (
              <Button onClick={this.login} size="small" className="login-btn" >
                <LoginIcon />
                {this.state.showLoginPage ? 'Avbryt' : 'Logga in'}
              </Button>
            ) : (<div>
              <LoggedInIcon className="toolbar-more-icon" /><span className="username-label"> {fire.auth().currentUser.displayName}</span></div>
              )}

            <IconMenu
              iconButtonElement={
                <IconButton touch={true} className="toolbar-more-btn">
                  <NavigationExpandMoreIcon className="toolbar-more-icon" />
                </IconButton>
              }
            >
              <MenuItemList logoutAction={this.logout} loginAction={this.login} />
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

