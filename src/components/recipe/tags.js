import React, { Component } from 'react';

class Tags extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.matchedTags.length !== this.props.matchedTags.length) {
            return true;
        }
        if (nextProps.recipeTags !== this.props.recipeTags) {
            return true;
        }
        if (nextProps.recipeTags && this.props.recipeTags) {
            if (Object.keys(nextProps.recipeTags).length !== Object.keys(this.props.recipeTags).length) {
                return true;
            }
        }
        return false;
    }
    render() {
        let tags = [];
        for (let i = 0; i < this.props.matchedTags.length; i++) {
            tags.push(<span key={this.props.matchedTags[i]} className="recipecard-tag-matched">{this.props.matchedTags[i]}</span>);
        }
        for (let tag in this.props.recipeTags) {
            if (this.props.recipeTags.hasOwnProperty(tag) && this.props.matchedTags.indexOf(tag) < 0) {
                tags.push(<span key={this.props.recipeKey + tag} className="recipecard-tag-unmatched">{tag}</span>);
            }
        }

        return (
            <div className="tags-wrapper">
                {tags}
            </div>
        );
    }
}
export default Tags;