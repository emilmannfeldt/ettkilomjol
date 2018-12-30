import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Tags extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    const { matchedTags, recipeTags } = this.props;
    if (nextProps.matchedTags.length !== matchedTags.length) {
      return true;
    }
    if (nextProps.recipeTags !== recipeTags) {
      return true;
    }
    if (nextProps.recipeTags && recipeTags) {
      if (Object.keys(nextProps.recipeTags).length !== Object.keys(recipeTags).length) {
        return true;
      }
    }
    return false;
  }

  render() {
    const { matchedTags, recipeTags, recipeKey } = this.props;

    const matched = matchedTags.map(x => (<span key={recipeKey + x} className="recipecard-tag-matched">{x}</span>));
    const unmatched = Object.keys(recipeTags).reduce((result, tag) => {
      if (!matchedTags.includes(tag)) {
        result.push(<span key={recipeKey + tag} className="recipecard-tag-unmatched">{tag}</span>);
      }
      return result;
    }, []);

    const tags = matched.concat(unmatched);

    return (
      <div className="tags-wrapper">
        {tags}
      </div>
    );
  }
}
Tags.propTypes = {
  matchedTags: PropTypes.array.isRequired,
  recipeTags: PropTypes.object.isRequired,
  recipeKey: PropTypes.string.isRequired,
};
export default Tags;
