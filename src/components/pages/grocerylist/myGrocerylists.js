import React, { Component } from 'react';
import './grocerylist.css';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import GrocerylistDetails from './grocerylistDetails';
import GrocerylistCard from './grocerylistCard';
import { fire } from '../../../base';
import Utils from '../../../util';

class MyGrocerylists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentList: null,
      showNewListDialog: false,
      newName: '',
      errorText: '',
      listToDelete: null,
    };
    this.setCurrentList = this.setCurrentList.bind(this);
    this.openDialog = this.openDialog.bind(this);
    this.createList = this.createList.bind(this);
    this.validateName = this.validateName.bind(this);
    this.deleteList = this.deleteList.bind(this);
    this.resetCurrentList = this.resetCurrentList.bind(this);
    this.undoDeletion = this.undoDeletion.bind(this);
  }

  getError() {
    const { errorText } = this.state;
    return errorText;
  }


  setCurrentList(list) {
    this.setState({
      currentList: list,
    });
  }

  handleChange = name => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };

  closeDialog = () => {
    this.setState({
      showNewListDialog: false,
      newName: '',
      errorText: '',
    });
  };

  deleteList(list) {
    this.setState({
      listToDelete: list,
    });
    const deletetion = {};
    deletetion[list.name] = null;
    const that = this;
    fire.database().ref(`users/${fire.auth().currentUser.uid}/grocerylists`).update(deletetion, (error) => {
      if (error) {
        // console.log('Error has occured during saving process');
      } else {
        that.props.setSnackbar('grocerylist_delete', that.undoDeletion);
      }
    });
  }

  resetCurrentList() {
    this.setState({
      currentList: null,
    });
  }

  openDialog() {
    const { setSnackbar, grocerylists } = this.props;
    if (fire.auth().currentUser.isAnonymous) {
      setSnackbar('login_required');
      return;
    }
    let newName = `Att handla ${Utils.getDayAndMonthString(new Date())}`;
    const nameIsTaken = grocerylists.some(x => x.name === newName);
    if (nameIsTaken) {
      newName = '';
    }

    this.setState({
      showNewListDialog: true,
      newName,
    });
  }


  validateName(name) {
    const { grocerylists } = this.props;
    if (name.trim().length < 1) {
      this.setState({
        errorText: 'Namnet måste vara minst 1 tecken',
      });
      return false;
    }
    if (name.trim().length > 64) {
      this.setState({
        errorText: 'Namnet får max vara 64 tecken',
      });
      return false;
    }
    const nameIsTaken = grocerylists.some(x => x.name === name);
    if (nameIsTaken) {
      this.setState({
        errorText: 'Du har redan en inköpslista med det namnet',
      });
      return false;
    }
    return true;
  }

  createList() {
    const { newName } = this.state;
    const grocerylist = {
      name: newName,
      created: Date.now(),
    };
    if (!this.validateName(grocerylist.name)) {
      return;
    }

    const that = this;
    fire.database().ref(`users/${fire.auth().currentUser.uid}/grocerylists/${grocerylist.name}`).set(grocerylist, (error) => {
      if (error) {
        that.setState({
          errorText: `Error: ${error}`,
        });
      } else {
        that.setState({
          showNewListDialog: false,
          currentList: grocerylist,
          errorText: '',
        });
      }
    });
  }

  undoDeletion() {
    const { listToDelete } = this.state;
    fire.database().ref(`users/${fire.auth().currentUser.uid}/grocerylists/${listToDelete.name}`).set(listToDelete);
  }

  render() {
    const {
      currentList, showNewListDialog, helptext, newName,
    } = this.state;
    const {
      grocerylists, foods, units, recipes, closeDialog, setSnackbar,
    } = this.props;
    if (currentList) {
      const activeGrocerylist = grocerylists.find(x => x.name === currentList.name);
      return (
        <div className="container my_recipes-container">
          <div className="row">
            <GrocerylistDetails returnFunc={this.resetCurrentList} grocerylist={activeGrocerylist} foods={foods} units={units} recipes={recipes} />
          </div>
        </div>
      );
    }
    return (
      <div className="container my_recipes-container">
        <Grid item container xs={12} className="list-item">
          <Grid item xs={12}>
            <h2 className="page-title">Mina inköpslistor</h2>
          </Grid>
          <Grid item xs={12}>
            <Button onClick={this.openDialog} color="primary" variant="contained">Ny lista</Button>
          </Grid>
        </Grid>
        {grocerylists.map((grocerylist, index) => (
          <GrocerylistCard
            key={grocerylist.name}
            setCurrentList={this.setCurrentList}
            grocerylist={grocerylist}
            transitionDelay={index}
            setSnackbar={setSnackbar}
            deleteList={this.deleteList}
          />
        ))}

        <Dialog
          open={showNewListDialog}
          onClose={closeDialog}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="simple-dialog-title">Ny inköpslista</DialogTitle>
          <DialogContent className="dialog-content">
            <DialogContentText>
              {helptext}
            </DialogContentText>
            <TextField
              className="contact-field"
              label="Namn"
              name="name"
              value={newName}
              onChange={this.handleChange('newName')}
              margin="normal"
            />
            <DialogContentText>
              {this.getError()}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeDialog} color="secondary" variant="contained">stäng</Button>
            <Button onClick={this.createList} color="primary" variant="contained">skapa</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
MyGrocerylists.propTypes = {
  closeDialog: PropTypes.func,
  grocerylists: PropTypes.array.isRequired,
  foods: PropTypes.array.isRequired,
  recipes: PropTypes.array.isRequired,
  units: PropTypes.any.isRequired,
  setSnackbar: PropTypes.func.isRequired,
};
export default MyGrocerylists;
