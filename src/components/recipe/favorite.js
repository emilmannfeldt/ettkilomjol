import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import PropTypes from 'prop-types';
import { fire } from '../../base';
import { encodeSource } from '../../util';

MyFavoriteIcon.propTypes = {
  isFav: PropTypes.bool.isRequired,
};
function MyFavoriteIcon(props) {
  const { isFav } = props;
  if (isFav) {
    return (<FavoriteIcon />);
  }
  return (<FavoriteBorderIcon />);
}

class Favorite extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.addToFav = this.addToFav.bind(this);
    this.removeFromFav = this.removeFromFav.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { source, isFav } = this.props;
    if (nextProps.source !== source) {
      return true;
    }
    if (nextProps.isFav !== isFav) {
      return true;
    }
    return false;
  }

  handleClick() {
    const { setSnackbar, isFav } = this.props;
    if (fire.auth().currentUser.isAnonymous) {
      setSnackbar('login_required');
    } else if (isFav) {
      this.removeFromFav();
    } else {
      this.addToFav();
    }
  }

  addToFav() {
    const { setSnackbar, source } = this.props;
    if (source.length > 1) {
      const fav = {};
      const encodedSource = encodeSource(source);
      fav[encodedSource] = true;
      fire.database().ref(`users/${fire.auth().currentUser.uid}/fav`).update(fav);
      setSnackbar('fav_added');
    }
  }

  removeFromFav() {
    const { source } = this.props;
    const fav = {};
    const encodedSource = encodeSource(source);
    fav[encodedSource] = null;
    fire.database().ref(`users/${fire.auth().currentUser.uid}/fav`).update(fav);
  }


  render() {
    const { isFav } = this.props;
    return (
      <div>
        <IconButton
          key="favorite"
          aria-label="Favorite"
          color="inherit"
          className="recipecard-save-btn"
          onClick={this.handleClick}
        >
          <MyFavoriteIcon isFav={isFav} />
        </IconButton>
      </div>
    );
  }
}
Favorite.propTypes = {
  isFav: PropTypes.bool.isRequired,
  source: PropTypes.string.isRequired,
  setSnackbar: PropTypes.func.isRequired,
};
export default Favorite;
