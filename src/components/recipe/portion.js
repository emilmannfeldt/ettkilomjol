import React, { Component } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import PropTypes from 'prop-types';

class Portion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedPortionIndex: 1,
    };
  }

    handleChange = name => (event) => {
      const { portionsUpdate } = this.props;
      this.setState({
        [name]: event.target.value,
      });
      portionsUpdate(event.target.value);
    };

    render() {
      const { portions } = this.props;
      const { selectedPortionIndex } = this.state;
      let portionValue;
      let portionText = '';
      const options = [];

      if (portions) {
        if (!isNaN(portions)) {
          portionValue = Number(portions);
          portionText = 'portioner';
        } else {
          const splited = portions.split(' ');
          if (splited.length > 1 && !isNaN(splited[0])) {
            portionValue = Number(splited[0]);
            portionText = portions.substr(portions.indexOf(splited[1]));
          }
        }
        if (portionValue === 1) {
          options.push(<MenuItem key={0} value={1}>{`${1} ${portionText}`}</MenuItem>);
          options.push(<MenuItem key={1} value={2}>{`${2} ${portionText}`}</MenuItem>);
          options.push(<MenuItem key={2} value={3}>{`${3} ${portionText}`}</MenuItem>);
          options.push(<MenuItem key={3} value={4}>{`${4} ${portionText}`}</MenuItem>);
          options.push(<MenuItem key={4} value={5}>{`${5} ${portionText}`}</MenuItem>);
          options.push(<MenuItem key={5} value={6}>{`${6} ${portionText}`}</MenuItem>);
          options.push(<MenuItem key={6} value={8}>{`${8} ${portionText}`}</MenuItem>);
        } else if (portionValue === 3) {
          options.push(<MenuItem key={0} value={1}>{`${1} ${portionText}`}</MenuItem>);
          options.push(<MenuItem key={1} value={2}>{`${2} ${portionText}`}</MenuItem>);
          options.push(<MenuItem key={2} value={3}>{`${3} ${portionText}`}</MenuItem>);
          options.push(<MenuItem key={3} value={4}>{`${4} ${portionText}`}</MenuItem>);
          options.push(<MenuItem key={4} value={5}>{`${5} ${portionText}`}</MenuItem>);
          options.push(<MenuItem key={5} value={6}>{`${6} ${portionText}`}</MenuItem>);
          options.push(<MenuItem key={6} value={9}>{`${9} ${portionText}`}</MenuItem>);
        } else {
          options.push(<MenuItem key={0} value={0.5}>{`${Math.floor(portionValue * 0.5)} ${portionText}`}</MenuItem>);
          options.push(<MenuItem key={1} value={1}>{`${portionValue * 1} ${portionText}`}</MenuItem>);
          options.push(<MenuItem key={2} value={1.5}>{`${Math.round(portionValue * 1.5)} ${portionText}`}</MenuItem>);
          options.push(<MenuItem key={3} value={2}>{`${portionValue * 2} ${portionText}`}</MenuItem>);
          options.push(<MenuItem key={4} value={2.5}>{`${Math.round(portionValue * 2.5)} ${portionText}`}</MenuItem>);
          options.push(<MenuItem key={5} value={3}>{`${portionValue * 3} ${portionText}`}</MenuItem>);
          options.push(<MenuItem key={6} value={4}>{`${portionValue * 4} ${portionText}`}</MenuItem>);
        }
      }

      if (portionValue) {
        return (
          <div className="recipecard-portion">
            <Select
              value={selectedPortionIndex}
              onChange={this.handleChange('selectedPortionIndex')}
              displayEmpty
              inputProps={{
                name: 'selectedPortionIndex',
                id: 'portion-simple',
              }}
            >
              {options}
            </Select>

          </div>
        );
      }
      return (
        <div className="recipecard-portion">
          {portions}
        </div>
      );
    }
}
Portion.propTypes = {
  portions: PropTypes.number.isRequired,
  portionsUpdate: PropTypes.func.isRequired,
};
export default Portion;
