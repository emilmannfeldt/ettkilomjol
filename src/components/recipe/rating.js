import React, { Component } from 'react';
import StarRatings from 'react-star-ratings';
import PropTypes from 'prop-types';

class Rating extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    const { value, votes } = this.props;
    if (nextProps.value !== value) {
      return true;
    }
    if (nextProps.votes !== votes) {
      return true;
    }
    return false;
  }

  render() {
    const { value, votes } = this.props;
    let voteString = '';
    if (votes > 1) {
      voteString = `${votes} röster`;
    } else if (votes > 0) {
      voteString = '1 röst';
    }
    return (
      <div>
        <div className="rating-wrapper">
          <StarRatings
            rating={Number(value)}
            starDimension="1rem"
            starSpacing="2px"
            starRatedColor="#3f51b5"
            starEmptyColor="rgb(201, 206, 234)"
          />
        </div>
        <div className="rating-votes">{voteString}</div>
      </div>
    );
  }
}
Rating.propTypes = {
  votes: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};
export default Rating;
