require('../styles/main.less');

import './polyfill';

import React from 'react';
import ReactDOM from 'react-dom';

// Set up store
import createStore from './store';
const store = createStore();

// Set up runLoop
import runLoop from './runLoop';
runLoop.setStore(store);
runLoop.start();

// Set up router
import {Router} from 'react-router';

import routes from './config/routes';
import history from './config/history';

// Render root
import {Provider} from 'react-redux';

ReactDOM.render((
  <Provider store={store}>
    <Router history={history}>
      {routes}
    </Router>
  </Provider>
), document.getElementById('container'));
