import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import EditIcon from '@material-ui/icons/EditOutlined';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import DoneIcon from '@material-ui/icons/DoneOutline';
import PropTypes from 'prop-types';

class GroceryItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      editItemName: '',
      editItemAmount: '',
      editItemUnit: '',
      errors: {},
    };
    this.editItem = this.editItem.bind(this);
    this.saveEdits = this.saveEdits.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.validateItem = this.validateItem.bind(this);
    this.toggleItem = this.toggleItem.bind(this);
  }

  handleChange = name => (event) => {
    const { errors } = this.state;
    delete errors[name];
    this.setState({
      [name]: event.target.value,
      errors,
    });
  };

  deleteItem() {
    const { groceryItem, deleteItem } = this.props;
    deleteItem(groceryItem.key);
  }

  editItem() {
    const { groceryItem } = this.props;
    this.setState({
      editMode: true,
      editItemName: groceryItem.name,
      editItemAmount: groceryItem.amount,
      editItemUnit: groceryItem.unit,
    });
  }

  validateItem(item) {
    let valid = true;
    const errors = {};
    if (!item.name) {
      errors.editItemName = 'Fyll i namn';
      valid = false;
    }
    if (!item.amount && item.unit) {
      errors.editItemAmount = 'Om enhet är anget behöver även mängd anges';
      valid = false;
    }
    this.setState({ errors });
    return valid;
  }

  toggleItem() {
    const { groceryItem, updateItem } = this.props;
    const update = {
      done: !groceryItem.done,
    };
    updateItem(update, groceryItem.key);
  }

  saveEdits() {
    const { editItemName, editItemAmount, editItemUnit } = this.state;
    const { groceryItem, updateItem } = this.props;
    const editItem = {
      name: editItemName,
      amount: editItemAmount,
      unit: editItemUnit,
    };
    if (!editItem.name) {
      delete editItem.name;
    }
    if (!editItem.amount) {
      delete editItem.amount;
    }
    if (!editItem.unit) {
      delete editItem.unit;
    }
    if (!this.validateItem(editItem)) {
      return;
    }

    if (editItem.name === groceryItem.name
            && editItem.amount === groceryItem.amount
            && editItem.unit === groceryItem.unit) {
      // console.log("skipping update. obj is the same")
    } else {
      editItem.name = editItem.name.charAt(0).toUpperCase() + editItem.name.slice(1);
      updateItem(editItem, groceryItem.key);
    }
    this.setState({
      editMode: false,
      editItemName: '',
      editItemAmount: '',
      editItemUnit: '',
      errors: {},
    });
  }

  render() {
    const {
      editItemName, editItemAmount, editItemUnit, errors, editMode,
    } = this.state;
    const { groceryItem } = this.props;
    if (editMode) {
      return (
        <ListItem className="groceryitems-editmode">
          <TextField
            className={errors.editItemAmount ? 'groceryitem-field grocertitem-edit--name row-error' : 'groceryitem-field grocertitem-edit--name'}
            label="Namn"
            name="name"
            value={editItemName || ''}
            onChange={this.handleChange('editItemName')}
            margin="normal"
            error={errors.editItemName}
            helperText={errors.editItemName}
          />
          <TextField
            className="groceryitem-field"
            label="Mängd"
            name="amount"
            error={errors.editItemAmount}
            value={editItemAmount || ''}
            onChange={this.handleChange('editItemAmount')}
            margin="normal"
            FormHelperTextProps={{ className: 'groceryitem-helpertext' }}
            helperText={errors.editItemAmount}
          />
          <TextField
            className="groceryitem-field"
            label="Enhet"
            name="unit"
            value={editItemUnit || ''}
            onChange={this.handleChange('editItemUnit')}
            margin="normal"
          />
          <IconButton onClick={this.saveEdits}>
            <DoneIcon />
          </IconButton>
        </ListItem>
      );
    }
    const item = groceryItem;
    const tmp = `${item.name}, ${item.amount || ''} ${item.unit || ''}`;
    let itemString = tmp.trim();
    if (itemString.endsWith(',')) {
      itemString = itemString.substr(0, itemString.length - 1);
    }
    return (
      <ListItem>
        <ListItemText className={groceryItem.done ? 'groceryitem-done groceryitem-text' : 'groceryitem-text'} onClick={this.toggleItem} primary={itemString} />
        <IconButton onClick={this.editItem}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={this.deleteItem}>
          <DeleteIcon />
        </IconButton>
      </ListItem>
    );
  }
}
GroceryItem.propTypes = {
  groceryItem: PropTypes.object.isRequired,
  updateItem: PropTypes.func.isRequired,
  deleteItem: PropTypes.func.isRequired,
};
export default GroceryItem;
