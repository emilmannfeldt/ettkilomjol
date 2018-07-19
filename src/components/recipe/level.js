import React, { Component } from 'react';

class Level extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.index != this.props.index) {
            return true;
        }
        return false;
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
            <div className="recipecard-level"> {level}</div>
        );
    }
}
export default Level;