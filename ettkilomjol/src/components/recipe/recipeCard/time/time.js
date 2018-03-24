import React, { Component } from 'react';
import './time.css';
import TimerIcon from 'material-ui/svg-icons/image/timer';

class Time extends Component {
    constructor(props) {
        super(props);
    }

    timeString() {
        let hours = Math.floor(this.props.time / 60)
        let minutes = this.props.time % 60;
        if (hours > 0) {
            if(minutes>0){
                return hours + " h " + minutes + " m";
            }
            return hours + " h";
        }
        else {
            return minutes + " m";
        }
    }

    render() {

        return (

            <div className={this.props.time ? 'recipecard-time' : 'hidden'}> <TimerIcon /> {this.timeString() + " | "} </div>

        );
    }
}
export default Time;