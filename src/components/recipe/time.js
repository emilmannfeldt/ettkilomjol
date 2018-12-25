import React, { Component } from 'react';
import TimerIcon from '@material-ui/icons/Timer';
import PropTypes from 'prop-types';

class Time extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    const { time } = this.props;
    if (nextProps.time !== time) {
      return true;
    }
    return false;
  }

  timeString() {
    const { time } = this.props;
    const hours = Math.floor(time / 60);
    const minutes = time % 60;
    if (hours > 0) {
      if (minutes > 0) {
        return `${hours} h ${minutes} m`;
      }
      return `${hours} h`;
    }
    return `${minutes} m`;
  }

  render() {
    return (
      <div className="recipecard-time">
        {' '}
        <TimerIcon />
        {' '}
        {`${this.timeString()} | `}
        {' '}
      </div>
    );
  }
}
Time.propTypes = {
  time: PropTypes.number.isRequired,
};
export default Time;
