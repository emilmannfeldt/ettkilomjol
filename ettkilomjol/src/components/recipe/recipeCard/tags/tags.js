import React, { Component } from 'react';
import './tags.css';

class Tags extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let tags = [];
        for (let i = 0; i < this.props.matchedTags.length; i++) {
            tags.push(<span class="recipecard-tag">this.props.matchedTags[i]</span>);
        }

        return (

            <div className="tags-wrapper">
          {tags}
        </div>
        );
    }
}
export default Tags;
