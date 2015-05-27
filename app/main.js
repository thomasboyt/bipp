require('../styles/main.less');

import React from 'react';
import Router from 'react-router';

import routes from './config/routes';
import flux from './flux';

const router = Router.create({
  routes: routes
});

import FluxComponent from 'flummox/component';

router.run((Handler, state) => {
  React.render((
    <FluxComponent flux={flux}>
      <Handler params={state.params} query={state.query} />
    </FluxComponent>
  ), document.getElementById('container'));
});
