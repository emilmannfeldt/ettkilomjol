import React, { Component } from 'react';
import './level.css';

class Level extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let level = "";
        if (this.props.index === 1) {
            level = "Lätt";
        } else if (this.props.index === 2) {
            level = "Medel";
        } else if (this.props.index === 3) {
            level = "Svår";
        }

        return (
            <div className="level-wrapper">
                <span className="recipecard-level"> {level}</span>
            </div>
        );
    }
}
export default Level;
