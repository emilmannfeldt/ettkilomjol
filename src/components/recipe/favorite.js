import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { fire } from '../../base';
import { encodeSource } from '../../util';

class Favorite extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.addToFav = this.addToFav.bind(this);
        this.removeFromFav = this.removeFromFav.bind(this);
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.source !== this.props.source) {
            return true;
        }
        if (nextProps.isFav !== this.props.isFav) {
            return true;
        }
        return false;
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
    }
    addToFav() {
        if (this.props.source.length > 1) {
            let fav = {};
            let encodedSource = encodeSource(this.props.source);
            fav[encodedSource] = true;
            fire.database().ref('users/' + fire.auth().currentUser.uid + '/fav').update(fav);
            this.props.setSnackbar('fav_added');
        }
    }
    removeFromFav() {
        //console.log("remove fav");
        let fav = {};
        let encodedSource = encodeSource(this.props.source);
        fav[encodedSource] = null;
        fire.database().ref('users/' + fire.auth().currentUser.uid + '/fav').update(fav);
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
                    color="inherit"
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