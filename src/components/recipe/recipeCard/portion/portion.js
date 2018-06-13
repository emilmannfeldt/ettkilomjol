import React, { Component } from 'react';
import './portion.css';

class Portion extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        return (
            <div className="recipecard-portion">Portioner: {this.props.portions}</div>
        );
    }
}
export default Portion;
