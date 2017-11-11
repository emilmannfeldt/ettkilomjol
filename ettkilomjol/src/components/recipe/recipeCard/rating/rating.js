import React, { Component } from 'react';
import './rating.css';
import GradeIcon from 'material-ui/svg-icons/action/grade';

class Rating extends Component {
    constructor(props) {
        super(props);
    }
    styles = {
        top: {
        }
    };

    render() {
        let ratingPercentage = Math.round(this.props.value * 20);
        this.styles.top.width = ratingPercentage + "%";
        let votes = "";
        if(this.props.votes > 1){
            votes= this.props.votes + " röster";
        }else if(this.props.votes>0){
            votes= "1 röst";    
        }
        return (
            <div>
                <div className="rating-wrapper" title={this.props.value}>
                    <div className="rating-wrapper-top" style={this.styles.top}><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
                    <div className="rating-wrapper-bottom"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
                </div >
                <span className="rating-votes">{votes}</span>
            </div>
        );
    }
}
export default Rating;
