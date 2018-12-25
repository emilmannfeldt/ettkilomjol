import React, { Component } from 'react';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import PropTypes from 'prop-types';
import SettingsIcon from '@material-ui/icons/SettingsOutlined';
import RestaurantIcon from '@material-ui/icons/RestaurantMenu';

class FilterChip extends Component {
  constructor(props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete() {
    const { onUserDelete, text } = this.props;
    onUserDelete(text);
  }

  render() {
    const { chipType, text } = this.props;
    let chipClass = '';
    if (chipType === 'ingredient') {
      chipClass = 'ingredient-chip';
    } else if (chipType === 'tag') {
      chipClass = 'tag-chip';
    }
    let avatar;
    if (chipType === 'tag') {
      avatar = (
        <Avatar className="chip-avatar">
          <SettingsIcon />
        </Avatar>
      );
    } else {
      avatar = (
        <Avatar className="chip-avatar">
          <RestaurantIcon />
        </Avatar>
      );
    }

    // lägg till avatar för food/tag istället för färgerna
    return (
      <Chip key={text} label={text} onDelete={this.handleDelete} className={chipClass} avatar={avatar} />
    );
  }
}
FilterChip.propTypes = {
  chipType: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  onUserDelete: PropTypes.func.isRequired,
};
export default FilterChip;
