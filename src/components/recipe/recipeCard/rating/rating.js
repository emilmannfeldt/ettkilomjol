import React, { Component } from 'react';
import './rating.css';

class Rating extends Component {
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