import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import './favorite.css';
import { fire } from '../../../../base';

class FavSnackbar extends React.Component {

    render() {
        let message = "";
        let duration = 60000;
        let actions = [];
        switch (this.props.variant) {
            case 'login_required':
                message = "Du behöver vara inloggad för att spara recept";
                actions = [<Button key="login" className="fav-snackbar-login-btn" variant="outlined" size="small" onClick={this.props.onLogin}>
                    Logga in
                </Button>,
                <IconButton
                    key="close"
                    aria-label="Close"
                    color="inherit"
                    className="close-icon"
                    onClick={this.props.onClose}
                >
                    <CloseIcon />
                </IconButton>
                ];
                break;
            case 'fav_added':
                message = "Recept sparat!";
                duration = 3000;
                break;
            default:
                break;
        }
        return (
            <div>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    className="fav-snackbar"
                    open={this.props.variant.length > 0}
                    autoHideDuration={duration}
                    onClose={this.props.onClose}
                    message={message}
                    action={actions}
                />
            </div>
        );
    }
}
class Favorite extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            snackbarType: '',
        };
        this.handleClick = this.handleClick.bind(this);
        this.resetSnackbar = this.resetSnackbar.bind(this);
        this.addToFav = this.addToFav.bind(this);
        this.removeFromFav = this.removeFromFav.bind(this);
    }
    handleClick() {
        if (fire.auth().currentUser.isAnonymous) {
            this.setState({
                snackbarType: 'login_required'
            });
        } else {
            if (this.props.isFav) {
                this.removeFromFav();
            } else {
                this.addToFav();
            }
        }
        //och visa en loginknapp. (när man loggat in så vill jag om möjligt spara receptet man försökte spara, extra bra ifall receptlistan försvinner)
    }
    addToFav() {
        let fav = {};
        let encodedSource = this.encodeSource(this.props.source);
        fav[encodedSource] = true;
        fire.database().ref('users/' + fire.auth().currentUser.uid + '/fav').update(fav);
        this.setState({
            snackbarType: 'fav_added'
        });
    }
    removeFromFav() {
        console.log("remove fav");
        let fav = {};
        let encodedSource = this.encodeSource(this.props.source);
        fav[encodedSource] = null;
        fire.database().ref('users/' + fire.auth().currentUser.uid + '/fav').update(fav);
    }
    resetSnackbar() {
        this.setState({
            snackbarType: ''
        });
    }
    encodeSource(source) {
        return source.replace(/\./g, ",").replace(/\//g, "+");
    }
    loginCall(){
        document.querySelector('.login-btn').click();
    }
    render() {
        const { classes } = this.props;
        function MyFavoriteIcon(props) {
            if (props.isFav) {
                return (<FavoriteIcon />);
            } else {
                return (<FavoriteBorderIcon />);
            }
        }
        return (
            <div>
                <IconButton
                    key="favorite"
                    aria-label="Favorite"
                    color="secondary"
                    className="recipecard-save-btn"
                    onClick={this.handleClick}
                >
                    <MyFavoriteIcon isFav={this.props.isFav} />
                </IconButton>,
                <FavSnackbar variant={this.state.snackbarType} onClose={this.resetSnackbar} onLogin={this.loginCall}/>
            </div>
        );
    }
}
export default Favorite;