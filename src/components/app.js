import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import LinearProgress from '@material-ui/core/LinearProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import { fire } from '../base';
import Home from './main/home';
import './app.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      verified: false,
      inputCode: '',
      tries: 0,
      tomanytries: false,
      errorText: '',
      waitTime: 30000,
    };
    this.authListener = this.authListener.bind(this);
    this.verifyInvitation = this.verifyInvitation.bind(this);
    this.getError = this.getError.bind(this);
  }

  componentDidMount() {
    const verifiedStore = localStorage.getItem('verifiedinvite');
    if (verifiedStore && verifiedStore === 'true') {
      this.setState({
        verified: true,
      });
    }
    this.authListener();
  }

  getError() {
    const { errorText } = this.state;
    return errorText;
  }

  handelChange = (event) => {
    this.setState({
      inputCode: event.target.value,
    });
  };

  authListener() {
    const that = this;
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        if (!user.isAnonymous) {
          that.setState({
            verified: true,
          });
        }
        this.setState({
          user,
        });
      } else {
        fire.auth().signInAnonymously().catch((error) => {
          // console.log("ERROR sign in anonymous" + error);
        });
      }
    });
  }

  verifyInvitation() {
    const {
      tomanytries, waitTime, inputCode, tries,
    } = this.state;
    if (tomanytries) {
      return;
    }
    const storedTomanytries = JSON.parse(localStorage.getItem('tomanytries'));
    const now = new Date();
    const that = this;
    if (storedTomanytries && now - storedTomanytries < waitTime) {
      this.setState({
        tomanytries: true,
      });
      const waitTimer = setInterval(() => {
        const tryagain = Math.floor(((waitTime - (new Date() - storedTomanytries)) / 1000));
        that.setState({
          errorText: `För många försök. Försök igen om ${tryagain} sekunder`,
        });
        if (tryagain <= 0) {
          that.setState({
            errorText: '',
            tomanytries: false,
          });
          clearInterval(waitTimer);
        }
      }, 1000);
      this.setState({
        tries: 0,
      });
    }
    const xmlHttp = new XMLHttpRequest();
    if (fire.options.projectId === 'ettkilomjol-dev') {
      xmlHttp.open('GET', ` https://us-central1-ettkilomjol-dev.cloudfunctions.net/verifyInvitation?code=${inputCode}`, true);
    } else {
      xmlHttp.open('GET', ` https://us-central1-ettkilomjol-10ed1.cloudfunctions.net/verifyInvitation?code=${inputCode}`, true);
    }

    xmlHttp.onload = function verifyOnServer(e) {
      if (xmlHttp.readyState === 4) {
        if (xmlHttp.status === 200) {
          that.setState({
            verified: true,
          });
          localStorage.setItem('verifiedinvite', 'true');
          // console.log("verifed ok")
        } else {
          // console.log("verifed not ok")
          that.setState({
            tries: tries + 1,
            errorText: 'Fel kod, försök igen',
          });
          if (tries > 2) {
            localStorage.setItem('tomanytries', JSON.parse(Date.now()));
          }
        }
      }
    };
    xmlHttp.onerror = function errorResponse(e) {
      // console.log("verifed error");
      console.error(xmlHttp.statusText);
    };
    xmlHttp.send(null);
  }

  render() {
    const { user, verified, inputCode } = this.state;
    return (
      <MuiThemeProvider>
        <div>
          <div className="spinner">
            <LinearProgress classes={{ root: 'progress-root', bar: 'progress-bar' }} />
          </div>
          {user && verified ? (
            <Home />
          ) : (
            user
              && (
              <Dialog className="invitation-dialog" open aria-labelledby="form-dialog-title">
                <DialogTitle id="simple-dialog-title">Välkommen till Ett kilo mjöl</DialogTitle>
                <DialogContent className="invitation-content dialog-content">
                  <DialogContentText>
                    Ange den kod du fått i din inbjudan.
                  </DialogContentText>
                  <TextField
                    className="verify-field"
                    name="inbjudan"
                    value={inputCode}
                    onChange={this.handelChange}
                    margin="normal"
                  />
                  <DialogContentText>
                    {this.getError()}
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.verifyInvitation} color="primary" variant="contained">Verifiera</Button>
                </DialogActions>
              </Dialog>
              )
          )}
        </div>
      </MuiThemeProvider>
    );
  }
}
export default App;
