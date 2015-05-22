import Flummox from 'flummox';
import EditorStore from './stores/EditorStore';
import EditorActions from './actions/EditorActions';

class Flux extends Flummox {
  constructor() {
    super();
    this.createActions('editor', EditorActions);
    this.createStore('editor', EditorStore, this);
  }
}

const flux = new Flux();

import React from 'react';
import Router from 'react-router';
import routes from './config/routes';

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
