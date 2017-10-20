import React, { Component } from 'react';
import './bakeTime.css';
import TimerIcon from 'material-ui/svg-icons/image/timer';

class BakeTime extends Component {
    constructor(props) {
        super(props);
    }

    timeString() {
        let hours = Math.floor(this.props.time / 60)
        let minutes = this.props.time % 60;
        if (hours > 0) {
            return hours + " h " + minutes + " m";
        }
        else {
            return minutes + " m";
        }
    }

    render() {
        return (
            <div><TimerIcon /> {this.timeString()}</div>
        );
    }
}
export default BakeTime;