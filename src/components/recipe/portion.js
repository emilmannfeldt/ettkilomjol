import React, { Component } from 'react';

class Portion extends Component {
    render() {
        return (
            <div className="recipecard-portion">Portioner: {this.props.portions}</div>
        );
    }
}
export default Portion;