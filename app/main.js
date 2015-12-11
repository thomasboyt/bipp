// XXX: I've currently disabled this and I'm just using regenerator-runtime for dev because using
// the polyfilled promise library breaks stack traces:
// import 'babel-polyfill';

import 'babel-regenerator-runtime';

require('../styles/main.less');

import React from 'react';
import ReactDOM from 'react-dom';

import {Provider} from 'react-redux';

import createStore from './store';

import createPlaybackRunLoop from './runLoop';

const store = createStore();

createPlaybackRunLoop(store);

// Set up router
import routes from './config/routes';
import {Router} from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';
let history = createBrowserHistory();

ReactDOM.render((
  <Provider store={store}>
    <Router history={history}>
      {routes}
    </Router>
  </Provider>
), document.getElementById('container'));
