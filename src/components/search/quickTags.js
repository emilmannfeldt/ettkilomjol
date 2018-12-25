import React, { Component } from 'react';
import Chip from '@material-ui/core/Chip';
import PropTypes from 'prop-types';

class QuickTags extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quickIndexesToSkip: [],
    };
  }

  componentDidMount() {
    const randoms = [...Array(80)].map(_ => Math.ceil(Math.random() * 100));

    // console.log(randoms)
    this.setState({
      quickIndexesToSkip: randoms,
    });
  }

  addTag(tagName) {
    const { filter, onUserInput } = this.props;
    filter.tags.push(tagName);
    onUserInput(filter);
  }


  render() {
    const { filter, recipeListRendered, tags } = this.props;
    const { quickIndexesToSkip } = this.state;
    const chips = [];
    let tagsToDisplay = 20;
    if (recipeListRendered) {
      tagsToDisplay = 8;
    }
    for (let i = 0; i < tags.length; i++) {
      if (filter.tags.indexOf(tags[i].name) < 0 && quickIndexesToSkip.indexOf(i) < 0) {
        chips.push(<Chip key={chips.length} label={tags[i].name} onClick={() => this.addTag(tags[i].name)} className="quick-tag" />);
      }
      if (chips.length >= tagsToDisplay) {
        break;
      }
    }

    return (
      <div className={recipeListRendered ? 'quickchip-wrapper' : 'quickchip-wrapper quick-tags-norecipes'}>
        {chips}
      </div>
    );
  }
}
QuickTags.propTypes = {
  onUserInput: PropTypes.func.isRequired,
  tags: PropTypes.array.isRequired,
  filter: PropTypes.object.isRequired,
  recipeListRendered: PropTypes.bool.isRequired,
};
export default QuickTags;
