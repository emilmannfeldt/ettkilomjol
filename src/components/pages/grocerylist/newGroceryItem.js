/* eslint react/no-string-refs:0 */
import React, { Component } from 'react';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import AutoComplete from 'material-ui/AutoComplete';
import PropTypes from 'prop-types';

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

  getFoodSuggestions() {
    const { grocerylistItems, foods } = this.props;
    let itemNames = [];
    if (grocerylistItems) {
      itemNames = grocerylistItems.map(a => a.name);
    }
    const foodNames = foods.map(a => a.name);
    for (let i = 0; i < itemNames.length; i++) {
      const index = foodNames.indexOf(itemNames[i]);
      if (index > -1) {
        foodNames.splice(index, 1);
      }
    }
    return foodNames;
  }

  handleNewUnit = (unit) => {
    const {
      unitFullNames, unitNames, name, amount,
    } = this.state;
    const index = unitFullNames.indexOf(unit);
    if (index > -1) {
      this.setState({
        unit: unitNames[index],
      });
    }
    if (name && amount) {
      this.addItem();
    }
  };

  handleNewName = () => {
    this.refs.amountInput.focus();
  };

  handleNewAmount = () => {
    this.refs.unitInput.focus();
  };

  addItem() {
    const {
      name, amount, unit,
    } = this.state;
    const { createItem } = this.props;
    const editItem = {
      name,
      amount,
      unit,
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
    if (this.validateItem(editItem)) {
      editItem.name = editItem.name.charAt(0).toUpperCase() + editItem.name.slice(1);
      createItem(editItem);
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
    const errors = {};
    if (!item.name) {
      errors.name = 'Fyll i namn';
      valid = false;
    }
    if (!item.amount && item.unit) {
      errors.amount = 'Om enhet är anget behöver även mängd anges';
      valid = false;
    }
    this.setState({ errors });
    return valid;
  }

  updateName(name) {
    const { errors } = this.state;
    delete errors.name;
    this.setState({
      name,
      errors,
    });
  }

  updateAmount(amount) {
    const { errors } = this.state;
    delete errors.amount;
    this.setState({
      amount,
      errors,
    });
  }

  updateUnit(unit) {
    this.setState({
      unit,
    });
  }

  initUnitSuggestions() {
    const { units } = this.props;

    const { unitNames, unitFullNames } = Object.keys(units).reduce((result_, type) => {
      const result = result_;
      const names = units[type].map(x => x.name);
      const fullNames = units[type].map(x => x.fullName);
      result.unitNames = result.unitNames.concat(names);
      result.unitFullNames = result.unitFullNames.concat(fullNames);
      return result;
    }, { unitNames: [], unitFullNames: [] });

    this.setState({
      unitFullNames,
      unitNames,
    });
  }

  render() {
    const {
      errors, name, amount, unit, unitFullNames,
    } = this.state;
    const foodSuggestions = this.getFoodSuggestions();
    return (
      <div>
        <ListItem className="groceryitem-new--container">

          <AutoComplete
            underlineStyle={{ display: errors.name ? 'none' : 'block' }}
            floatingLabelFocusStyle={{ color: '#303f9f' }}
            className="c-autocomplete groceryitem-autocomplete name"
            ref="nameInput"
            searchText={name}
            floatingLabelText="Namn"
            filter={AutoComplete.caseInsensitiveFilter}
            onUpdateInput={this.updateName}
            dataSource={foodSuggestions}
            onNewRequest={this.handleNewName}
            maxSearchResults={6}
            fullWidth
            errorText={errors.name}
            errorStyle={{ marginTop: '16px', color: '#f44336' }}
          />

          <AutoComplete
            underlineStyle={{ display: errors.amount ? 'none' : 'block' }}
            floatingLabelFocusStyle={{ color: '#303f9f' }}
            className="c-autocomplete groceryitem-autocomplete amount"
            ref="amountInput"
            searchText={amount}
            floatingLabelText="Mängd"
            filter={AutoComplete.caseInsensitiveFilter}
            onUpdateInput={this.updateAmount}
            dataSource={[]}
            onNewRequest={this.handleNewAmount}
            maxSearchResults={6}
            fullWidth
            errorText={errors.amount}
            errorStyle={{ marginTop: '16px', color: '#f44336' }}
          />

          <AutoComplete
            floatingLabelFocusStyle={{ color: '#303f9f' }}
            className="c-autocomplete groceryitem-autocomplete unit"
            ref="unitInput"
            searchText={unit}
            floatingLabelText="Enhet"
            filter={AutoComplete.caseInsensitiveFilter}
            onUpdateInput={this.updateUnit}
            dataSource={unitFullNames}
            onNewRequest={this.handleNewUnit}
            maxSearchResults={6}
            fullWidth
          />

        </ListItem>
        <ListItem>
          <Button id="saveItem" ref="additembtn" onClick={this.addItem} color="primary" variant="contained">Lägg till</Button>
        </ListItem>
      </div>
    );
  }
}
NewGroceryItem.propTypes = {
  units: PropTypes.any.isRequired,
  createItem: PropTypes.func.isRequired,
  foods: PropTypes.array.isRequired,
  grocerylistItems: PropTypes.array.isRequired,
};
export default NewGroceryItem;
