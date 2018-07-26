import React, { Component } from 'react';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import SettingsIcon from '@material-ui/icons/SettingsOutlined';
import RestaurantIcon from '@material-ui/icons/RestaurantMenu';

class FilterChip extends Component {
  constructor(props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);

  }

  handleDelete() {
    this.props.onUserDelete(this.props.text);
  }

  render() {

    let chipClass = "";
    let chiptype = this.props.chipType;
    if (chiptype === 'ingredient') {
      chipClass = 'ingredient-chip';
    }
    else if (chiptype === 'tag') {
      chipClass = 'tag-chip';
    }
    let avatar;
    if (chiptype === "tag") {
      avatar = (<Avatar className="chip-avatar">
        <SettingsIcon />
      </Avatar>);
    } else {
      avatar = (<Avatar className="chip-avatar">
        <RestaurantIcon />
      </Avatar>);
    }

    //lägg till avatar för food/tag istället för färgerna
    return (
      <Chip key={this.props.text} label={this.props.text} onDelete={this.handleDelete} className={chipClass} avatar={avatar} />
    );
  }
}
export default FilterChip;