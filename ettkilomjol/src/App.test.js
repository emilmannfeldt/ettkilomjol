import React from 'react';
import ReactDOM from 'react-dom';
import FilterableRecipeList from './FilterableRecipeList';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<FilterableRecipeList />, div);
});
