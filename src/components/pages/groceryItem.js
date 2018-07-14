import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import DoneIcon from '@material-ui/icons/Done';



class GroceryItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editMode: false,
            editItemName: '',
            editItemAmount: '',
            editItemUnit: '',
            errorText: ''
        };
        this.editItem = this.editItem.bind(this);
        this.saveEdits = this.saveEdits.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.validateItem = this.validateItem.bind(this);
        this.getError = this.getError.bind(this);
        this.toggleItem = this.toggleItem.bind(this);
    }
    deleteItem() {
        this.props.deleteItem(this.props.groceryItem.key);
    }
    getError() {
        return this.state.errorText;
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
        this.setState({
            [name]: event.target.value,
        });
    };
    validateItem(item) {
        if (!item.name) {
            this.setState({
                errorText: 'Namn saknas',
            });
            return false;
        }
        if (!item.amount && item.unit) {
            this.setState({
                errorText: 'Mängd måste anges om enhet angets',
            });
            return false;
        }
        return true;
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
            errorText: '',
        });
    }
    render() {

        if (this.state.editMode) {
            return (<ListItem>
                <TextField className="contact-field grocertitem-edit--name"
                    label="Namn"
                    name="name"
                    value={this.state.editItemName || ""}
                    onChange={this.handleChange('editItemName')}
                    margin="normal"
                />
                <TextField className="contact-field"
                    label="Antal"
                    name="amount"
                    value={this.state.editItemAmount || ""}
                    onChange={this.handleChange('editItemAmount')}
                    margin="normal"
                />
                <TextField className="contact-field"
                    label="Enhet"
                    name="unit"
                    value={this.state.editItemUnit || ""}
                    onChange={this.handleChange('editItemUnit')}
                    margin="normal"
                />
                {this.getError()}
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
