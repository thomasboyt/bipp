require('../styles/main.less');

import './polyfill';

import React from 'react';
import ReactDOM from 'react-dom';

// Set up store
import createStore from './store';
const store = createStore();

// Load songs
// TODO: maybe do this elsewhere...
import songs from './config/songs';
import {loadSongs} from './actions/SongActions';
store.dispatch(loadSongs(songs));

// Set up runLoop
import runLoop from './runLoop';
runLoop.setStore(store);
runLoop.start();

// Set up router

import routes from './config/routes';
import history from './config/history';

import Root from './views/Root';

ReactDOM.render((
  <Root store={store} routes={routes} history={history} />
), document.getElementById('container'));
