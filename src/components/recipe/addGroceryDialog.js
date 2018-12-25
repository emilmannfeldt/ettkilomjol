import React, { Component } from 'react';
import './recipe.css';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import AssignmentIcon from '@material-ui/icons/AssignmentOutlined';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import PropTypes from 'prop-types';
import { fire } from '../../base';
import Utils from '../../util';

class AddGroceryDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newGroceryList: false,
      newName: '',
      errorText: '',
    };

    this.addItemsToGroceryList = this.addItemsToGroceryList.bind(this);
    this.showNewGrocerylistInput = this.showNewGrocerylistInput.bind(this);
    this.getError = this.getError.bind(this);
    this.validateName = this.validateName.bind(this);
    this.saveToNewGrocerylist = this.saveToNewGrocerylist.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
  }

  componentDidMount() {
    const { grocerylists } = this.props;
    let newName = `Att handla ${Utils.getDayAndMonthString(new Date())}`;
    const nameIsTaken = grocerylists && grocerylists.some(x => x.name === newName);
    if (nameIsTaken) {
      newName = '';
    }
    this.setState({
      newName,
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { open } = this.props;
    if (!nextProps.open && !open) {
      return false;
    }
    return true;
  }

  getError() {
    const { errorText } = this.state;
    return errorText;
  }

  handleChange = name => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };

  showNewGrocerylistInput() {
    this.setState({
      newGroceryList: true,
    });
  }


  addItemsToGroceryList(grocerylist) {
    const {
      itemsToAdd, units, recipeToAdd, setSnackbar,
    } = this.props;
    const ref = fire.database().ref(`users/${fire.auth().currentUser.uid}/grocerylists/${grocerylist.name}`);


    const updates = itemsToAdd.reduce((result, item) => {
      let mergeKey = '';
      let mergedIngredient = {};
      const next = result;
      if (grocerylist.items) {
        const mergeableItems = grocerylist.items.filter(x => x.name === item.name && Utils.ingredientsCanMerge(x, item, units));
        if (mergeableItems.length > 0) {
          const mergingItem = mergeableItems[mergeableItems.length - 1];
          const tmp = Utils.mergeIngredients(mergingItem, item, units);
          mergedIngredient = {
            name: tmp.name,
            unit: tmp.unit || null,
            amount: tmp.amount || null,
          };
          mergeKey = mergingItem.key;
        }
      }
      if (mergeKey) {
        next[`/items/${mergeKey}`] = mergedIngredient;
      } else {
        next[`/items/${ref.push().key}`] = item;
      }
      return next;
    },
    {});
    if (recipeToAdd) {
      updates[`/recipes/${Utils.encodeSource(recipeToAdd.source)}`] = true;
    }
    ref.update(updates, (error) => {
      if (error) {
        // console.log('Error has occured during saving process');
      } else {
        setSnackbar('recipe_added_grocerylist');
      }
    });
    this.closeDialog();
  }

  closeDialog() {
    const { onClose } = this.props;
    this.setState({
      newName: '',
      newGroceryList: false,
      errorText: '',
    });
    onClose();
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
    const exists = grocerylists.some(x => x.name === name);
    if (exists) {
      this.setState({
        errorText: 'Du har redan en inköpslista med det namnet',
      });
      return false;
    }
    return true;
  }

  saveToNewGrocerylist() {
    const { newName } = this.state;
    const {
      itemsToAdd, recipeToAdd, setSnackbar,
    } = this.props;
    const grocerylist = {
      name: newName,
      created: Date.now(),
      items: {},
      recipes: {},
    };
    if (!this.validateName(grocerylist.name)) {
      return;
    }
    const ref = fire.database().ref(`users/${fire.auth().currentUser.uid}/grocerylists/${grocerylist.name}`);

    grocerylist.items = itemsToAdd.reduce((obj_, item) => {
      const obj = obj_;
      obj[ref.push().key] = item;
      return obj;
    }, {});

    if (recipeToAdd) {
      grocerylist.recipes[Utils.encodeSource(recipeToAdd.source)] = true;
    }
    const that = this;
    ref.set(grocerylist, (error) => {
      if (error) {
        that.setState({
          errorText: `Error: ${error}`,
        });
      } else {
        setSnackbar('recipe_added_grocerylist');
      }
    });
    this.closeDialog();
  }

  render() {
    const { newName, newGroceryList } = this.state;
    const {
      grocerylists, open,
    } = this.props;
    function GrocerylistComponent(props) {
      return (
        <List>
          {props.grocerylists.map((grocerylist, index) => (
            <ListItem className="grocerydialog-listitem" key={grocerylist.name} onClick={() => { props.handleClick(grocerylist); }} disableGutters>
              <Avatar className="grocerylist-icon--primarycolor">
                <AssignmentIcon />
              </Avatar>
              <ListItemText primary={grocerylist.name} secondary={Utils.millisecToDateString(grocerylist.created)} />
            </ListItem>
          ))}
        </List>
      );
    }
    if (grocerylists && grocerylists.length > 0) {
      return (
        <Dialog className="grocerylist-dialog" open={open} aria-labelledby="form-dialog-title" onClose={this.closeDialog}>
          <DialogTitle id="simple-dialog-title">Välj inköpslista</DialogTitle>
          <DialogContent className="recipecard-grocerylist-content dialog-content">
            <DialogContentText />
            <GrocerylistComponent grocerylists={grocerylists} handleClick={this.addItemsToGroceryList} />
            {newGroceryList
              && (
              <TextField
                className="contact-field grocerylist-dialog--padding"
                label="Namn"
                name="name"
                value={newName}
                onChange={this.handleChange('newName')}
                margin="normal"
              />
              )
            }
            <DialogContentText>
              {this.getError()}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            {newGroceryList
              ? (<Button onClick={this.saveToNewGrocerylist} color="primary" variant="contained">Skapa</Button>
              )
              : (<Button onClick={this.showNewGrocerylistInput} color="primary" variant="contained">Ny lista</Button>
              )
            }
          </DialogActions>
        </Dialog>
      );
    }
    return (
      <Dialog className="grocerylist-dialog" open={open} aria-labelledby="form-dialog-title" onClose={this.closeDialog}>
        <DialogTitle id="simple-dialog-title">Ny inköpslista</DialogTitle>
        <DialogContent className="recipecard-grocerylist-content dialog-content">
          <DialogContentText />
          <TextField
            className="contact-field grocerylist-dialog--padding"
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
          <Button onClick={this.saveToNewGrocerylist} color="primary" variant="contained">Spara</Button>
        </DialogActions>
      </Dialog>
    );
  }
}
AddGroceryDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  grocerylists: PropTypes.array,
  itemsToAdd: PropTypes.array,
  units: PropTypes.any.isRequired,
  setSnackbar: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  recipeToAdd: PropTypes.object,
};
export default AddGroceryDialog;
