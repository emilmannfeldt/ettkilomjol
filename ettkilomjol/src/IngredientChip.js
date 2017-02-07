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
      margin: 4,
    },
    wrapper: {
      display: 'flex',
      flexWrap: 'wrap',
    },
  };

  handleDelete() {
    this.props.onUserDelete(this.props.text);
  }

  render() {
    return (
      <Chip key={ this.props.text } onRequestDelete={ this.handleDelete } style={ this.styles.chip }>
        { this.props.text }
      </Chip>
      );
  }

}
export default IngredientChip;
