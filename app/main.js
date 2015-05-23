import Flummox from 'flummox';
import EditorStore from './stores/EditorStore';
import EditorActions from './actions/EditorActions';
import AudioStore from './stores/AudioStore';
import AudioActions from './actions/AudioActions';

class Flux extends Flummox {
  constructor() {
    super();
    this.createActions('editor', EditorActions);
    this.createStore('editor', EditorStore, this);
    this.createActions('audio', AudioActions);
    this.createStore('audio', AudioStore, this);
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
