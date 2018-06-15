import React, { Component } from 'react';
import Chip from 'material-ui/Chip';

import './quickTags.css';

class QuickTags extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: this.props.filter.tags,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    let newFilter = this.props.filter;
    newFilter.tags = this.state.tags;
    this.props.onUserInput(newFilter);
  }

  addTag(tagName) {
    let newTags = this.state.tags;
    newTags.push(tagName);
    this.setState({
      tags: newTags
    });
    this.handleChange();
  }

  render() {
    let chips = [];
    let tagsToDisplay = 20;
    if(this.props.recipeListRendered){
      tagsToDisplay = 8;
    }
    for (let i = 0; i < this.props.tags.length; i++) {
      if(this.props.filter.tags.indexOf(this.props.tags[i].name) < 0){
        chips.push(<Chip key={chips.length}  onClick={() => this.addTag(this.props.tags[i].name)} className="quick-tag">
          {this.props.tags[i].name}
        </Chip>);
      }
      if(chips.length >= tagsToDisplay){
        break;
      }
    }

    return (
      <div className={this.props.recipeListRendered ? 'chip-wrapper' : 'chip-wrapper quick-tags-norecipes'}>
        {chips}
      </div>
    );
  }
}
export default QuickTags;