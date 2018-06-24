import React, { Component } from 'react';
import './portion.css';

class Portion extends Component {
    render() {
        return (
            <div className="recipecard-portion">Portioner: {this.props.portions}</div>
        );
    }
}
export default Portion;