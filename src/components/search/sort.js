import React, { Component } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import PropTypes from 'prop-types';

class Sort extends Component {
    styles = {
      menuStyle: {
        marginTop: 0,
        color: 'rgba(255, 255, 255, 0.9)',
      },
      root: {
        float: 'right',
        height: 60,
        color: 'rgba(255, 255, 255, 0.9)',
      },
      floatingLabel: {
        top: 22,
        color: 'rgba(255, 255, 255, 0.9)',
      },
    };

    constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event, index, value) {
      const { filter, onUserInput } = this.props;
      filter.sort = value;
      onUserInput(filter);
    }

    render() {
      const { render, filter } = this.props;
      if (render) {
        return (
          <SelectField
            style={this.styles.root}
            menuStyle={this.styles.menuStyle}
            selectedMenuItemStyle={{ color: 'rgb(0,188,212)' }}
            floatingLabelStyle={this.styles.floatingLabel}
            id="sortselect"
            labelStyle={{ color: 'rgba(255, 255, 255, 0.9)' }}
            floatingLabelText="Sortering"
            value={filter.sort}
            onChange={this.handleChange}
          >
            <MenuItem value="Relevans" primaryText="Relevans" />
            <MenuItem value="Betyg" primaryText="Betyg" />
            <MenuItem value="Popularitet" primaryText="Populäritet" />
            <MenuItem value="Snabbast" primaryText="Snabbast" />
            <MenuItem value="Ingredienser" primaryText="Antal ingredienser" />
          </SelectField>
        );
      }
      return (null);
    }
}
Sort.propTypes = {
  filter: PropTypes.object.isRequired,
  onUserInput: PropTypes.func.isRequired,
  render: PropTypes.bool.isRequired,
};
export default Sort;
