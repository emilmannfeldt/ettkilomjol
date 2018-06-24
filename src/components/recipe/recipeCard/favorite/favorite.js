import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import './favorite.css';
import { fire } from '../../../../base';

class Favorite extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.addToFav = this.addToFav.bind(this);
        this.removeFromFav = this.removeFromFav.bind(this);
    }
    handleClick() {
        if (fire.auth().currentUser.isAnonymous) {
            this.props.setSnackbar('login_required');
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
        if (this.props.source.length > 1) {
            let fav = {};
            let encodedSource = this.encodeSource(this.props.source);
            fav[encodedSource] = true;
            fire.database().ref('users/' + fire.auth().currentUser.uid + '/fav').update(fav);
            this.props.setSnackbar('fav_added');
        }
    }
    removeFromFav() {
        console.log("remove fav");
        let fav = {};
        let encodedSource = this.encodeSource(this.props.source);
        fav[encodedSource] = null;
        fire.database().ref('users/' + fire.auth().currentUser.uid + '/fav').update(fav);
    }
    encodeSource(source) {
        return source.replace(/\./g, ",").replace(/\//g, "+");
    }
    render() {
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
                </IconButton>
            </div>
        );
    }
}
export default Favorite;