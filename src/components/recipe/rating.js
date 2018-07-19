import React, { Component } from 'react';

class Rating extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.value != this.props.value) {
            return true;
        }
        if (nextProps.votes != this.props.votes) {
            return true;
        }
        return false;
    }
    render() {
        let ratingPercentage = Math.round(this.props.value * 20);
        let votes = "";
        if (this.props.votes > 1) {
            votes = this.props.votes + " röster";
        } else if (this.props.votes > 0) {
            votes = "1 röst";
        }
        return (
            
            <div>
                <div className="rating-wrapper" title={this.props.value}>
                    <div className="rating-wrapper-top" style={{ width: ratingPercentage + '%' }}><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
                    <div className="rating-wrapper-bottom"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
                </div>
                <div className="rating-votes">{votes}</div>
            </div>
        );
    }
}
export default Rating;