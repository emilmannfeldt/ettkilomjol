import React, { Component } from 'react';
import Chip from '@material-ui/core/Chip';

class QuickTags extends Component {

  addTag(tagName) {
    let newFilter = this.props.filter;
    newFilter.tags.push(tagName);
    this.props.onUserInput(newFilter);
  }

  render() {
    let chips = [];
    let tagsToDisplay = 20;
    if (this.props.recipeListRendered) {
      tagsToDisplay = 8;
    }
    for (let i = 0; i < this.props.tags.length; i++) {
      if (this.props.filter.tags.indexOf(this.props.tags[i].name) < 0) {
        chips.push(<Chip key={chips.length} label={this.props.tags[i].name} onClick={() => this.addTag(this.props.tags[i].name)} className="quick-tag" />);
      }
      if (chips.length >= tagsToDisplay) {
        break;
      }
    }

    return (
      <div className={this.props.recipeListRendered ? 'quickchip-wrapper' : 'quickchip-wrapper quick-tags-norecipes'}>
        {chips}
      </div>
    );
  }
}
export default QuickTags;