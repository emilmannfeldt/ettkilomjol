import React, { Component } from 'react';
import Home from './main/home';
import { fire } from '../base';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import LinearProgress from '@material-ui/core/LinearProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import './app.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      verified: false,
      inputCode: '',
      invitationCode: '',
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
    let verifiedStore = localStorage.getItem('verifiedinvite');
    if (verifiedStore && verifiedStore === "true") {
      this.setState({
        verified: true,
      })
    }
    console.log("app didmount")
    this.authListener();
  }

  authListener() {
    let that = this;
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log("app login");
        if (!user.isAnonymous) {
          that.setState({
            verified: true,
          });
        }
        this.setState({
          user: user,
        })

      } else {
        fire.auth().signInAnonymously().catch(function (error) {
          console.log("ERROR sign in anonymous" + error);
        });
        console.log("app logout");
      }
    });
  }
  verifyInvitation() {
    if (this.state.tomanytries) {
      return;
    }
    let tomanytries = JSON.parse(localStorage.getItem('tomanytries'));
    let now = new Date();
    let that = this;
    if (tomanytries && now - tomanytries < this.state.waitTime) {
      this.setState({
        tomanytries: true,
      });
      var waitTimer = setInterval(function () {
        let now = new Date();
        let tryagain = Math.floor(((that.state.waitTime - (now - tomanytries)) / 1000));
        that.setState({
          errorText: 'För många försök. Försök igen om ' + tryagain + " sekunder",
        })
        if (tryagain <= 0) {
          that.setState({
            errorText: '',
            tomanytries: false,
          })
          clearInterval(waitTimer);
        }
      }, 1000);
      this.setState({
        tries: 0,
      })

    }
    var xmlHttp = new XMLHttpRequest();
    if (fire.options.projectId === "ettkilomjol-dev") {
      xmlHttp.open("GET", ' https://us-central1-ettkilomjol-dev.cloudfunctions.net/verifyInvitation?code=' + this.state.inputCode, true);
    } else {
      xmlHttp.open("GET", ' https://us-central1-ettkilomjol-10ed1.cloudfunctions.net/verifyInvitation?code=' + this.state.inputCode, true);
    }

    xmlHttp.onload = function (e) {
      if (xmlHttp.readyState === 4) {
        if (xmlHttp.status === 200) {
          that.setState({
            verified: true,
          });
          localStorage.setItem('verifiedinvite', 'true');
          console.log("verifed ok")
        } else {
          console.log("verifed not ok")
          that.setState({
            tries: that.state.tries + 1,
            errorText: 'Fel kod, försök igen'
          })
          if (that.state.tries > 2) {
            localStorage.setItem('tomanytries', JSON.parse(Date.now()));
          }
        }
      }
    };
    xmlHttp.onerror = function (e) {
      console.log("verifed error");
      console.error(xmlHttp.statusText);
    };
    xmlHttp.send(null);
  }

  handelChange = event => {
    this.setState({
      inputCode: event.target.value,
    })
  };
  getError() {
    return this.state.errorText;
  }

  render() {
    return (
      <MuiThemeProvider>
        <div>
          <div className='spinner'>
            <LinearProgress classes={{root:'progress-root', bar:'progress-bar'}}/>
          </div>
          {this.state.user && this.state.verified ? (
            <Home />
          ) : (
              this.state.user &&
              <Dialog className="invitation-dialog" open={true} aria-labelledby="form-dialog-title">
                <DialogTitle id="simple-dialog-title">Välkommen till Ett kilo mjöl</DialogTitle>
                <DialogContent className="invitation-content dialog-content">
                  <DialogContentText>
                    Ange den kod du fått i din inbjudan.
                </DialogContentText>
                  <TextField className="verify-field"
                    name="inbjudan"
                    value={this.state.inputCode}
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
            )}
        </div>
      </MuiThemeProvider>
    );
  }
}
export default App;