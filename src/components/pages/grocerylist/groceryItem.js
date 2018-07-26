import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import EditIcon from '@material-ui/icons/EditOutlined';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import DoneIcon from '@material-ui/icons/DoneOutline';



class GroceryItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editMode: false,
            editItemName: '',
            editItemAmount: '',
            editItemUnit: '',
            errors: {}
        };
        this.editItem = this.editItem.bind(this);
        this.saveEdits = this.saveEdits.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.validateItem = this.validateItem.bind(this);
        this.toggleItem = this.toggleItem.bind(this);
    }
    deleteItem() {
        this.props.deleteItem(this.props.groceryItem.key);
    }

    editItem() {
        let editItem = this.props.groceryItem;
        this.setState({
            editMode: true,
            editItemName: editItem.name,
            editItemAmount: editItem.amount,
            editItemUnit: editItem.unit,
        });
    }
    handleChange = name => event => {
        let errors = this.state.errors;
        delete errors[name];
        this.setState({
            [name]: event.target.value,
            errors: errors
        });
    };
    validateItem(item) {
        let valid = true;
        let errors = {};
        if (!item.name) {
            errors['editItemName'] = 'Fyll i namn'
            valid = false;
        }
        if (!item.amount && item.unit) {
            errors['editItemAmount'] = 'Om enhet är anget behöver även mängd anges'
            valid = false;
        }
        this.setState({ errors: errors });
        return valid;
    }
    toggleItem() {
        let item = {
            done: !this.props.groceryItem.done,
        }

        this.props.updateItem(item, this.props.groceryItem.key);
    }
    saveEdits() {
        let editItem = {
            name: this.state.editItemName,
            amount: this.state.editItemAmount,
            unit: this.state.editItemUnit,
        }
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
        if (editItem.name === this.props.groceryItem.name
            && editItem.amount === this.props.groceryItem.amount
            && editItem.unit === this.props.groceryItem.unit) {
            console.log("skipping update. obj is the same")
        } else {
            editItem.name = editItem.name.charAt(0).toUpperCase() + editItem.name.slice(1);
            this.props.updateItem(editItem, this.props.groceryItem.key);
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

        if (this.state.editMode) {
            return (<ListItem className="groceryitems-editmode">
                <TextField className={this.state.errors['editItemAmount'] ? 'groceryitem-field grocertitem-edit--name row-error' : 'groceryitem-field grocertitem-edit--name'}
                    label="Namn"
                    name="name"
                    value={this.state.editItemName || ""}
                    onChange={this.handleChange('editItemName')}
                    margin="normal"
                    error={this.state.errors['editItemName']}
                    helperText={this.state.errors['editItemName']}
                />
                <TextField className="groceryitem-field"
                    label="Mängd"
                    name="amount"
                    error={this.state.errors['editItemAmount']}
                    value={this.state.editItemAmount || ""}
                    onChange={this.handleChange('editItemAmount')}
                    margin="normal"
                    FormHelperTextProps={{className: 'groceryitem-helpertext'}}
                    helperText={this.state.errors['editItemAmount']}
                />
                <TextField className="groceryitem-field"
                    label="Enhet"
                    name="unit"
                    value={this.state.editItemUnit || ""}
                    onChange={this.handleChange('editItemUnit')}
                    margin="normal"
                />
                <IconButton onClick={this.saveEdits}>
                    <DoneIcon />
                </IconButton>
            </ListItem>);
        } else {
            let item = this.props.groceryItem;
            let tmp = item.name + ", " + (item.amount || "") + " " + (item.unit || "");
            let itemString = tmp.trim();
            if (itemString.endsWith(",")) {
                itemString = itemString.substr(0, itemString.length - 1);
            }
            return (<ListItem>

                <ListItemText className={this.props.groceryItem.done ? 'groceryitem-done groceryitem-text' : 'groceryitem-text'} onClick={this.toggleItem} primary={itemString} />
                <IconButton onClick={this.editItem}>
                    <EditIcon />
                </IconButton>
                <IconButton onClick={this.deleteItem}>
                    <DeleteIcon />
                </IconButton>
            </ListItem>);
        }

    }
}
export default GroceryItem;
