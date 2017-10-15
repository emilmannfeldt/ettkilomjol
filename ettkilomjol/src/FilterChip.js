import React, { Component } from 'react';
import Chip from 'material-ui/Chip';
import './App.css';


class FilterChip extends Component {
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

    let chipClass = "";
    let chiptype = this.props.chipType;
    if (this.props.chipType == 'ingredient') {
      chipClass = 'ingredient-chip';
    }
    else if (this.props.chipType == 'tag') {
      chipClass = 'tag-chip';
    }

    return (
      <Chip key={ this.props.text } onRequestDelete={ this.handleDelete } className={chipClass}>
        { this.props.text }
      </Chip>
    );
  }

}
export default FilterChip;
