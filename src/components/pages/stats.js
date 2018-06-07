import React, { Component } from 'react';
import './stats.css';

class Stats extends Component {
    constructor(props) {
        super(props);
    }

    timeString() {

    }

    render() {

        return (

            <div>  {this.props.tags[0].name} </div>

        );
    }
}
export default Stats;