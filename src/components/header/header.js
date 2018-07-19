import React, { Component } from 'react';
import './header.css';
import { Link } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import LoggedInIcon from '@material-ui/icons/PersonOutline';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import LoginIcon from '@material-ui/icons/LockOutlined';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import headerImg from './header.jpg';
import { fire } from '../../base';
import firebase from 'firebase/app';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import Avatar from '@material-ui/core/Avatar';
import FavoriteIcon from '@material-ui/icons/FavoriteBorder';

import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';
import SearchIcon from '@material-ui/icons/Search';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoginPage: false,
      anchorEl: null
    };
    this.logout = this.logout.bind(this);
    this.login = this.login.bind(this);
    this.openMenu = this.openMenu.bind(this);
    this.handleClose = this.handleClose.bind(this);

  }
  uiConfig = {
    signInFlow: 'popup',
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
  openMenu = event => {
    this.setState({
      anchorEl: event.currentTarget,
    });
  };

  handleClose() {
    this.setState({
      anchorEl: null
    });
  }

  render() {
    function MenuItemList(props) {
      let items = [];
      let loggedIn = fire.auth().currentUser && !fire.auth().currentUser.isAnonymous;
      let currentu = fire.auth().currentUser;
      items.push(<Link key={items.length} className="hide-mobile" to={'/'}><MenuItem onClick={props.onClose}>Sök recept</MenuItem></Link>);
      if (loggedIn) {
        items.push(<Link key={items.length} className="hide-mobile" to={'/favorites'}><MenuItem onClick={props.onClose}>Mina favoriter</MenuItem></Link>);
        items.push(<Link key={items.length} className="hide-mobile" to={'/grocerylists'}><MenuItem onClick={props.onClose}>Mina inköpslistor</MenuItem></Link>);
      }
      items.push(<Link key={items.length} to={'/stats'}><MenuItem onClick={props.onClose}>Siffror</MenuItem></Link>);
      items.push(<Link key={items.length} className="hide-desktop" to={'/faq'}><MenuItem onClick={props.onClose} >FAQ</MenuItem></Link>);
      items.push(<MenuItem key={items.length} className="hide-desktop" onClick={() => { window.location.href = 'https://github.com/emilmannfeldt/ettkilomjol' }} >Github</MenuItem>);
      items.push(<MenuItem key={items.length} className="hide-desktop" onClick={() => { window.location.href = 'https://www.linkedin.com/in/mannfeldt/' }}  >LinkedIn</MenuItem>);
      if (loggedIn) {
        items.push(<MenuItem key={items.length} onClick={props.logoutAction} >Logga ut</MenuItem>);
      } else {
        items.push(<MenuItem key={items.length} onClick={props.loginAction} >Logga in</MenuItem>);
      }
      return (<div className="header-menulist">
        {items}
      </div>);
    }
    function MyLoginComponent(props) {
      if (fire.auth().currentUser.isAnonymous) {
        return (<Button onClick={props.logincall} size="small" className="login-btn" >
          <LoginIcon />
          {props.showLoginPage ? 'Avbryt' : 'Logga in'}
        </Button>);
      } else {
        if (fire.auth().currentUser.photoURL) {
          return (<Avatar className="appbar-login-avatar" src={fire.auth().currentUser.photoURL} alt="user avatar" tile="test" />);
        } else {
          return (<div><LoggedInIcon className="toolbar-more-icon" /> <span className="username-label"> {fire.auth().currentUser.displayName}</span></div >
          );
        }
      }
    }
    let backgroundImage = <div className="headerImageContainer">
      <img src={headerImg} id="headerimage" alt="bakgrundsbild" />
    </div>;
    if (window.location.href.endsWith("/stats")) {
      backgroundImage = null;
    }
    let titleText = "Ett Kilo Mjöl";
    if (fire.options.projectId === "ettkilomjol-dev") {
      titleText = "Ett Kilo Mjöl DEV";
    }

    return (
      <div id="header">
        {backgroundImage}
        <AppBar position="static">
          <Toolbar className="toolbar">
            <div className="appbar-container--left">
              <Link className="appbar-title" to={'/'}>
                {titleText}
              </Link>
              <span className="hide-mobile">
                <Link to={'/'}>
                  <Button className="appbar-nav-button">
                    <SearchIcon />
                    Sök recept
              </Button>
                </Link>
                <Link to={'/favorites'}>
                  <Button className="appbar-nav-button">
                    <FavoriteIcon />
                    Favoriter
              </Button>
                </Link>
                <Link to={'/grocerylists'}>
                  <Button className="appbar-nav-button">
                    <ShoppingCartOutlinedIcon />
                    Inköpslistor
              </Button>
                </Link>
              </span>
            </div>
            <div className="appbar-container--right">
              <MyLoginComponent logincall={this.login} showLoginPage={this.state.showLoginPage} />
              <IconButton onClick={this.openMenu}>
                <MoreVertIcon />
              </IconButton>
              <Menu open={!!this.state.anchorEl} onClose={this.handleClose} anchorEl={this.state.anchorEl}>
                <MenuItemList logoutAction={this.logout} loginAction={this.login} onClose={this.handleClose} />
              </Menu>
            </div>
          </Toolbar>
        </AppBar>
        {
          this.state.showLoginPage ? (
            <div className="login-form">
              <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={fire.auth()} />
            </div>
          ) : (null)
        }
      </div >
    );
  }
}
export default Header;