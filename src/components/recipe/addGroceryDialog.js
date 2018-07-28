import React, { Component } from 'react';
import { fire } from '../../base';
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
    let newName = 'Att handla ' + Utils.getDayAndMonthString(new Date());
    if (this.props.grocerylists) {
      for (let i = 0; i < this.props.grocerylists.length; i++) {
        if (newName === this.props.grocerylists[i].name) {
          newName = "";
        }
      }
    }
    this.setState({
      newName: newName,
    })
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (!nextProps.open && !this.props.open) {
      return false;
    }
    return true;
  }
  showNewGrocerylistInput() {
    this.setState({
      newGroceryList: true,
    });
  }
  getError() {
    return this.state.errorText;
  }
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };
  addItemsToGroceryList(grocerylist) {
    let ref = fire.database().ref('users/' + fire.auth().currentUser.uid + '/grocerylists/' + grocerylist.name);
    let updates = {};
    let mergedIngredient;
    for (let i = 0; i < this.props.itemsToAdd.length; i++) {
      let mergeKey= "";
      let itemToAdd = this.props.itemsToAdd[i];
      for(let j = 0; j < grocerylist.items.length; j++){
        if(grocerylist.items[j].name === itemToAdd.name && Utils.ingredientsCanMerge(grocerylist.items[j], itemToAdd, this.props.units)){
          let tmp = Utils.mergeIngredients(grocerylist.items[j], itemToAdd, this.props.units);
          mergedIngredient = {
            name: tmp.name,
            unit: tmp.unit || null,
            amount: tmp.amount || null
          }
          mergeKey = grocerylist.items[j].key;
        }
      }
      if(mergedIngredient){
        updates['/items/' +mergeKey ] = mergedIngredient;

      }else{
        updates['/items/' + ref.push().key] = this.props.itemsToAdd[i];
      }

    }
    if (this.props.recipeToAdd) {
      updates['/recipes/' + Utils.encodeSource(this.props.recipeToAdd.source)] = true;
    }
    let that = this;
    ref.update(updates, function (error) {
      if (error) {
        //console.log('Error has occured during saving process');
      }
      else {
        that.props.setSnackbar('recipe_added_grocerylist');
      }
    });
    that.closeDialog();
  }
  closeDialog() {
    this.setState({
      newName: '',
      newGroceryList: false,
      errorText: '',
    });
    this.props.onClose();
  }

  validateName(name) {
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
    for (let i = 0; i < this.props.grocerylists.length; i++) {
      if (name === this.props.grocerylists[i].name) {
        this.setState({
          errorText: 'Du har redan en inköpslista med det namnet',
        });
        return false;
      }
    }
    return true;
  }
  saveToNewGrocerylist() {
    let grocerylist = {
      name: this.state.newName,
      created: Date.now(),
      items: {},
      recipes: {}
    };
    if (!this.validateName(grocerylist.name)) {
      return;
    }
    let ref = fire.database().ref('users/' + fire.auth().currentUser.uid + '/grocerylists/' + grocerylist.name);
    for (let i = 0; i < this.props.itemsToAdd.length; i++) {
      grocerylist.items[ref.push().key] = this.props.itemsToAdd[i];
    }
    if (this.props.recipeToAdd) {
      grocerylist.recipes[Utils.encodeSource(this.props.recipeToAdd.source)] = true;
    }
    let that = this;
    ref.set(grocerylist, function (error) {
      if (error) {
        //console.log('Error has occured during saving process');
        that.setState({
          errorText: 'Error: ' + error,
        });
      }
      else {
        that.props.setSnackbar('recipe_added_grocerylist');
      }
    })
    that.closeDialog();
    //kolla det här med render som körs för ofta på visa componenter i recipe när snackbaren visas/göms och när jag öppnar dialogen för grocerylists.
    //använd shouödcomponentRerender() för de ska ju inte renderas om props inte ändrats t.ex. kanske till och med inte behöver renderas om bara några propsändrats?
  }

  render() {
    function GrocerylistComponent(props) {
      return (<List>
        {props.grocerylists.map((grocerylist, index) =>
          <ListItem className="grocerydialog-listitem" key={grocerylist.name} onClick={() => { props.handleClick(grocerylist) }} disableGutters={true}>
            <Avatar className="grocerylist-icon--primarycolor">
              <AssignmentIcon />
            </Avatar>
            <ListItemText primary={grocerylist.name} secondary={Utils.millisecToDateString(grocerylist.created)} />
          </ListItem>
        )}
      </List>);

    }
    if (this.props.grocerylists && this.props.grocerylists.length > 0) {

      return (
        <Dialog className="grocerylist-dialog" open={this.props.open} aria-labelledby="form-dialog-title" onClose={this.closeDialog}>
          <DialogTitle id="simple-dialog-title">Välj inköpslista</DialogTitle>
          <DialogContent className="recipecard-grocerylist-content dialog-content">
            <DialogContentText>
            </DialogContentText>
            <GrocerylistComponent grocerylists={this.props.grocerylists} handleClick={this.addItemsToGroceryList} />
            {this.state.newGroceryList &&
              <TextField className="contact-field grocerylist-dialog--padding"
                label="Namn"
                name="name"
                value={this.state.newName}
                onChange={this.handleChange('newName')}
                margin="normal"
              />
            }
            <DialogContentText>
              {this.getError()}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            {this.state.newGroceryList ?
              (<Button onClick={this.saveToNewGrocerylist} color="primary" variant="contained">Skapa</Button>
              )
              : (<Button onClick={this.showNewGrocerylistInput} color="primary" variant="contained">Ny lista</Button>
              )
            }
          </DialogActions>
        </Dialog >
      );
    } else {
      return (
        <Dialog className="grocerylist-dialog" open={this.props.open} aria-labelledby="form-dialog-title" onClose={this.closeDialog}>
          <DialogTitle id="simple-dialog-title">Ny inköpslista</DialogTitle>
          <DialogContent className="recipecard-grocerylist-content dialog-content">
            <DialogContentText>
            </DialogContentText>
            <TextField className="contact-field grocerylist-dialog--padding"
              label="Namn"
              name="name"
              value={this.state.newName}
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
        </Dialog >
      );
    }
  }
}
export default AddGroceryDialog;