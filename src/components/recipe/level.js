import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Level extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    const { index } = this.props;
    if (nextProps.index !== index) {
      return true;
    }
    return false;
  }

  render() {
    const { index } = this.props;
    const levels = ['', 'Lätt', 'Medel', 'Svårt'];
    return (
      <div className="recipecard-level">
        {' '}
        {levels[index]}
      </div>
    );
  }
}
Level.propTypes = {
  index: PropTypes.number.isRequired,
};
export default Level;
