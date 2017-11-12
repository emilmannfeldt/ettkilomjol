import React, { Component } from 'react';
import './sort.css';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

class Sort extends Component {
    constructor(props) {
        super(props);
    }
    styles = {
        menuStyle: {
            marginTop: 0,
            
        },
        root: {
            float: 'right',
            height: 60,
            color: 'blue'
        },
        floatingLabel: {
            top: 22
        }
    };
    handleChange = (event, index, value) => this.props.onChange(value);
    render() {
        return (
            <SelectField
                style={this.styles.root}
                menuStyle={this.styles.menuStyle}
                selectedMenuItemStyle={{color:'rgb(0,188,212)'}}
                floatingLabelStyle={this.styles.floatingLabel}
                id="sortselect"
                floatingLabelText="Sortering"
                value={this.props.value}
                onChange={this.handleChange}
            >
                <MenuItem value={'Relevans'} primaryText="Relevans" />
                <MenuItem value={'Betyg'} primaryText="Betyg" />
            </SelectField>
        );
    }
}
export default Sort;



