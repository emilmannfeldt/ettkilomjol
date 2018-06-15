import React, { Component } from 'react';
import './sort.css';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

class Sort extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }
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
        }
    };

    handleChange(event, index, value) {
        let newFilter = this.props.filter;
        newFilter.sort = value;
        this.props.onUserInput(newFilter);

    } render() {
        if (this.props.render) {
            return (<SelectField
                style={this.styles.root}
                menuStyle={this.styles.menuStyle}
                selectedMenuItemStyle={{ color: 'rgb(0,188,212)' }}
                floatingLabelStyle={this.styles.floatingLabel}
                id="sortselect"
                labelStyle={{ color: 'rgba(255, 255, 255, 0.9)' }}
                floatingLabelText="Sortering"
                value={this.props.filter.sort}
                onChange={this.handleChange}
            >
                <MenuItem value={'Relevans'} primaryText="Relevans" />
                <MenuItem value={'Betyg'} primaryText="Betyg" />
                <MenuItem value={'Popularitet'} primaryText="Populäritet" />
                <MenuItem value={'Snabbast'} primaryText="Snabbast" />
                <MenuItem value={'Ingredienser'} primaryText="Antal ingredienser" />
            </SelectField>);
        } else {
            return (null);
        }
    }
}
export default Sort;



