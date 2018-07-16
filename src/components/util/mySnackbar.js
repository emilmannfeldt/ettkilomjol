import React from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import './util.css';
import { Link } from 'react-router-dom';

class MySnackbar extends React.Component {
    constructor(props) {
        super(props);
        this.handleClose = this.handleClose.bind(this);

    }
    loginCall() {
        document.querySelector('.login-btn').click();
    }

    handleClose() {
        this.props.setSnackbar('');
    }

    render() {
        let message = "";
        let duration = 6000;
        let actions = [];
        switch (this.props.variant) {
            case 'login_required':
                message = "Du behöver vara inloggad för att använda denna funktion";
                actions = [<Button key="login" className="my_snackbar-login-btn" variant="outlined" size="small" onClick={this.loginCall}>
                    Logga in
                </Button>
                ];
                break;
            case 'fav_added':
                message = "Recept sparat!";
                duration = 3000;
                break;
            case 'grocerylist_delete':
                message = "Inköpslistan borttagen";
                duration = 3000;
                actions = [<Button key="undo" className="my_snackbar-login-btn" color="secondary" variant="outlined" size="small" onClick={this.props.action}>
                    ångra
                </Button>
                ];
                break;
            case 'recipe_added_grocerylist':
                message = "Ingredienser tillagda i inköpslista!";
                actions = [<Link key="grocerylists" to={'/grocerylists'}>Mina inköpslistor</Link>];
                duration = 6000;
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
                    open={true}
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