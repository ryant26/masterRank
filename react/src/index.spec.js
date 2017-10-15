import React from 'react';
import ReactDOM from 'react-dom';
import { FireTeam } from './containers/FireTeam.js';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<FireTeam />, div);
});
