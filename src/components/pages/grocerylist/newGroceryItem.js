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
            errorText: '',
        };
        this.addItem = this.addItem.bind(this);
        this.getFoodSuggestions = this.getFoodSuggestions.bind(this);
        this.initUnitSuggestions = this.initUnitSuggestions.bind(this);
        this.updateAmount = this.updateAmount.bind(this);
        this.updateUnit = this.updateUnit.bind(this);
        this.updateName = this.updateName.bind(this);
        this.validateItem = this.validateItem.bind(this);
        this.getError = this.getError.bind(this);
    }
    componentDidMount() {
        this.initUnitSuggestions();
    }
    getError() {
        return this.state.errorText;
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
                errorText: '',
            });
            this.refs.nameInput.focus();
        }

    }
    validateItem(item) {
        //lägga alla felmeddelanden i snackbar eller under det relevanta inputfältet?
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
    updateName(name) {
        this.setState({
            name: name
        });
    }
    updateAmount(amount) {
        this.setState({
            amount: amount
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
        //behöver lära mig flexbox osv för att fixa till dessa fält.
        //          menuProps={menuProps} kanske kan fixa mina problem i mobilen. med hur menyn better sig
        //https://v0.material-ui.com/#/components/auto-complete
        let foodSuggestions = this.getFoodSuggestions();
        return (<div><ListItem className="groceryitem-new--container">

            <AutoComplete className="c-autocomplete groceryitem-autocomplete name" ref="nameInput" searchText={this.state.name} floatingLabelText="Namn" filter={AutoComplete.caseInsensitiveFilter} onUpdateInput={this.updateName} dataSource={foodSuggestions}
                onNewRequest={this.handleNewName} maxSearchResults={6} fullWidth={true} />

            <AutoComplete className="c-autocomplete groceryitem-autocomplete amount" ref="amountInput" searchText={this.state.amount} floatingLabelText="Mängd" filter={AutoComplete.caseInsensitiveFilter} onUpdateInput={this.updateAmount} dataSource={[]}
                onNewRequest={this.handleNewAmount} maxSearchResults={6} fullWidth={true} />

            <AutoComplete className="c-autocomplete groceryitem-autocomplete unit" ref="unitInput" searchText={this.state.unit} floatingLabelText="Enhet" filter={AutoComplete.caseInsensitiveFilter} onUpdateInput={this.updateUnit} dataSource={this.state.unitFullNames}
                onNewRequest={this.handleNewUnit} maxSearchResults={6} fullWidth={true} />

            </ListItem>
            <ListItem>
                <Button id="saveItem" ref="additembtn" onClick={this.addItem} color="secondary" variant="contained">Lägg till</Button>
                {this.getError()}
            </ListItem>
        </div>);

    }
}
export default NewGroceryItem;