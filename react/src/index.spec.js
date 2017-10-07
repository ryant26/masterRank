import React from 'react';
import ReactDOM from 'react-dom';
import {MasterRank} from './containers/MasterRank.js';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MasterRank />, div);
});
