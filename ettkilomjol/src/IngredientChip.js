import React, { Component } from 'react';
import Chip from 'material-ui/Chip';
import './App.css';


class IngredientChip extends Component {
  constructor(props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);

  }
  styles = {
    chip: {
      marginTop: 4,
      marginRight: 4,
      backgroundColor: (239, 108, 0, 0.7),
    }
  };

  handleDelete() {
    this.props.onUserDelete(this.props.text);
  }

  render() {
    return (
      <Chip key={ this.props.text } onRequestDelete={ this.handleDelete } className="ingredient-chip">
        { this.props.text }
      </Chip>
      );
  }

}
export default IngredientChip;
