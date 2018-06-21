import React from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import './mySnackbar.css';
class MySnackbar extends React.Component {
    constructor(props) {
        super(props);
        this.handleClose = this.handleClose.bind(this);

    }
    loginCall(){
        document.querySelector('.login-btn').click();
    }

    handleClose(){
        this.props.setSnackbar('');
    }

    render() {
        let message = "";
        let duration = 8000;
        let actions = [];
        switch (this.props.variant) {
            case 'login_required':
                message = "Du behöver vara inloggad för att spara recept";
                actions = [<Button key="login" className="my_snackbar-login-btn" variant="outlined" size="small" onClick={this.props.onLogin}>
                    Logga in
                </Button>,
                <IconButton
                    key="close"
                    aria-label="Close"
                    color="inherit"
                    className="close-icon"
                    onClick={this.handleClose}
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
                    className="my_snackbar"
                    open={this.props.variant.length > 0}
                    autoHideDuration={duration}
                    onClose={this.handleClose}
                    message={message}
                    action={actions}
                />
            </div>
        );
    }
}
export default MySnackbar;