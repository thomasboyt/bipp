require('../styles/main.less');

import React from 'react';
import ReactDOM from 'react-dom';
import Router from 'react-router';

import routes from './config/routes';
import {Provider} from 'react-redux';

import createStore from './store';

const router = Router.create({
  routes: routes
});

const store = createStore();

router.run((Handler, state) => {
  ReactDOM.render((
    <Provider store={store}>
      <Handler params={state.params} query={state.query} />
    </Provider>
  ), document.getElementById('container'));
});
