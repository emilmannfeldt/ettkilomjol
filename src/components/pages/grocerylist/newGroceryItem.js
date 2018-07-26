import React, { Component } from 'react';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import AutoComplete from 'material-ui/AutoComplete';

class NewGroceryItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            amount: '',
            unit: '',
            unitFullNames: [],
            unitNames: [],
            errors: {},
        };
        this.addItem = this.addItem.bind(this);
        this.getFoodSuggestions = this.getFoodSuggestions.bind(this);
        this.initUnitSuggestions = this.initUnitSuggestions.bind(this);
        this.updateAmount = this.updateAmount.bind(this);
        this.updateUnit = this.updateUnit.bind(this);
        this.updateName = this.updateName.bind(this);
        this.validateItem = this.validateItem.bind(this);
    }
    componentDidMount() {
        this.initUnitSuggestions();
    }

    addItem() {
        let editItem = {
            name: this.state.name,
            amount: this.state.amount,
            unit: this.state.unit,
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
        if (this.validateItem(editItem)) {
            editItem.name = editItem.name.charAt(0).toUpperCase() + editItem.name.slice(1);
            this.props.createItem(editItem);
            this.setState({
                name: '',
                amount: '',
                unit: '',
                errors: {},
            });
            this.refs.nameInput.focus();
        }

    }
    validateItem(item) {
        let valid = true;
        let errors = {};
        if (!item.name) {
            errors['name'] = 'Fyll i namn'
            valid = false;
        }
        if (!item.amount && item.unit) {
            errors['amount'] = 'Om enhet är anget behöver även mängd anges'
            valid = false;
        }
        this.setState({ errors: errors });
        return valid;
    }
    updateName(name) {
        let errors = this.state.errors;
        delete errors['name'];
        this.setState({
            name: name,
            errors: errors
        });
    }
    updateAmount(amount) {
        let errors = this.state.errors;
        delete errors['amount'];
        this.setState({
            amount: amount,
            errors: errors
        });
    }
    updateUnit(unit) {
        this.setState({
            unit: unit
        });
    }
    handleNewUnit = (unit) => {
        let index = this.state.unitFullNames.indexOf(unit);
        if (index > -1) {
            this.setState({
                unit: this.state.unitNames[index],
            });
        }
        if (this.state.name && this.state.amount) {
            this.addItem();
        }
    };
    handleNewName = (unit) => {
        this.refs.amountInput.focus();

    };
    handleNewAmount = (unit) => {
        this.refs.unitInput.focus();
    };

    getFoodSuggestions() {
        let itemNames = [];
        if (this.props.grocerylistItems) {
            itemNames = this.props.grocerylistItems.map(a => a.name);
        }
        let foodNames = this.props.foods.map(a => a.name);
        for (let i = 0; i < itemNames.length; i++) {
            let index = foodNames.indexOf(itemNames[i]);
            if (index > -1) {
                foodNames.splice(index, 1);
            }
        }
        return foodNames;
    }
    initUnitSuggestions() {
        //om detta blir krävande kanske kallas på flera gånger i onödan så kan jag spara undan det i state.
        //spara en lista med name och fullname på alla units
        let unitNames = [];
        let unitFullNames = [];

        let units = this.props.units;
        for (let type in units) {
            if (units.hasOwnProperty(type)) {
                for (let unit in units[type]) {
                    if (units[type].hasOwnProperty(unit)) {
                        let curUnit = units[type][unit];
                        unitFullNames.push(curUnit.fullName);
                        unitNames.push(curUnit.name);
                    }
                }
            }
        }
        this.setState({
            unitFullNames: unitFullNames,
            unitNames: unitNames,
        })
    }
    render() {

        let foodSuggestions = this.getFoodSuggestions();
        return (<div><ListItem className="groceryitem-new--container">

            <AutoComplete underlineStyle={{display: this.state.errors['name'] ? 'none' : 'block'}} floatingLabelFocusStyle={{ color: '#303f9f' }} className="c-autocomplete groceryitem-autocomplete name" ref="nameInput" searchText={this.state.name} floatingLabelText="Namn" filter={AutoComplete.caseInsensitiveFilter} onUpdateInput={this.updateName} dataSource={foodSuggestions}
                onNewRequest={this.handleNewName} maxSearchResults={6} fullWidth={true} errorText={this.state.errors['name']} errorStyle={{ marginTop: '16px', color: '#f44336' }} />

            <AutoComplete underlineStyle={{display: this.state.errors['amount'] ? 'none' : 'block'}} floatingLabelFocusStyle={{ color: '#303f9f' }} className="c-autocomplete groceryitem-autocomplete amount" ref="amountInput" searchText={this.state.amount} floatingLabelText="Mängd" filter={AutoComplete.caseInsensitiveFilter} onUpdateInput={this.updateAmount} dataSource={[]}
                onNewRequest={this.handleNewAmount} maxSearchResults={6} fullWidth={true} errorText={this.state.errors['amount']} errorStyle={{ marginTop: '16px', color: '#f44336' }} />

            <AutoComplete floatingLabelFocusStyle={{ color: '#303f9f' }} className="c-autocomplete groceryitem-autocomplete unit" ref="unitInput" searchText={this.state.unit} floatingLabelText="Enhet" filter={AutoComplete.caseInsensitiveFilter} onUpdateInput={this.updateUnit} dataSource={this.state.unitFullNames}
                onNewRequest={this.handleNewUnit} maxSearchResults={6} fullWidth={true} />

        </ListItem>
            <ListItem>
                <Button id="saveItem" ref="additembtn" onClick={this.addItem} color="primary" variant="contained">Lägg till</Button>
            </ListItem>
        </div>);

    }
}
export default NewGroceryItem;