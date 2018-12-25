import React from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import './util.css';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function loginCall() {
  document.querySelector('.login-btn').click();
}

class MySnackbar extends React.Component {
  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    const { setSnackbar } = this.props;
    setSnackbar('');
  }

  render() {
    const { variant, action } = this.props;

    const snackbar = {
      login_required: {
        message: 'Du behöver vara inloggad för att använda denna funktion',
        actions: [
          <Button key="login" className="my_snackbar-login-btn" variant="outlined" size="small" onClick={loginCall}>
                        Logga in
          </Button>,
        ],
        duration: 6000,
      },
      fav_added: {
        message: 'Recept sparat',
        duration: 3000,
      },
      grocerylist_delete: {
        message: 'Inköpslistan borttagen',
        duration: 3000,
        actions: [
          <Button key="undo" className="my_snackbar-login-btn" color="secondary" variant="outlined" size="small" onClick={action}>
                    ångra
          </Button>,
        ],
      },
      recipe_added_grocerylist: {
        message: 'Ingredienser tillagda i inköpslista!',
        actions: [<Link key="grocerylists" to="/grocerylists">Mina inköpslistor</Link>],
        duration: 6000,
      },
    };
    const snackbarVaritant = snackbar[variant];

    return (
      <div>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          className="my_snackbar"
          open
          autoHideDuration={snackbarVaritant.duration}
          onClose={this.handleClose}
          message={snackbarVaritant.message}
          action={snackbarVaritant.actions}
        />
      </div>
    );
  }
}
MySnackbar.propTypes = {
  setSnackbar: PropTypes.func.isRequired,
  action: PropTypes.string,
  variant: PropTypes.string.isRequired,
};
export default MySnackbar;
